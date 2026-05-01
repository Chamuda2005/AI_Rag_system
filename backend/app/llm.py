from google import genai
from app.config import GOOGLE_API_KEY, LLM_MODEL

client = genai.Client(api_key=GOOGLE_API_KEY)


def generate_answer(prompt):
    response = client.models.generate_content(
        model=LLM_MODEL,
        contents=prompt
    )

    return response.text