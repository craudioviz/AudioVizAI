
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets, os

app = FastAPI(title="Javari", version="0.1.0", docs_url="/docs")
security = HTTPBasic()

def verify(credentials: HTTPBasicCredentials = Depends(security)):
    users = []
    ru = os.getenv("ROY_USER"); rp = os.getenv("ROY_PASS")
    cu = os.getenv("CINDY_USER"); cp = os.getenv("CINDY_PASS")
    if ru and rp:
        users.append((ru, rp))
    if cu and cp:
        users.append((cu, cp))
    if not users:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Auth not configured")
    for u, p in users:
        if secrets.compare_digest(credentials.username, u) and secrets.compare_digest(credentials.password, p):
            return credentials.username
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, headers={"WWW-Authenticate": "Basic"}, detail="Unauthorized")

@app.get("/health", tags=["ops"])
def health():
    return {"status": "ok", "service": "javari", "version": "0.1.0"}

@app.get("/", response_class=HTMLResponse, tags=["ui"])
def home(user: str = Depends(verify)):
    html = '''<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Javari Live</title>
    <style>
      :root { --bg:#0b0b10; --card:#11131a; --fg:#e8e8f0; --muted:#a9aec2; --accent:#6ee7ff; }
      body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background:linear-gradient(180deg,#0b0b10,#0a0c12 40%, #0b0b10); color:var(--fg); }
      .wrap { max-width:900px; margin:6rem auto; padding:0 1rem; }
      .card { background:var(--card); border-radius:20px; padding:32px; box-shadow: 0 10px 30px rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.06); }
      h1 { font-size:clamp(28px,4vw,42px); margin:0 0 12px; letter-spacing:.3px; }
      p { color:var(--muted); line-height:1.6; }
      .tag { display:inline-block; padding:6px 10px; border-radius:999px; border:1px solid rgba(255,255,255,.1); font-size:12px; color:#b8c3ff; margin-right:6px; }
      .grid { display:grid; gap:14px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-top:18px; }
      .kpi { background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02)); border:1px solid rgba(255,255,255,.06); border-radius:16px; padding:16px; }
      .kpi .label { font-size:12px; color:#9da7bf; }
      .kpi .value { font-weight:700; font-size:22px; margin-top:6px; }
      .ok { color:#7CFFC4; }
      code { background: rgba(255,255,255,.05); padding:2px 6px; border-radius:6px; }
      .row { display:flex; gap:10px; flex-wrap:wrap; margin-top:18px; }
      .btn { text-decoration:none; color:var(--fg); padding:10px 14px; border-radius:12px; border:1px solid rgba(255,255,255,.12); }
      .btn:hover { border-color: rgba(255,255,255,.25); }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <div class="tag">Javari</div> <div class="tag">CRAudiovizAI</div> <div class="tag">Live</div>
        <h1>Welcome, {user}</h1>
        <p>This is the minimal live surface for <strong>Javari</strong>. Access is restricted to authorized users. From here, we grow capabilities without blocking go-live.</p>
        <div class="grid">
          <div class="kpi"><div class="label">Service</div><div class="value">javari</div></div>
          <div class="kpi"><div class="label">Health</div><div class="value ok">OK</div></div>
          <div class="kpi"><div class="label">Version</div><div class="value">0.1.0</div></div>
          <div class="kpi"><div class="label">Docs</div><div class="value"><a class="btn" href="/docs">Open Swagger</a></div></div>
        </div>
        <div class="row">
          <a class="btn" href="/health">/health</a>
          <span class="btn">Protected: /</span>
        </div>
        <p style="margin-top:22px;">Environment users set via <code>ROY_USER/ROY_PASS</code> and <code>CINDY_USER/CINDY_PASS</code>. If none set, service stays locked.</p>
      </div>
    </div>
  </body>
</html>'''
    return HTMLResponse(content=html.replace("{user}", user))
