import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

context = """
You are an AI assistant for Shreyash Londhe's portfolio.
Answer questions about his skills, projects, and experience.
Be concise and professional.
"""

def get_ai_response(user_message: str):
    if not API_KEY:
        print("OPENROUTER KEY MISSING")
        return {"reply": "AI key not configured."}

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://ai-portfolio-assistant-peach.vercel.app",
                "X-Title": "Shreyash Portfolio AI",
            },
            json={
                "model": "deepseek/deepseek-chat",
                "messages": [
                    {"role": "system", "content": context},
                    {"role": "user", "content": user_message}
                ]
            },
            timeout=60
        )

        print("STATUS:", response.status_code)
        print("TEXT:", response.text)

        if response.status_code != 200:
            return {"reply": "AI service error."}

        data = response.json()
        ai_text = data["choices"][0]["message"]["content"]

        return {"reply": ai_text}

    except Exception as e:
        print("OPENROUTER ERROR:", str(e))
        return {"reply": "Error connecting to AI"}