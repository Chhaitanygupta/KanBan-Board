import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from tortoise.contrib.pydantic import pydantic_model_creator
from main import User

JWT_SECRET = 'myjwtsecret'

User_Pydantic = pydantic_model_creator(User, name='User')

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        user = await User.get(id=payload.get('id'))
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid username or password'
        )

    return await User_Pydantic.from_tortoise_orm(user)
