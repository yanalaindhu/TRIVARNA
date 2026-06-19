from ai.llm_client import client
import json


def analyze_journal(text: str):
    cleaned = text.strip().lower()
    # Handle simple greetings and short/empty logs programmatically
    greetings_words = {"hi", "hello", "hey", "yo", "hola", "test", "greetings", "sup", "good morning", "good evening", "good afternoon"}
    words = [w.strip(".,!?") for w in cleaned.split()]
    if not words or (len(words) <= 2 and all(w in greetings_words for w in words)) or len(cleaned) < 3:
        return {
            "emotion": "Neutral",
            "sentiment_score": 50.0,
            "stress_level": 0,
            "summary": "Logged greeting. Write a longer entry about your day to analyze your wellbeing insights."
        }

    prompt = f"""
    Analyze this journal entry.

    Journal:
    {text}

    Return ONLY valid JSON:

    {{
      "emotion": "",
      "sentiment_score": 0,
      "stress_level": 0,
      "summary": ""
    }}
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response.choices[0].message.content

    # Remove markdown if model wraps JSON
    content = content.replace("```json", "")
    content = content.replace("```", "")
    content = content.strip()

    return json.loads(content)