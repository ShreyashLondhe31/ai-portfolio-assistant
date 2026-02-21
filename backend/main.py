from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai import get_ai_response
from db import init_db, save_message, get_connection

app = FastAPI()

# Initialize DB on startup
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
def chat(req: ChatRequest):
    # Save user message
    save_message("user", req.message)

    # Get AI reply
    reply = get_ai_response(req.message)

    # Save assistant reply
    save_message("assistant", reply)

    return {"reply": reply}


@app.get("/messages")
def get_messages():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT role, content FROM messages ORDER BY id ASC"
    )
    rows = cursor.fetchall()

    conn.close()

    # Convert rows to JSON format
    return [
        {
            "role": row["role"],
            "content": row["content"]
        }
        for row in rows
    ]