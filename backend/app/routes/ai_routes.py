from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json

from app.database import SessionLocal
from app import models
from app.models import Ticket, TicketHistory
from datetime import datetime, timedelta

load_dotenv()

router = APIRouter()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


class AICommand(BaseModel):
    message: str


@router.post("/ai-command")
def ai_command(command: AICommand):

    db = SessionLocal()

    user_message = command.message

    prompt = f"""
    You are an AI assistant for a Support CRM system.

    Convert the user request into JSON.

    Supported actions:
    - create_ticket
    - search_tickets
    - close_ticket
    - update_ticket

    Return ONLY valid JSON.

    Examples:

    {{
      "action": "create_ticket",
      "customer_name": "Rahul",
      "customer_email": "rahul@example.com",
      "subject": "Login Issue",
      "description": "Unable to login"
    }}

    {{
      "action": "close_ticket",
      "ticket_id": "TKT-001"
    }}

    {{
      "action": "search_tickets",
      "status": "Open"
    }}

    {{
      "action": "search_tickets",
      "status": "In Progress"
    }}

    {{
      "action": "search_tickets",
      "status": "Closed"
    }}

    {{
      "action": "search_tickets",
      "status": "All"
    }}

    {{
      "action": "search_tickets",
      "customer_name": "Rahul"
    }}

    {{
      "action": "search_tickets",
      "subject": "login"
    }}
    {{
        "action": "update_ticket", 
        "ticket_id": "TKT-001", 
        "status": "In Progress", 
        "notes": "Investigating login issue" 
    }} 
    {{ 
        "action": "update_ticket", 
        "ticket_id": "TKT-001",
        "status": "Closed", 
        "notes": "Issue resolved successfully" 
    }}

    User Request:
    {user_message}
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

    ai_reply = response.choices[0].message.content

    cleaned_reply = (
        ai_reply
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    print("AI RAW RESPONSE:")
    print(cleaned_reply)

    try:

        start = cleaned_reply.find("{")

        end = cleaned_reply.rfind("}") + 1

        cleaned_reply = cleaned_reply[start:end]

        data = json.loads(cleaned_reply)

    except Exception as e:

        print("JSON ERROR:", e)

        return {
            "message": "AI returned invalid response",
            "raw": cleaned_reply
        }

    action = str(
    data.get("action", "")
    ).lower().strip()

    print("ACTION =", action)

    # =========================
    # CREATE TICKET
    # =========================

    if action in ["create_ticket", "create ticket"]:

       latest_ticket = db.query(models.Ticket).order_by( 
           models.Ticket.id.desc() 
           ).first() 
       next_id = 1 
       if latest_ticket: 
        next_id = latest_ticket.id + 1 
        ticket_id = f"TKT-{next_id:03}" 
        new_ticket = models.Ticket( 
            ticket_id=ticket_id, 
            customer_name=data.get("customer_name"), 
            customer_email=data.get("customer_email"), 
            subject=data.get("subject"), 
            description=data.get("description"),
              status="Open" ) 
        db.add(new_ticket) 
        db.commit() 
        db.refresh(new_ticket) 
        history = models.TicketHistory( 
            ticket_id=ticket_id, 
            notes="Ticket created via AI command", 
            status="Open" ) 
        db.add(history) 
        db.commit() 
        return { "message": f"Ticket {ticket_id} created successfully" }
    # =========================
    # SEARCH TICKETS
    # =========================

    elif action in ["search_tickets", "search ticket", "search"]:

        query = db.query(models.Ticket)

        status = data.get("status")
        print("STATUS =", status)

        if status:
            status = status.lower().strip()

            if status in [
                    "open",
                    "opened",
                    "new"
                ]:
                status = "Open"

            elif status in [
                "in progress",
                "progress",
                "inprogress",
                "working",
                "pending",
                "processing"
            ]:
                status = "In Progress"

            elif status in [
                "close",
                "closed",
                "resolved",
                "done"
            ]:
                status = "Closed"

            elif status in [
                "all",
                "all status",
                "everything"
            ]:
                status = None

        if status:

            query = query.filter(
            models.Ticket.status.ilike(status)
            
        )

        if data.get("customer_name"):

            query = query.filter(
                models.Ticket.customer_name.ilike(
                    f"%{data.get('customer_name')}%"
                )
            )

        if data.get("subject"):

            query = query.filter(
                models.Ticket.subject.ilike(
                    f"%{data.get('subject')}%"
                )
            )

        tickets = query.all()

        results = []

        for ticket in tickets:

            results.append({
                "ticket_id": ticket.ticket_id,
                "customer_name": ticket.customer_name,
                "customer_email": ticket.customer_email,
                "subject": ticket.subject,
                "status": ticket.status
            })

        return {
            "tickets": results
        }
    # =========================
    #   UPDATE TICKET
    # =========================

    elif action in [ "update_ticket", "update ticket" ]: 
       
        ticket = db.query(models.Ticket).filter(
             models.Ticket.ticket_id == data.get("ticket_id") 
             ).first() 
        if not ticket:
             return {"message": "Ticket not found"} 
        status = data.get("status") 
        if status: 
            status = status.lower().strip() 
            if "open" in status: 
                status = "Open" 
            elif "progress" in status: 
                status = "In Progress" 
            elif "close" in status: 
                status = "Closed" 
        ticket.status = status 
        db.commit() 
        history = models.TicketHistory( 
            ticket_id=ticket.ticket_id, 
            notes=data.get("notes", "Updated via AI"), 
            status=ticket.status 
        ) 
        db.add(history) 
        db.commit() 
        return { 
            "message": f"{ticket.ticket_id} updated successfully" 
        } 


    # =========================
    # CLOSE TICKET
    # =========================

    elif action in ["close_ticket", "close ticket"]:
    
        ticket_id = data.get("ticket_id")
        ticket = db.query(models.Ticket).filter( 
             models.Ticket.ticket_id == ticket_id 
        ).first() 
        if not ticket: 
            return {"message": "Ticket not found"} 
        ticket.status = "Closed" 
        db.commit() 
        history = models.TicketHistory( 
            ticket_id=ticket.ticket_id, 
            notes="Ticket closed via AI command", 
            status="Closed" ) 
        db.add(history) 
        db.commit() 
    return { 
        "message": f"{ticket.ticket_id} closed successfully" 
    }
        
        



    # =========================
    # DEFAULT
    # =========================

    return {
        "message": "Action not supported yet"
    }
