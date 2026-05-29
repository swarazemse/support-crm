from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .models import Base
from .routes import tickets
from .routes import auth
from .models import User
from .database import SessionLocal
from app.routes import ai_routes

app = FastAPI()
@app.on_event("startup")
def startup_event():

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.username == "admin"
    ).first()

    if not existing_user:

        default_user = User(
            username="admin",
            password="admin123"
        )

        db.add(default_user)

        db.commit()

    db.close()





app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    tickets.router,
    prefix="/api"
)

app.include_router(
    auth.router,
    prefix="/api/auth"
)

app.include_router(
    ai_routes.router,
    prefix="/api/ai"
)

@app.get("/")
def root():
    return {
        "message": "Support CRM API Running"
    }