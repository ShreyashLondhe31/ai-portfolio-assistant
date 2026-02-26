import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# -------- LOAD RESUME --------
with open("resume.json", "r", encoding="utf-8") as f:
    resume_data = json.load(f)

RESUME_CONTEXT = json.dumps(resume_data, indent=2)

SYSTEM_PROMPT = f"""
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
{RESUME_CONTEXT}
"""

def get_ai_response(user_message: str):
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            temperature=0.2,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ]
        )

        reply = completion.choices[0].message.content.strip()

        return {"reply": reply}

    except Exception as e:
        print("AI ERROR:", str(e))
        return {"reply": "AI service temporarily unavailable."}