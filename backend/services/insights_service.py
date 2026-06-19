from ai.llm_client import client
import json

def generate_insights(context: str):
    context_lower = context.lower()
    
    # Strict keyword checks to determine if conditional recommendations should trigger
    has_sleep_issue = any(k in context_lower for k in ["sleep", "insomnia", "awake", "nightmare", "restless"])
    has_boredom = any(k in context_lower for k in ["bored", "boredom", "nothing to do"])
    has_sadness = any(k in context_lower for k in ["sad", "down", "depressed", "bad mood", "unhappy", "crying"])

    prompt = f"""
    You are the AI Wellness Insights engine of TRIVARNA (Mind, Body, Life wellbeing platform).
    Analyze the user's database records to compute exactly 3 strengths, 3 risks/vulnerabilities, and 3 recommendations.
    
    User context data:
    {context}
    
    Rules for analysis:
    1. The 'Profile' entry contains the onboarding baseline details. This is your primary source of truth.
    2. If there are no valid check-ins or actual journals containing feelings/challenges, you MUST use the baseline profile analysis. If onboarding profile is empty or has no logged data, output friendly placeholder strengths, risks, and recommendations that encourage completing onboarding and starting daily tracking. NEVER assume the user has issues like 'inconsistent sleep', 'anxiety', 'poor diet' or 'lack of exercise' unless it is explicitly documented in the user's check-ins, journals, or onboarding Profile.
    """

    if has_sleep_issue:
        prompt += """
    3. The user has mentioned sleep issues, insomnia, or restless nights. You MUST include this recommendation: "[Body] Try listening to relaxing sleep music: [Deep Sleep Music (YouTube)](https://www.youtube.com/watch?v=Wnn47ObA8Gs) to sleep peacefully".
    """
    else:
        prompt += """
    3. The user did NOT mention any sleep issues or insomnia. You MUST NOT recommend sleep music or link to YouTube sleep music.
    """

    if has_boredom:
        prompt += """
    4. The user has mentioned being bored or boredom. You MUST include this recommendation: "[Life] Try playing games like [Chess on Chess.com](https://www.chess.com) or [Sudoku](https://www.websudoku.com) to stay engaged".
    """
    else:
        prompt += """
    4. The user did NOT mention being bored. You MUST NOT recommend games or game links.
    """

    if has_sadness:
        prompt += """
    5. The user has mentioned being sad, down, or in a bad mood. You MUST include this recommendation: "[Mind] Cheer up with comedy videos like [Mr. Bean Class (YouTube)](https://www.youtube.com/watch?v=2K8Tgt5zTVE) or read/listen to a joke".
    """
    else:
        prompt += """
    5. The user did NOT mention being sad, down, or in a bad mood. You MUST NOT recommend comedy videos or jokes.
    """

    prompt += """
    6. Each of the three lists ('strengths', 'risks', 'recommendations') MUST contain exactly 3 items:
       - 1 item for Mind (prefixed with "[Mind] ")
       - 1 item for Body (prefixed with "[Body] ")
       - 1 item for Life (prefixed with "[Life] ")
    7. Return your response ONLY as a valid JSON object with the keys "strengths", "risks", and "recommendations". Do not include any extra text, markdown wrappers (like ```json), or code block markings.
    """

    try:
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
        content = raw_content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()
        result = json.loads(content)
    except Exception as e:
        print(f"Error calling LLM or parsing: {e}")
        result = {
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
                "[Mind] Log daily reflections to calibrate wellness suggestions.",
                "[Body] Walk 10,000 steps today to establish physical momentum.",
                "[Life] Complete onboarding settings to formulate schedules."
            ]
        }

    # Post-processing filter to ensure strict keyword alignment
    recommendations = result.get("recommendations", [])
    
    # 1. Filter out sleep music recommendation if user didn't mention sleep issues
    if not has_sleep_issue:
        recommendations = [r for r in recommendations if "sleep music" not in r.lower() and "youtube.com/watch?v=" not in r.lower()]
    # 2. Filter out games if user didn't mention boredom
    if not has_boredom:
        recommendations = [r for r in recommendations if "chess.com" not in r.lower() and "websudoku.com" not in r.lower() and "play games" not in r.lower()]
    # 3. Filter out comedy/jokes if user didn't mention sadness
    if not has_sadness:
        recommendations = [r for r in recommendations if "comedy videos" not in r.lower() and "mr. bean" not in r.lower() and "joke" not in r.lower()]

    # Guarantee exactly 3 recommendations: 1 Mind, 1 Body, 1 Life
    mind_recs = [r for r in recommendations if r.startswith("[Mind]")]
    body_recs = [r for r in recommendations if r.startswith("[Body]")]
    life_recs = [r for r in recommendations if r.startswith("[Life]")]
    
    if has_sadness:
        mind_recs = ["[Mind] Cheer up with comedy videos like [Mr. Bean Class (YouTube)](https://www.youtube.com/watch?v=2K8Tgt5zTVE) or read/listen to a joke."]
    elif not mind_recs:
        mind_recs.append("[Mind] Log daily reflections to calibrate mental wellness suggestions.")
        
    if has_sleep_issue:
        body_recs = ["[Body] Try listening to relaxing sleep music: [Deep Sleep Music (YouTube)](https://www.youtube.com/watch?v=Wnn47ObA8Gs) to sleep peacefully."]
    elif not body_recs:
        body_recs.append("[Body] Restructure your sleep routine to target 7-8 hours of sleep, avoiding screens 1 hour before bed.")
        
    if has_boredom:
        life_recs = ["[Life] Try playing games like [Chess on Chess.com](https://www.chess.com) or [Sudoku](https://www.websudoku.com) to stay engaged."]
    elif not life_recs:
        life_recs.append("[Life] Implement structured study or work focus blocks to combat procrastination.")
        
    result["recommendations"] = [mind_recs[0], body_recs[0], life_recs[0]]
    return result