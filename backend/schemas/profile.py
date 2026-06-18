from pydantic import BaseModel
from typing import Optional

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[str] = None
    occupation: Optional[str] = None
