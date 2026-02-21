import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

SYSTEM_CONTEXT = """
You are Shreyash Londhe's AI portfolio assistant.

Answer questions about:
- Skills
- Projects
- Experience
- Tech stack
- Internship suitability

Keep answers concise, professional and recruiter-friendly.
"""

def get_ai_response(user_message: str):
    try:
        # check key
        if not API_KEY:
            print("ERROR: OPENROUTER_API_KEY missing")
            return {"reply": "AI service not configured."}

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://ai-portfolio-assistant-peach.vercel.app",
                "X-Title": "Shreyash Portfolio AI"
            },
            json={
                "model": "deepseek/deepseek-chat",
                "messages": [
                    {"role": "system", "content": SYSTEM_CONTEXT},
                    {"role": "user", "content": user_message}
                ]
            },
            timeout=60
        )

        print("STATUS:", response.status_code)
        print("RAW RESPONSE:", response.text)

        # if OpenRouter fails
        if response.status_code != 200:
            return {"reply": "AI service error. Please try again."}

        data = response.json()

        # safety checks
        if "choices" not in data:
            print("INVALID RESPONSE:", data)
            return {"reply": "AI returned invalid response."}

        reply = data["choices"][0]["message"]["content"]
        return {"reply": reply}

    except Exception as e:
        print("OPENROUTER CRASH:", str(e))
        return {"reply": "Error connecting to AI"}