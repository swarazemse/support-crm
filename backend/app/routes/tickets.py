from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta


from ..database import SessionLocal
from ..models import Ticket, TicketHistory
from ..schemas import TicketCreate, TicketUpdate

router = APIRouter()

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create Ticket
@router.post("/tickets")
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):

    count = db.query(Ticket).count() + 1

    new_ticket = Ticket(
        ticket_id=f"TKT-{count:03}",
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
        status="Open"
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    # Create history entry
    history = TicketHistory(
    ticket_id=new_ticket.ticket_id,
    status="Open",
    notes="Ticket Created"
    )

    db.add(history)
    db.commit()
    return new_ticket

# Get All Tickets
@router.get("/tickets")
def get_tickets(
    status: str = None,
    search: str = None,
    db: Session = Depends(get_db)
):

    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)

    if search:
        query = query.filter(
            Ticket.customer_name.contains(search) |
            Ticket.customer_email.contains(search) |
            Ticket.subject.contains(search) |
            Ticket.description.contains(search)
        )

    return query.all()

# Get Single Ticket
@router.get("/tickets/{ticket_id}")
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):

    ticket = db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    history = db.query(TicketHistory).filter(
    TicketHistory.ticket_id == ticket_id
    ).all()

    return {
        "ticket_id": ticket.ticket_id,
        "customer_name": ticket.customer_name,
        "customer_email": ticket.customer_email,
        "subject": ticket.subject,
        "description": ticket.description,
        "status": ticket.status,
        "notes": ticket.notes,
        "created_at": ticket.created_at,
        "history": history
    }

# Update Ticket
@router.put("/tickets/{ticket_id}")
def update_ticket(
    ticket_id: str,
    payload: TicketUpdate,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    ticket.status = payload.status
    ticket.notes = payload.notes
    ticket.updated_at = datetime.utcnow() + timedelta(hours=5, minutes=30)
    

    # Add history entry
    history = TicketHistory(
    ticket_id=ticket.ticket_id,
    status=payload.status,
    notes=payload.notes
    )

    db.add(history) 

    db.commit()

    return {
        "success": True,
        "updated_at": ticket.updated_at
    }