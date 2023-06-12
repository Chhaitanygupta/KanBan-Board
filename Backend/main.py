import jwt
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from pydantic import BaseModel
from tortoise import fields
from tortoise.contrib.fastapi import register_tortoise
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise.models import Model

JWT_SECRET = 'myjwtsecret'

app = FastAPI()

class Task(BaseModel):
    id: str
    content: str

class Tasks(BaseModel):
    __root__: dict[str, Task]

class Column(BaseModel):
    id: str
    title: str
    taskIds: list

class Columns(BaseModel):
    __root__: dict[str, Column]

class Board(BaseModel):
    tasks: Tasks
    columns: Columns
    columnOrder: list

class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(50, unique=True)
    password_hash = fields.CharField(128)
    board_data = fields.JSONField(default='{"tasks": {}, "columns": {}, "columnOrder": []}')

    def verify_password(self, password):
        return bcrypt.verify(password, self.password_hash)

User_Pydantic = pydantic_model_creator(User, name='User')
UserIn_Pydantic = pydantic_model_creator(User, name='UserIn', exclude_readonly=True, exclude=('board_data',))

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

@app.get("/board")
async def get_board(user: User_Pydantic = Depends(get_current_user)):
    return {'board': user.board_data}

@app.post("/board")
async def save_board(board: Board, user: User_Pydantic = Depends(get_current_user)):
    user = await User.get(id=user.id)
    user.board_data = board.json()
    await user.save()

    return {"status": "success"}

@app.delete("/board/{board_id}")
async def delete_board(board_id: int, user: User_Pydantic = Depends(get_current_user)):
    user = await User.get(id=user.id)
    user.board_data = {"tasks": {}, "columns": {}, "columnOrder": []}
    await user.save()

    return {"status": "success"}


register_tortoise(
    app,
    db_url='postgres://postgres:Password1@127.0.0.1:5432/postgres',
    modules={'models': ['main']},
    generate_schemas=True,
    add_exception_handlers=True
)
