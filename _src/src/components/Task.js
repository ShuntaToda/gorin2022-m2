import React, { useState } from "react";

const Task = ({
  board,
  setBoard,
  focus,
  categoryIndex,
  isLoading,
  taskIndex,
  setIsLoading,
}) => {
  const [name, setName] = useState(
    board.categories[categoryIndex].tasks[taskIndex].name
  );

  const changeName = (e) => {
    // 名前変更
    setName(e.target.value);
    setBoard((prevBoard) => {
      prevBoard.categories[categoryIndex].tasks[taskIndex].name =
        e.target.value;
      return prevBoard;
    });
  };

  const checkActive = () => {
    // フォーカスがあたっているか
    if (focus.category === categoryIndex && focus.task === taskIndex) {
      return true;
    }
    return false;
  };

  const completeTask = () => {
    // タスク完了処理
    if (!isLoading) {
      setIsLoading(true);

      fetch("http://api.skilljapan.info/completed_tasks", {
        method: "POST",
        headers: {
          authorization: "Bearer Mj8BnSCz",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: board.categories[categoryIndex].tasks[taskIndex].name,
          category: board.categories[categoryIndex].name,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // 通信が正常だったらタスク削除
            setBoard((prevBoard) => {
              prevBoard.categories[categoryIndex].tasks.splice(taskIndex, 1);
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
  };
  return (
    <div
      className={`border my-3 p-3 d-flex ${
        checkActive() ? "border-primary" : ""
      }`}
    >
      <h2 className="d-flex justify-content-start">
        <input
          className={`bg-transparent border-0 taskInput-${categoryIndex}-${taskIndex}`}
          onChange={changeName}
          value={name}
          placeholder="タスク名"
        ></input>
      </h2>
      <button
        className="c-task__btn  btn btn-success btn-sm"
        onClick={completeTask}
      >
        完了
      </button>
    </div>
  );
};

export default Task;
