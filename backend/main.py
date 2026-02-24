from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai import get_ai_response
from db import init_db, save_message, get_connection

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

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
    "http://localhost:5173",
    "https://ai-portfolio-assistant-peach.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
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

# ---------------- MODELS ----------------
class ChatRequest(BaseModel):
    message: str

# ---------------- CHAT ----------------
@app.post("/chat")
@limiter.limit("10/minute")
def chat(request: Request, req: ChatRequest):
    user_message = req.message

    try:
        save_message("user", user_message)

        ai_response = get_ai_response(user_message)

        # SAFE PARSE
        if isinstance(ai_response, dict) and "reply" in ai_response:
            reply_text = ai_response["reply"]
        else:
            reply_text = str(ai_response)

        save_message("assistant", reply_text)

        return {"reply": reply_text}

    except Exception as e:
        print("CHAT ERROR:", e)
        return {"reply": "Server error. Try again."}

# ---------------- GET MESSAGES ----------------
@app.get("/messages")
@limiter.limit("30/minute")
def get_messages(request: Request):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM messages ORDER BY id DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]