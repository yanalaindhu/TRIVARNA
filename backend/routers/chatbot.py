from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from database.supabase_client import supabase
from services.vector_memory_service import retrieve_memories
from ai.llm_client import client
import json

router = APIRouter(
    prefix="/api/chatbot",
    tags=["TRIVARNA AI Chatbot"]
)

class QueryRequest(BaseModel):
    model_id: str
    prompt: str

def get_user_id_from_token(authorization: str):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization token is missing")
    try:
        token = authorization.replace("Bearer ", "")
        user_response = supabase.auth.get_user(token)
        return user_response.user.id
    except Exception as e:
        # Graceful fallback to search in local profiles/storage if testing without valid JWT session
        raise HTTPException(status_code=401, detail=f"Unauthorized: {str(e)}")

@router.post("/query")
async def query_rag(payload: QueryRequest, authorization: str = Header(None)):
    user_id = get_user_id_from_token(authorization)
    
    # Context collection based on model selection
    context_data = {}
    sources = []
    
    try:
        if payload.model_id == "mind_rag":
            # Retrieve Checkins & Journals
            checkins = supabase.table("daily_checkins").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(5).execute()
            journals = supabase.table("journals").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(5).execute()
            profile = supabase.table("profile_analysis").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
            memories = retrieve_memories(user_id, payload.prompt)
            
            context_data = {
                "recent_checkins": checkins.data,
                "recent_journals": journals.data,
                "profile_insights": profile.data,
                "semantic_memories": memories
            }
            sources = ["journals Table", "daily_checkins Table", "Mood Logs Index", "Stress Assessment Reports"]
            
        elif payload.model_id == "body_rag":
            # Retrieve Fitness, Sleep & Hydration details
            checkins = supabase.table("daily_checkins").select("mood_score,stress_level,energy_level,sleep_hours,water_intake,exercise_minutes,created_at").eq("user_id", user_id).order("created_at", desc=True).limit(7).execute()
            onboarding = supabase.table("onboarding_responses").select("body_data,productive_window").eq("user_id", user_id).limit(1).execute()
            
            context_data = {
                "recent_physical_metrics": checkins.data,
                "onboarding_body_targets": onboarding.data
            }
            sources = ["Sleep Logs Index", "Hydration Intake Logs", "Fitness & Exercise Trackers", "daily_checkins Table"]
            
        elif payload.model_id == "lifestyle_rag":
            # Retrieve Goals, Habits & Productivity
            goals = supabase.table("goals").select("*").eq("user_id", user_id).execute()
            habits = supabase.table("habits").select("*").eq("user_id", user_id).execute()
            checkins = supabase.table("daily_checkins").select("productivity_score,created_at").eq("user_id", user_id).order("created_at", desc=True).limit(7).execute()
            
            context_data = {
                "user_goals": goals.data,
                "user_habits": habits.data,
                "recent_productivity_levels": checkins.data
            }
            sources = ["Active Goals Register", "Habit Completion History", "Productivity & Focus metrics", "goals Table", "habits Table"]
            
        else:  # hybrid_rag
            # Load everything
            checkins = supabase.table("daily_checkins").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(7).execute()
            journals = supabase.table("journals").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(3).execute()
            goals = supabase.table("goals").select("*").eq("user_id", user_id).execute()
            habits = supabase.table("habits").select("*").eq("user_id", user_id).execute()
            memories = retrieve_memories(user_id, payload.prompt)
            
            context_data = {
                "recent_checkins": checkins.data,
                "recent_journals": journals.data,
                "user_goals": goals.data,
                "user_habits": habits.data,
                "semantic_memories": memories
            }
            sources = ["Unified TRIVARNA Vector Master", "daily_checkins Table", "goals Table", "habits Table", "journals Table"]

        # Call Llama 3 via Groq
        prompt_instructions = f"""
        You are TRIVARNA AI, a highly empathetic wellbeing therapist and executive coach.
        You have retrieval access to the user's secure logs. Here is the verified context gathered for their request:
        
        CONTEXT DATA:
        {json.dumps(context_data, indent=2)}
        
        USER QUESTION:
        {payload.prompt}
        
        INSTRUCTIONS:
        1. Formulate an extremely personalized, structured response based ONLY on the provided context data.
        2. Keep the tone warm, highly scientific, and motivating.
        3. Do not mention "database tables", "JSON", "columns", or technical database terms. Refer to their logs as "your daily check-ins", "your journal", or "your logged progress".
        4. If the context does not contain enough data, answer the question generally while asking the user to log more details.
        5. Structure with bullet points and bold headers where relevant. Keep it under 250 words.
        """
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt_instructions}]
        )
        
        reply = response.choices[0].message.content
        
        return {
            "success": True,
            "reply": reply,
            "sources": sources
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
