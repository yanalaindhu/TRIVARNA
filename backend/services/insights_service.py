from ai.llm_client import client
import json


def generate_insights(context: str):

    prompt = f"""
    You are the AI Wellness Insights engine of TRIVARNA (Mind, Body, Life wellbeing platform).
    Analyze the user's database records to compute exactly 3 strengths, 3 risks/vulnerabilities, and 3 recommendations.
    
    User context data:
    {context}
    
    Rules for analysis:
    1. The 'Profile' entry contains the onboarding baseline details (including onboarding strengths, risks, and focus areas). This is your primary source of truth.
    2. If there are no check-ins or journals, or if the journals/reflections consist only of simple greetings (e.g. "hi", "hello", "hey", "test") or short non-informative phrases, you must NOT invent new stress/risks or generate false recommendations. Fall back strictly on the onboarding Profile baseline.
    3. Each of the three lists ('strengths', 'risks', 'recommendations') MUST contain exactly 3 items:
       - 1 item for Mind (prefixed with "[Mind] ")
       - 1 item for Body (prefixed with "[Body] ")
       - 1 item for Life (prefixed with "[Life] ")
    4. If the Profile data is empty (meaning the user hasn't completed onboarding yet), return appropriate generic encouragement/guidance for Mind, Body, and Life to complete their onboarding assessment.
    5. Return your response ONLY as a valid JSON object with the keys "strengths", "risks", and "recommendations". Do not include any extra text, markdown wrappers (like ```json), or code block markings.
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

    raw_content = response.choices[0].message.content

    try:
        content = raw_content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()
        return json.loads(content)
    except Exception as e:
        print(f"Error parsing LLM response: {e}. Raw content: {raw_content}")
        # Secure fallback values matching the required categories
        return {
            "strengths": [
                "[Mind] Openness to reflection",
                "[Body] Ready to track activities",
                "[Life] Goal-setting mindset"
            ],
            "risks": [
                "[Mind] Baseline stress levels pending logs",
                "[Body] Activity data needs initialization",
                "[Life] Routine consistency has room to grow"
            ],
            "recommendations": [
                "[Mind] Log daily reflections to calibrate wellness suggestions",
                "[Body] Walk 10,000 steps today to establish physical momentum",
                "[Life] Complete onboarding settings to formulate schedules"
            ]
        }