from fastapi import APIRouter, Depends
from main import User
from dependencies import get_current_user
from models import Board


router = APIRouter()

@router.get("/board")
async def get_board(user: User = Depends(get_current_user)):
    return {'board': user.board_data}

@router.post("/board")
async def save_board(board: Board, user: User = Depends(get_current_user)):
    user.board_data = board.json()
    await user.save()

    return {"status": "success"}

@router.delete("/board/{board_id}")
async def delete_board(board_id: int, user: User = Depends(get_current_user)):
    user.board_data = {"tasks": {}, "columns": {}, "columnOrder": []}
    await user.save()

    return {"status": "success"}

