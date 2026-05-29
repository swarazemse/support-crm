from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Create Ticket Schema
class TicketCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str

# Update Ticket Schema
class TicketUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

# Response Schema
class TicketResponse(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True