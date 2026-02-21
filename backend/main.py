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
    save_message("user", req.message)

    reply_text = get_ai_response(req.message)  # already string

    save_message("assistant", reply_text)

    return {"reply": reply_text}


@app.get("/messages")
def get_messages():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT role, content, timestamp
        FROM messages
        ORDER BY id ASC
    """)
    
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "role": row["role"],
            "content": row["content"],
            "timestamp": row["timestamp"]
        }
        for row in rows
    ]

@app.delete("/messages")
def clear_messages():
    from db import get_connection
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM messages")
    conn.commit()
    conn.close()
    return {"status": "cleared"}