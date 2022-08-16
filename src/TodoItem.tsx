import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { axiosInstance } from "./axios";
import { TodoResponse } from "./Todo";

export default function TodoItem(props: { item: TodoResponse; getTodos: any }) {
  const {
    item: { id, isCompleted, todo, userId },
    getTodos,
  } = props;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newTodo, setNewTodo] = useState<string>(todo);
  const [newCompleted, setNewCompleted] = useState<boolean>(isCompleted);

  useEffect(() => {
    if (newCompleted !== isCompleted) {
      updateTodo();
    }
  }, [newCompleted]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setNewTodo(value);
  };

  const updateTodo = async () => {
    try {
      await axiosInstance.put(`/todos/${id}`, {
        id,
        todo: newTodo,
        isCompleted: newCompleted,
        userId,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("에러가 발생했습니다.");
      }
    }
    getTodos();
    setIsEditMode(false);
  };

  const handleComplete = () => {
    setNewCompleted(!isCompleted);
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setNewTodo(todo);
  };

  const deleteTodo = async () => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("에러가 발생했습니다.");
      }
    }
    getTodos();
  };

  return (
    <section key={id} className="m-2 flex justify-between">
      {isEditMode ? (
        <>
          <input
            type="text"
            value={newTodo}
            onChange={handleChange}
            autoFocus={true}
            className="border-blue-100 border-2 rounded-lg px-1"
          />
          <div className="flex gap-1">
            <button
              onClick={updateTodo}
              className="border-blue-100 border-2 px-2 rounded-lg text-xs"
              disabled={newTodo === "" || newTodo === todo}
            >
              <span
                className={
                  newTodo === "" || newTodo === todo ? "text-gray-400" : ""
                }
              >
                수정
              </span>
            </button>
            <button
              onClick={cancelEdit}
              className="border-blue-100 border-2 px-2 rounded-lg text-xs"
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            className="cursor-pointer w-full hover:text-blue-600 mr-5"
            onClick={handleComplete}
          >
            <span
              className={
                isCompleted
                  ? "line-through decoration-red-700 decoration-2 text-gray-400"
                  : ""
              }
            >
              {todo}
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsEditMode(true)}>
              <EditOutlined />
            </button>
            <button onClick={deleteTodo}>
              <DeleteOutlined />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
