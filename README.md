
# AI-Powered Support CRM System

An AI-driven full-stack Customer Support Ticketing CRM that automates ticket creation, updates, search, and resolution using React, FastAPI, and LLM-based AI integration.

## Features

- User Authentication
- Create & Manage Support Tickets
- Search & Filter Tickets
- AI-Powered Ticket Operations
- Voice Command Support
- Ticket Status Updates
- Ticket History Tracking
- Responsive Mobile-Friendly UI
- Cloud Deployment with Railway & Vercel

## AI Features

- Create tickets using natural language
- Search tickets using AI commands
- Update ticket status via AI
- Voice-enabled CRM interaction
- AI-driven workflow automation

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Groq LLM API

### Deployment
- Railway (Backend)
- Vercel (Frontend)
- GitHub

## Live Demo

Frontend:  
https://support-crm-nine.vercel.app

credentials:
username: admin
password: admin123

Backend API:  
https://support-crn-backend-production.up.railway.app/docs

## Sample AI Commands

```markdown
text commands
Create ticket for login issue from Rahul Kumar with email rahul@gmail.com
Show open tickets
Show in progress tickets
Show closed tickets
Show all tickets
Search tickets for Rahul Kumar
Search ticket for login issue
Update TKT-001 to In Progress and add note investigating login issue
Update ticket TKT-002 to Open with note rechecking payment gateway
Close TKT-001 with note issue resolved
Close ticket TKT-002 with note issue fixed after restart
````

```markdown
Voice Command
Create ticket for login issue from Rahul
Show open tickets
Update TKT-001 to in progress
Close ticket TKT-002
```

## Installation

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Highlights

* Full-stack architecture
* AI-powered automation
* Voice-enabled interactions
* REST API integration
* Cloud deployment
* Responsive design

## Author

Developed by Swara Zemse
