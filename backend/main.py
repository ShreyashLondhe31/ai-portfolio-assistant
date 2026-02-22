from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from ai import get_ai_response
from db import init_db, save_message, get_connection
import time
import os

app = FastAPI()

init_db()

# =========================
# 1. STRICT CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-portfolio-assistant-peach.vercel.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

# =========================
# 2. SECURITY HEADERS
# =========================
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# =========================
# 3. RATE LIMITING
# =========================
RATE_LIMIT_SECONDS = 3
last_request_time = {}

# =========================
# Request Model
# =========================
class ChatRequest(BaseModel):
    message: str


# =========================
# CHAT ENDPOINT
# =========================
@app.post("/chat")
def chat(req: ChatRequest, request: Request):

    client_ip = request.client.host
    current_time = time.time()

    # Rate limiting
    if client_ip in last_request_time:
        if current_time - last_request_time[client_ip] < RATE_LIMIT_SECONDS:
            return {"reply": "Please wait a moment before sending another message."}

    last_request_time[client_ip] = current_time

    # Input validation
    if not req.message.strip():
        return {"reply": "Message cannot be empty."}

    if len(req.message) > 500:
        return {"reply": "Message too long. Please keep it under 500 characters."}

    try:
        # Save user message
        save_message("user", req.message)

        ai_response = get_ai_response(req.message)

        # Ensure safe structure
        if isinstance(ai_response, dict):
            reply_text = ai_response.get("reply", "AI error.")
        else:
            reply_text = str(ai_response)

        # Save assistant reply
        save_message("assistant", reply_text)

        return {"reply": reply_text}

    except Exception:
        # Never expose internal error
        return {"reply": "Something went wrong. Please try again later."}


# =========================
# GET MESSAGES
# =========================
@app.get("/messages")
def get_messages():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM messages ORDER BY id DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]