import React, { useEffect, useState } from "react";

const CompletedTasks = ({
  isLoading,
  setIsLoading,
  board,
  getData,
  setGetData,
}) => {
  const getCompletedTasks = () => {
    // 一覧取得
    if (!isLoading) {
      setIsLoading(true);
      fetch("http://api.skilljapan.info/completed_tasks", {
        method: "GET",
        headers: {
          authorization: "Bearer Mj8BnSCz",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setGetData(data);
        })
        .catch((e) => {
          alert("エラーが発生しました。。");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    // ボードの内容が変更されたら
    getCompletedTasks();
    
  }, [board]);

  const deleteCompleteTask = (id) => {
    if (window.confirm("削除してよろしいですか？")) {
      if (!isLoading) {
        setIsLoading(true);
        fetch("http://api.skilljapan.info/completed_tasks/" + id, {
          method: "DELETE",
          headers: {
            authorization: "Bearer Mj8BnSCz",
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
          })
          .catch((e) => {
            alert("エラーが発生しました。。");
          })
          .finally(() => {
            setIsLoading(false);
            getCompletedTasks();
          });
      }
    }
  };
  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={getCompletedTasks}
      >
        完了済みタスク一覧
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                完了タスク一覧
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {isLoading ? (
                // ローディング中はスピナー表示
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">カテゴリー</th>
                        <th scope="col">タスク名</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {getData.map((data, index) => (
                        <tr key={index}>
                          <td>{data.category}: </td>
                          <td>{data.name}</td>
                          <td>

                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              deleteCompleteTask(data.id);
                            }}
                          >
                            削除
                          </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedTasks;
