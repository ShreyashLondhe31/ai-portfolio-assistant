import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from ai import get_ai_response
from db import init_db, save_message, get_connection

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from db import get_cached_reply, save_cache

app = FastAPI()
init_db()

# ---------- RATE LIMIT ----------
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"reply": "Too many requests. Slow down."}
    )

# ---------- CORS ----------
origins = [
    "https://ai-portfolio-assistant-peach.vercel.app",
    "http://localhost:5173"
]

# Allow custom production origins from environment variable
env_origins = os.getenv("CORS_ORIGINS", "")
if env_origins:
    origins.extend([o.strip() for o in env_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ---------- SECURITY HEADERS ----------
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# ---------------- HEALTH CHECK ----------------
@app.get("/health")
def health_check():
    return {"status": "ok"}

# ---------------- MODELS ----------------
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)

# ---------------- CHAT ----------------
@app.post("/api/chat")
@limiter.limit("10/minute")
def chat(request: Request, req: ChatRequest):
    user_message = req.message.strip().lower()

    # 1. CHECK CACHE
    cached = get_cached_reply(user_message)
    if cached:
        return {"reply": cached}

    # 2. CALL AI
    ai_response = get_ai_response(user_message)
    reply_text = ai_response["reply"]

    # 3. SAVE CACHE
    save_cache(user_message, reply_text)

    # 4. SAVE CHAT HISTORY
    save_message("user", user_message)
    save_message("assistant", reply_text)

    return {"reply": reply_text}