
param(
  [Parameter(Mandatory=$true)][string]$Server,
  [Parameter(Mandatory=$true)][string]$User,
  [Parameter(Mandatory=$true)][string]$Domain,
  [string]$RoyUser,
  [string]$RoyPass,
  [string]$CindyUser,
  [string]$CindyPass,
  [switch]$NoTLS
)
$ErrorActionPreference = "Stop"
function SSH($cmd) { ssh -o StrictHostKeyChecking=no "$User@$Server" $cmd }
function SCP($src, $dst) { scp -o StrictHostKeyChecking=no -r $src "$User@$Server:$dst" }

Write-Host "==> Packaging app"; $zip = Join-Path $PSScriptRoot "javari_app.zip"; if (Test-Path $zip){Remove-Item $zip -Force}
Compress-Archive -Path (Join-Path $PSScriptRoot "app"), (Join-Path $PSScriptRoot "requirements.txt") -DestinationPath $zip -Force

SSH "sudo mkdir -p /opt/javari && sudo chown -R $User:$User /opt/javari"
SCP $zip "/opt/javari/javari_app.zip"
SSH "sudo apt-get update -y && sudo apt-get install -y python3-venv python3-pip nginx unzip"

SSH "cd /opt/javari && unzip -o javari_app.zip && python3 -m venv .venv && . .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt"

$unit = @"
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
$unitTmp = Join-Path $env:TEMP "javari.service"; $unit | Set-Content -Path $unitTmp -Encoding ascii
SCP $unitTmp "/tmp/javari.service"
SSH "sudo mv /tmp/javari.service /etc/systemd/system/javari.service && sudo systemctl daemon-reload && sudo systemctl enable --now javari"

$nginx = @"
server {
    listen 80;
    server_name $Domain;
    location / { proxy_pass http://127.0.0.1:8001; proxy_set_header Host \$host; proxy_set_header X-Real-IP \$remote_addr; proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto \$scheme; }
    location /health { proxy_pass http://127.0.0.1:8001/health; }
}
"@
$nginxTmp = Join-Path $env:TEMP "javari_nginx.conf"; $nginx | Set-Content -Path $nginxTmp -Encoding ascii
SSH "sudo rm -f /etc/nginx/sites-enabled/javari /etc/nginx/sites-available/javari"
SCP $nginxTmp "/tmp/javari_nginx.conf"
SSH "sudo mv /tmp/javari_nginx.conf /etc/nginx/sites-available/javari && sudo ln -s /etc/nginx/sites-available/javari /etc/nginx/sites-enabled/javari && sudo nginx -t && sudo systemctl restart nginx"

if (-not $NoTLS) { SSH "sudo apt-get install -y certbot python3-certbot-nginx && sudo certbot --nginx -d $Domain --non-interactive --agree-tos -m admin@$Domain || true" }

Write-Host "==> Attempting health check (http)"
try { $r = Invoke-WebRequest -Uri "http://$Domain/health" -UseBasicParsing -TimeoutSec 10; Write-Host $r.Content }
catch { Write-Warning "Health check failed. Verify DNS/Firewall or try via server IP." }
Write-Host "DONE"
