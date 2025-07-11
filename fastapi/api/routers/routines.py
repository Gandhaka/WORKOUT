from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter
from sqlalchemy.orm import joinedload
from api.models import Workout, Routines
from api.deps import db_dependency, user_dependency

router = APIRouter(
     prefix = '/routines',
     tags = ['routines']
)

class RoutineBase(BaseModel):
    name:str
    description:Optional[str] = None

class RoutineCreate(RoutineBase):
    workouts: List[int] = []

@router.get("/")
def get_routines(db:db_dependency,user:user_dependency):
    return db.query(Routines).options(joinedload(Routines.workouts)).filter(Routines.user_id == user.get('id')).all()

@router.post("/")
def create_routine(db:db_dependency,user:user_dependency,routine:RoutineCreate):
    db_routine = Routines(name=routine.name,description=routine.description, user_id=user.get('id'))
    for workout_id in routine.workouts:
        workout = db.query(Workout).filter(Workout.id == workout_id).first()
        if workout:
            db_routine.workouts.append(workout)
        
        db_routine = db.query(Routines).options(joinedload(Routines.workouts)).filter(Routines.id == db_routine.id).first()
    try: 
        db.add(db_routine)
        db.commit()
        db.refresh(db_routine)    
        return db_routine
    except Exception as e: 
        db.rollback()
        raise e
@router.delete('/')
def delete_routine(db:db_dependency,user:user_dependency,routine_id:int):
    db_routine = db.query(Routines).filter(Routines.id == routine_id).first()
    if db_routine:
        db.delete(db_routine)
        db.commit()
    return db_routine
