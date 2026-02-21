import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

context = """
You are an AI assistant for Shreyash Londhe's portfolio.
Answer professionally about his skills, projects, and experience.
Keep answers concise and impressive for recruiters.
"""

def get_ai_response(user_message: str) -> str:
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://ai-portfolio-assistant-peach.vercel.app",
                "X-Title": "Shreyash Portfolio"
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

        return data["choices"][0]["message"]["content"]

    except Exception as e:
        print("AI ERROR:", str(e))
        return "Error connecting to AI"