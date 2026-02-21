import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

def get_ai_response(user_message):
    try:
        with open("resume.json", "r") as f:
            resume_data = json.load(f)

        context = f"""
You are an AI assistant for {resume_data['name']}.
Answer ONLY using this data:

{json.dumps(resume_data, indent=2)}
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
            }
        )

        data = response.json()

        print("OPENROUTER RESPONSE:", data)

        return data["choices"][0]["message"]["content"]

    except Exception as e:
        print("ERROR:", e)
        return "Error connecting to AI"