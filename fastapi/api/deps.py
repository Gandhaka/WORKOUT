from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends,HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from .database import SessionLocal


load_dotenv()

SECRET_KEY = os.getenv('AUTH_SECRET_KEY')
ALGORITHM = os.getenv('AUTH_ALGORITHM')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()  
    
db_dependency = Annotated [Session, Depends(get_db)]

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl = '/auth/token')
oauth2_bearer_dependency = Annotated[str,Depends(oauth2_bearer)]

async def get_current_user(token :oauth2_bearer_dependency):
    print(f"DEBUG: get_current_user received token: {token[:30]}...")
    try:
        payload = jwt.decode(token,SECRET_KEY, algorithms = [ALGORITHM])
        print(f"DEBUG: get_current_user decoded payload: {payload}")
        username:str = payload.get('sub')
        user_id:int = payload.get('id')
        print(f"DEBUG: username={username}, user_id={user_id}")
        if username is None or user_id is None:
            print("DEBUG: Username or User ID is None, raising 401.")
            raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED,detail = 'Colud Not Validate User')
        return {'username':username, 'id': user_id}
    
    except JWTError:
        print(f"DEBUG: JWTError during token decoding: {e}")
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED,detail = 'Colud Not Validate User')  

user_dependency = Annotated[dict,Depends(get_current_user)]     