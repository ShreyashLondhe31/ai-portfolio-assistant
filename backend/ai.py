import os
import json
from dotenv import load_dotenv
from groq import Groq
import time

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESUME_PATH = os.path.join(BASE_DIR, "resume.json")

# -------- LOAD RESUME (fresh on every request so new resume.json is always used) --------
def _build_system_prompt() -> str:
    with open(RESUME_PATH, "r", encoding="utf-8") as f:
        resume_data = json.load(f)
    resume_context = json.dumps(resume_data, indent=2)
    return f"""
You are Shreyash Londhe's professional AI portfolio assistant.

Your job is to speak like a polished, recruiter-facing assistant.

STYLE RULES:
- Sound natural, confident, and professional.
- Speak like a human assistant, not a robot.
- Use short paragraphs or clean bullet points.
- Do NOT dump raw lists unless asked.
- Highlight strengths clearly.
- Be helpful and conversational.

STRICT ACCURACY RULES:
- ONLY use the resume data below.
- If something is not in the resume, say:
  "That information is not listed in Shreyash's resume."
- NEVER invent skills.
- NEVER assume technologies.
- NEVER exaggerate.

TONE:
Professional, concise, confident, recruiter-friendly.

RESUME DATA:
{resume_context}
"""

CACHE = {}
CACHE_TTL = 300  # seconds (5 minutes)

def get_cached(key: str):
    if key in CACHE:
        data, ts = CACHE[key]
        if time.time() - ts < CACHE_TTL:
            return data
        else:
            del CACHE[key]
    return None


def set_cache(key: str, value: str):
    CACHE[key] = (value, time.time())

def get_ai_response(user_message: str):
    normalized = user_message.strip().lower()

    # CHECK IN-MEMORY CACHE
    cached = get_cached(normalized)
    if cached:
        return {"reply": cached}

    try:
        system_prompt = _build_system_prompt()
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            temperature=0.2,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )

        reply = completion.choices[0].message.content.strip()

        # Only cache valid (non-"not listed") replies
        if "not listed" not in reply.lower() and "not aware" not in reply.lower():
            set_cache(normalized, reply)

        return {"reply": reply}

    except Exception as e:
        print("AI ERROR:", str(e))
        return {"reply": "AI service temporarily unavailable."}