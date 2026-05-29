from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base

from datetime import datetime, timedelta

# India Time Function
def india_time():
    return datetime.utcnow() + timedelta(hours=5, minutes=30)

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    ticket_id = Column(String, unique=True)

    customer_name = Column(String)

    customer_email = Column(String)

    subject = Column(String)

    description = Column(Text)

    status = Column(String, default="Open")

    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=india_time)

    updated_at = Column(DateTime, default=india_time)


class TicketHistory(Base):
    __tablename__ = "ticket_history"

    id = Column(Integer, primary_key=True, index=True)

    ticket_id = Column(String)

    status = Column(String)

    notes = Column(Text, nullable=True)

    updated_at = Column(DateTime, default=india_time)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True)

    password = Column(String)