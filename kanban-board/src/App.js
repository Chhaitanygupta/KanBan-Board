import React from 'react';
import './App.css';
import Board from './components/board/Board';
import Editable from './components/editabled/Editable';
import { fetchBoards, addBoard, removeBoard } from './api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function App() {
  const [boards, setBoards] = React.useState([]);

  React.useEffect(() => {
    fetchBoards().then((response) => {
      setBoards(response.boards);
    });
  }, []);

  const handleAddBoard = (title) => {
    const newBoard = {
      id: Date.now() + Math.random(),
      title,
      tasks: {},
      columns: {},
      columnOrder: [],
    };

    setBoards([...boards, newBoard]);
    addBoard(newBoard);
  };

  const handleRemoveBoard = (boardId) => {
    const updatedBoards = boards.filter((board) => board.id !== boardId);
    setBoards(updatedBoards);
    removeBoard(boardId);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const updatedBoards = Array.from(boards);
    const [removed] = updatedBoards.splice(source.index, 1);
    updatedBoards.splice(destination.index, 0, removed);

    setBoards(updatedBoards);
  };

  return (
    <div className="app">
      <h1 className="app-title">Kanban Board</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="boards" direction="horizontal">
          {(provided) => (
            <div className="app-boards" ref={provided.innerRef} {...provided.droppableProps}>
              {boards.map((board, index) => (
                <Draggable key={board.id} draggableId={board.id} index={index}>
                  {(provided) => (
                    <div
                      className="app-board"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Board board={board} removeBoard={handleRemoveBoard} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <div className="board">
                <Editable
                  displayClass="board-add"
                  text="Add Board"
                  placeholder="Enter Board Title"
                  onSubmit={handleAddBoard}
                />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
