from pydantic import BaseModel


class ScheduleGenerateResponse(BaseModel):
    success: bool
    message: str
    schedule_id: str