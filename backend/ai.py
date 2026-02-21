import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

def get_ai_response(user_message):
try:
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

    data = response.json()
    return {"reply": data["choices"][0]["message"]["content"]}

except Exception as e:
    print("OPENROUTER ERROR:", str(e))
    return {"reply": "Error connecting to AI"}