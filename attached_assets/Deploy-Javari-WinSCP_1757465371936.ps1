param(
  [Parameter(Mandatory=$true)][string]$Server,
  [Parameter(Mandatory=$true)][string]$User,
  [Parameter(Mandatory=$true)][string]$Password,
  [Parameter(Mandatory=$true)][string]$Domain,
  [Parameter(Mandatory=$true)][string]$RoyUser,
  [Parameter(Mandatory=$true)][string]$RoyPass,
  [Parameter(Mandatory=$true)][string]$CindyUser,
  [Parameter(Mandatory=$true)][string]$CindyPass,
  [switch]$NoTLS
)

$ErrorActionPreference = "Stop"

# --- Download WinSCP portable automation package ---
$TempDir = Join-Path $env:TEMP ("winscp_" + [guid]::NewGuid())
New-Item -Path $TempDir -ItemType Directory -Force | Out-Null
$ZipUrl = "https://winscp.net/download/WinSCP-6.3.4-Automation.zip"
$ZipPath = Join-Path $TempDir "winscp.zip"
Invoke-WebRequest -Uri $ZipUrl -OutFile $ZipPath -UseBasicParsing

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($ZipPath, $TempDir)

$WinSCPDll = Get-ChildItem -Path $TempDir -Recurse -Filter "WinSCPnet.dll" | Select-Object -First 1
$WinSCPExe = Get-ChildItem -Path $TempDir -Recurse -Filter "WinSCP.exe" | Select-Object -First 1
Add-Type -Path $WinSCPDll.FullName

# --- Zip app bundle (app/ + requirements.txt) ---
$Bundle = Join-Path $PWD "javari_app.zip"
if (Test-Path $Bundle) { Remove-Item $Bundle -Force }
Compress-Archive -Path (Join-Path $PWD "app"), (Join-Path $PWD "requirements.txt") -DestinationPath $Bundle -Force

# --- Open SFTP session (no prompts) ---
$sessionOptions = New-Object WinSCP.SessionOptions -Property @{
  Protocol = [WinSCP.Protocol]::Sftp
  HostName = $Server
  UserName = $User
  Password = $Password
  SshHostKeyPolicy = [WinSCP.SshHostKeyPolicy]::GiveUpSecurityAndAcceptAny
}
$session = New-Object WinSCP.Session
$session.ExecutablePath = $WinSCPExe.FullName
$session.Open($sessionOptions)

# --- Upload bundle + temp files ---
$RemoteDir = "/opt/javari"
$null = $session.ExecuteCommand("sudo mkdir -p $RemoteDir && sudo chown -R ${User}:${User} $RemoteDir")

$transferOptions = New-Object WinSCP.TransferOptions
$transferOptions.TransferMode = [WinSCP.TransferMode]::Binary
$session.PutFiles($Bundle, ($RemoteDir + "/javari_app.zip"), $False, $transferOptions).Check()

# systemd unit
$UnitContent = @"
[Unit]
Description=Javari FastAPI Service
After=network.target

[Service]
User=$User
WorkingDirectory=/opt/javari
Environment=ROY_USER=$RoyUser
Environment=ROY_PASS=$RoyPass
Environment=CINDY_USER=$CindyUser
Environment=CINDY_PASS=$CindyPass
Environment=PORT=8001
ExecStart=/opt/javari/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
"@
$LocalUnit = Join-Path $env:TEMP "javari.service"
$UnitContent | Set-Content -Path $LocalUnit -Encoding ascii
$session.PutFiles($LocalUnit, "/tmp/javari.service").Check()

# nginx conf
$NginxContent = @"
server {
    listen 80;
    server_name $Domain;

    location / {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /health {
        proxy_pass http://127.0.0.1:8001/health;
    }
}
"@
$LocalNginx = Join-Path $env:TEMP "javari_nginx.conf"
$NginxContent | Set-Content -Path $LocalNginx -Encoding ascii
$session.PutFiles($LocalNginx, "/tmp/javari_nginx.conf").Check()

function Run($cmd) {
  $res = $session.ExecuteCommand($cmd)
  if ($res.ExitStatus -ne 0) { throw "Remote command failed ($($res.ExitStatus)):`n$($res.Output)" }
}

# --- Server configuration ---
Run "sudo apt-get update -y"
Run "sudo apt-get install -y python3-venv python3-pip nginx unzip curl"

Run "cd /opt/javari && unzip -o javari_app.zip && python3 -m venv .venv && . .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt"

Run "sudo mv /tmp/javari.service /etc/systemd/system/javari.service && sudo systemctl daemon-reload && sudo systemctl enable --now javari"

Run "sudo rm -f /etc/nginx/sites-enabled/javari /etc/nginx/sites-available/javari"
Run "sudo mv /tmp/javari_nginx.conf /etc/nginx/sites-available/javari && sudo ln -s /etc/nginx/sites-available/javari /etc/nginx/sites-enabled/javari"
Run "sudo nginx -t"
Run "sudo systemctl restart nginx"

if (-not $NoTLS) {
  Run "sudo apt-get install -y certbot python3-certbot-nginx"
  Run "sudo certbot --nginx -d $Domain --non-interactive --agree-tos -m admin@$Domain || true"
}

# Health checks
Run "curl -sS http://127.0.0.1:8001/health || true"

$session.Dispose()

try {
  Start-Sleep -Seconds 2
  $resp = Invoke-WebRequest -Uri ("http://{0}/health" -f $Domain) -UseBasicParsing -TimeoutSec 15
  Write-Host "Health: $($resp.Content)" -ForegroundColor Green
} catch {
  Write-Warning "Health over domain failed (DNS/propagation). Try http://$Server/health"
}

Write-Host "DONE. Visit: http://$Domain  (login at '/')" -ForegroundColor Cyan

