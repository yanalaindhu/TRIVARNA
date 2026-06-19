from pydantic import BaseModel
from typing import Optional, Union

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[Union[int, str]] = None
    occupation: Optional[str] = None
    avatar_url: Optional[str] = None
