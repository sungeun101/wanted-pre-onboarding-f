import { PlusCircleOutlined } from "@ant-design/icons";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./axios";
import TodoItem from "./TodoItem";

export interface TodoResponse {
  id: number;
  todo: string;
  isCompleted: boolean;
  userId: string;
}

export default function Todo() {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState<TodoResponse[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/");
    } else {
      getTodos();
    }
  }, [navigate]);

  const onLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setTodo(value);
  };

  const createTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      await axiosInstance.post(`/todos`, { todo });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("400")) {
        alert("에러가 발생했습니다.");
      }
    }
    getTodos();
    setTodo("");
  };

  const getTodos = async () => {
    const res = await axiosInstance.get(`/todos`);
    setTodoList(res.data);
  };

  return (
    <div className="flex justify-center h-screen w-screen text-slate-800">
      <section className="flex flex-col w-full max-w-3xl m-6">
        <nav className="flex justify-between">
          Welcome!
          <button onClick={onLogout} className="bg-blue-200 rounded-sm px-2">
            Logout
          </button>
        </nav>
        <main className="bg-slate-100 mt-10 max-w-lg mx-auto">
          <form
            onSubmit={createTodo}
            className="p-10 flex items-center justify-center gap-2 bg-white rounded-md"
          >
            <input
              type="text"
              placeholder="What's on your mind?"
              value={todo}
              onChange={handleChange}
              autoFocus={true}
              className="border-blue-100 border-2 p-1 rounded-lg"
            />
            <button type="submit">
              <PlusCircleOutlined />
            </button>
          </form>
          {todoList &&
            todoList.length > 0 &&
            todoList.map((item) => (
              <TodoItem item={item} getTodos={getTodos} key={item.id} />
            ))}
        </main>
      </section>
    </div>
  );
}
