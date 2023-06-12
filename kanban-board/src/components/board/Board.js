import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Trash2 } from 'react-feather';

import './Board.css';
import Editable from '../editabled/Editable';
import Card from '../card/Card';
import { fetchBoards, saveBoard } from '../../api';

function Board(props) {
  const [board, setBoard] = useState({ tasks: {}, columns: {}, columnOrder: [] });

  useEffect(() => {
    fetchBoards().then((response) => {
      setBoard(response.board);
    });
  }, []);

  const handleAddCard = (title, columnId) => {
    const card = {
      id: Date.now() + Math.random(),
      content: title,
    };

    const updatedBoard = { ...board };
    updatedBoard.tasks[card.id] = card;
    updatedBoard.columns[columnId].taskIds.push(card.id);

    setBoard(updatedBoard);
    saveBoard(updatedBoard);
  };

  const handleRemoveCard = (cardId, columnId) => {
    const updatedBoard = { ...board };
    const taskIds = updatedBoard.columns[columnId].taskIds.filter((id) => id !== cardId);
    updatedBoard.columns[columnId].taskIds = taskIds;
    delete updatedBoard.tasks[cardId];

    setBoard(updatedBoard);
    saveBoard(updatedBoard);
  };

  const handleRemoveBoard = () => {
    props.removeBoard(props.board.id);
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = board.columns[source.droppableId];
    const destinationColumn = board.columns[destination.droppableId];

    if (sourceColumn === destinationColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoard(newBoard);
      saveBoard(newBoard);
    } else {
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);

      const destinationTaskIds = Array.from(destinationColumn.taskIds);
      destinationTaskIds.splice(destination.index, 0, draggableId);

      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [sourceColumn.id]: {
            ...sourceColumn,
            taskIds: sourceTaskIds,
          },
          [destinationColumn.id]: {
            ...destinationColumn,
            taskIds: destinationTaskIds,
          },
        },
      };

      setBoard(newBoard);
      saveBoard(newBoard);
    }
  };

  return (
    <div className="board">
      <div className="board_header">
        <h2>{props.board.title}</h2>
        <Trash2 className="board_delete" onClick={handleRemoveBoard} />
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board_content">
          {board.columnOrder.map((columnId, columnIndex) => {
            const column = board.columns[columnId];
            const tasks = column.taskIds.map((taskId, taskIndex) => board.tasks[taskId]);

            return (
              <div key={column.id} className="board_column">
                <h3>{column.title}</h3>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card
                                card={task}
                                removeCard={() => handleRemoveCard(task.id, column.id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Editable
                  displayClass="board_column_add"
                  text="Add Card"
                  placeholder="Enter Card Content"
                  onSubmit={(value) => handleAddCard(value, column.id)}
                />
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Board;
