import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

context = """
You are Shreyash Londhe's AI portfolio assistant.
Answer like a helpful assistant describing his skills, projects and experience.
Keep answers concise and professional.
"""

def get_ai_response(user_message: str):
    try:
        if not API_KEY:
            print("❌ NO API KEY FOUND")
            return "AI key missing on server"

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://ai-portfolio-assistant-peach.vercel.app",
                "X-Title": "Shreyash Portfolio Assistant"
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

        data = response.json()

        if "choices" not in data:
            return "AI temporarily unavailable"

        return data["choices"][0]["message"]["content"]

    except Exception as e:
        print("OPENROUTER ERROR:", str(e))
        return "Error connecting to AI"