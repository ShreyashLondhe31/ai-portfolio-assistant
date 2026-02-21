import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")


def get_ai_response(user_message: str):
    try:
        # 🔴 check API key first
        if not API_KEY:
            print("ERROR: OPENROUTER_API_KEY missing")
            return {"reply": "Server misconfiguration: API key missing."}

        # 🔵 resume / portfolio context
        context = """
You are an AI assistant for Shreyash Londhe's portfolio website.

Answer like a professional portfolio assistant.
Be concise, clear, and helpful.

Shreyash is:
- MCA student
- Full-stack developer
- Works with React, TypeScript, Python, FastAPI
- Built AI portfolio assistant with OpenRouter
- Interested in AI + backend systems
- Looking for internship opportunities
"""

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
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
        print("RESPONSE:", response.text)

        if response.status_code != 200:
            return {"reply": "AI service error. Please try again."}

        data = response.json()
        reply = data["choices"][0]["message"]["content"]

        return {"reply": reply}

    except Exception as e:
        print("OPENROUTER ERROR:", str(e))
        return {"reply": "Error connecting to AI"}