import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { dummyData } from "../dummyData";
import Category from "./Category";
import CompletedTasks from "./CompletedTasks";
import SaveCompleteTasks from "./SaveCompleteTasks";

const Board = () => {
  // ボードの情報保存
  const [board, setBoard] = useState(dummyData);
  // 名前保存
  const [name, setName] = useState(board.name);
// フォーカス保存
  const [focus, setFocus] = useState({ category: -1, task: -1 });
  // ローディング中か
  const [isLoading, setIsLoading] = useState(false);
  // APIによって得たデータ保存
  const [getData, setGetData] = useState([]);

  const handleDragEnd = (drag) => {
    // ドラッグ後
    const { destination, source } = drag;

    if (drag.type === "category") {
      // ドラッグしたものがカテゴリーだったら
      setBoard((prevBoard) => {
        const [removed] = prevBoard.categories.splice(source.index, 1);
        prevBoard.categories.splice(destination.index, 0, removed);
        return { ...prevBoard };
      });
    } else if (drag.type === "task") {
      // ドラッグしたものがタスクだったら
      const sourceCategoryIndex = board.categories.findIndex(
        (category) => category.id === source.droppableId
      );
      const destinationCategoryIndex = board.categories.findIndex(
        (category) => category.id === destination.droppableId
      );

      setBoard((prevBoard) => {
        const [removed] = prevBoard.categories[
          sourceCategoryIndex
        ].tasks.splice(source.index, 1);
        prevBoard.categories[destinationCategoryIndex].tasks.splice(
          destination.index,
          0,
          removed
        );
        return { ...prevBoard };
      });
    }
  };

  const changeName = (e) => {
    // 名前変更
    setName(e.target.value);
    setBoard((prevBoard) => {
      prevBoard.name = e.target.value;
      return prevBoard;
    });
  };

  const addCategory = () => {
    // カテゴリー追加
    setBoard((prevBoard) => {
      prevBoard.categories = [
        ...prevBoard.categories,
        {
          name: "",
          id: Math.floor(Math.random() * 10000000).toString(),
          tasks: [],
        },
      ];

      return { ...prevBoard };
    });

    setTimeout(() => {
      // 追加後の処理
      const addedCategory = document.querySelector(
        `.categoryInput-${board.categories.length - 1}`
      );
      if (addedCategory) {
        addedCategory.focus();
      }
    }, 20);
  };

  const handleKeyDown = (e) => {
    // キーが押されたら
    if (focus.category === -1 && focus.task === -1) {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowLeft"
      ) {
        // 初めて矢印を押したとき
        setFocus({ category: 0, task: 0 });
      }
    } else if (e.key === "ArrowDown") {
      // 下矢印
      if (
        board.categories[focus.category].tasks[focus.task + 1] !== undefined
        ) {
          setFocus((prevFocus) => ({ ...prevFocus, task: prevFocus.task + 1 }));
        }
      } else if (e.key === "ArrowUp") {
      // 上矢印
      if (
        board.categories[focus.category].tasks[focus.task - 1] !== undefined
        ) {
          setFocus((prevFocus) => ({ ...prevFocus, task: prevFocus.task - 1 }));
        }
      } else if (e.key === "ArrowRight") {
      // 右矢印
      let nextCategoryIndex = -1;
      board.categories.forEach((category, index) => {
        // 次のカテゴリーの探索
        if (
          nextCategoryIndex === -1 &&
          index > focus.category &&
          board.categories[focus.category].tasks.length !== 0
          ) {
            nextCategoryIndex = index;
          }
        });
        
        if (nextCategoryIndex !== -1) {
          if (board.categories[nextCategoryIndex].tasks.length - 1 < focus.task) {
            setFocus({
              category: nextCategoryIndex,
              task: board.categories[nextCategoryIndex].tasks.length - 1,
            });
          } else {
            setFocus((prevFocus) => ({
              ...prevFocus,
              category: nextCategoryIndex,
            }));
          }
        }
      } else if (e.key === "ArrowLeft") {
        // 左矢印
        let nextCategoryIndex = -1;
        board.categories.forEach((category, index) => {
        // 次のカテゴリーの探索
        if (
          index < focus.category &&
          board.categories[focus.category].tasks.length !== 0
        ) {
          nextCategoryIndex = index;
        }
      });

      if (nextCategoryIndex !== -1) {
        if (board.categories[nextCategoryIndex].tasks.length - 1 < focus.task) {
          setFocus({
            category: nextCategoryIndex,
            task: board.categories[nextCategoryIndex].tasks.length - 1,
          });
        } else {
          setFocus((prevFocus) => ({
            ...prevFocus,
            category: nextCategoryIndex,
          }));
        }
      }
    }

    if (e.key === "Enter") {
      // エンターが押されたら
      if (document.activeElement.tagName === "INPUT") {
        document.activeElement.blur();
      } else {
        // もしそうでなくてタスクにフォーカスが当たっていたら
        const focusTask = document.querySelector(
          `.taskInput-${focus.category}-${focus.task}`
        );
        if (focusTask) {
          focusTask.focus();
        }
      }
    } else if (e.key === "c") {
      // 完了処理
      if (!isLoading) {
        setIsLoading(true);

        fetch("http://api.skilljapan.info/completed_tasks", {
          method: "POST",
          headers: {
            authorization: "Bearer Mj8BnSCz",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: board.categories[focus.category].tasks[focus.task].name,
            category: board.categories[focus.category].name,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setBoard((prevBoard) => {
                prevBoard.categories[focus.category].tasks.splice(
                  focus.task,
                  1
                );
                return { ...prevBoard };
              });
            }
          })
          .catch((e) => {
            alert("エラーが発生しました。。");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  };
  useEffect(() => {
    // フォーカスが変更されたら実行
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focus]);

  return (
    <div className="container mt-3">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="card">
          <div className="card-header">
            <h1 className="d-flex justify-content-start">
              <input
                className="bg-transparent border-0"
                onChange={changeName}
                value={name}
              ></input>
            </h1>
          </div>
          <div className="card-body c-board__body overflow-auto">
            <Droppable
              droppableId={board.id}
              type="category"
              direction="horizontal"
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="d-flex h-100"
                >
                  {board.categories.map((category, index) => (
                    <Draggable
                      key={category.id}
                      draggableId={category.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Category
                            board={board}
                            setBoard={setBoard}
                            focus={focus}
                            categoryIndex={index}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                          ></Category>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                  <button
                    className="btn btn-outline-primary h-100 c-category"
                    onClick={addCategory}
                  >
                    カテゴリー追加
                  </button>
                </div>
              )}
            </Droppable>
          </div>
          <div className="card-footer d-flex justify-content-between">
            <SaveCompleteTasks
            board={board}
            getData={getData}
            ></SaveCompleteTasks>
            <CompletedTasks
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              board={board}
              getData={getData}
              setGetData={setGetData}
            ></CompletedTasks>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
