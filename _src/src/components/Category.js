import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Task from "./Task";

const Category = ({ board, setBoard, focus, categoryIndex, isLoading, setIsLoading }) => {
  const [name, setName] = useState(board.categories[categoryIndex].name);

  const changeName = (e) => {
    // 名前変更
    setName(e.target.value);
    setBoard((prevBoard) => {
      prevBoard.categories[categoryIndex].name = e.target.value;
      return prevBoard;
    });
  };

  const addTask = () => {
    // タスク追加
    setBoard((prevBoard) => {
      prevBoard.categories[categoryIndex].tasks = [
        ...prevBoard.categories[categoryIndex].tasks,
        {
          name: "",
          id: Math.floor(Math.random() * 10000000).toString(),
        },
      ];

      return { ...prevBoard };
    });
    setTimeout(() => {
      const addedTask = document.querySelector(
        `.taskInput-${categoryIndex}-${
          board.categories[categoryIndex].tasks.length - 1
        }`
      );

      if (addedTask) {
        addedTask.focus();
      }
    }, 20);
  };


  const removeCategory =()=>{
    // カテゴリー削除
    setBoard(prevBoard => {
        prevBoard.categories.splice(categoryIndex, 1)
        return {...prevBoard}
  })
  }
  return (
    <div className="card c-category h-100 mx-2">
      <div className="card-header">
        <h2 className="d-flex justify-content-start">
          <input
            className={`bg-transparent border-0  categoryInput-${categoryIndex}`}
            onChange={changeName}
            value={name}
            placeholder="カテゴリー名"
          ></input>
        </h2>
      </div>
      <div className="card-body overflow-auto">
        <Droppable droppableId={board.categories[categoryIndex].id} type="task">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {board.categories[categoryIndex].tasks.map((task, index) => (
                <Draggable draggableId={task.id} index={index} key={task.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Task
                        board={board}
                        setBoard={setBoard}
                        focus={focus}
                        categoryIndex={categoryIndex}
                        isLoading={isLoading}
                        taskIndex={index}
                        setIsLoading={setIsLoading}
                      ></Task>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <button className="btn btn-outline-primary btn-sm" onClick={addTask}>
          タスク追加
        </button>
        <button className="btn btn-outline-danger btn-sm" onClick={removeCategory}>
          カテゴリー削除
        </button>
      </div>
    </div>
  );
};

export default Category;
