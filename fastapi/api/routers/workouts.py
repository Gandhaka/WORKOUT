from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, status,Path

from api.models import Workout
from api.deps import db_dependency,user_dependency

router = APIRouter(
    prefix = '/workouts',
    tags=['workouts']
)

class WorkoutBase(BaseModel):
    name:str
    description:Optional[str] = None

class WorkoutCreate(WorkoutBase):
    pass

@router.get('/')
def get_workouts(db:db_dependency  ,user:user_dependency):
    return db.query(Workout).filter(Workout.user_id == user.get('id')).all()

@router.get('/{workout_id}')
def get_workouts(db:db_dependency,
                 user:user_dependency,
                 workout_id: int = Path(..., description="The ID of the workout to retrieve"),):
    #return db.query(Workout).all()
    workout= db.query(Workout).filter(Workout.id == workout_id,Workout.user_id == user.get('id')).first()
    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workout with id {workout_id} not found"
        )
    return workout

@router.post('/',status_code=status.HTTP_201_CREATED)
def create_workout(db: db_dependency,user:user_dependency,workout:WorkoutCreate):
    db_workout = Workout(**workout.model_dump(),user_id=user.get('id'))
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.delete("/")
def delete_workout(db:db_dependency,user:user_dependency, workout_id:int):
    db_workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if db_workout:
        db.delete(db_workout)
        db.commit()
    return db_workout