from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth,workouts,routines
from .database import Base, engine

app = FastAPI()
origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
]

Base.metadata.create_all(bind = engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods =["*"],
    allow_headers = ["*"]
)

@app.get("/")

def health_check():
    return "health check complete"

app.include_router(auth.router)
app.include_router(workouts.router)
app.include_router(routines.router)