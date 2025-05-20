import React from "react";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { Trash2, SquarePen, CircleCheck, CircleX } from "lucide-react"


function App() {
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem("todos")) || []);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (input.trim() === "") return;
    setTodos((prev) => [...prev, { title: input, completed: false }]);
    setInput("");
    inputRef.current?.focus();
  }

  const handleDeletedTodo = useCallback((index) => {
    setTodos((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
  }, []);

  const handleMarkCompleted = useCallback((index) => {
    setTodos((prev) => [...prev.slice(0, index), { ...prev[index], completed: !prev[index].completed }, ...prev.slice(index + 1)]);
  }, []);

  const handleEditTodo = ()=>{
    if(input.trim() === "") return;
    setTodos((prev) => [...prev.slice(0, editIndex), { ...prev[editIndex], title: input }, ...prev.slice(editIndex + 1)]);
    setInput("");
    setEditIndex(null);
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && editIndex === null) {
      handleAddTodo();
    }else if (e.key === "Enter" && editIndex !== null) {
      handleEditTodo();
    }else if (e.key === "Escape") {
      setInput("");
      setEditIndex(null);
    }
  };


  return (
    <>
      <div className="h-dvh flex flex-col justify-center items-center bg-slate-800">
        <h1 className="text-4xl text-slate-200 font-bold">Todo List</h1>
        <div className="w-96 h-fit bg-slate-700 rounded-lg mt-10 flex flex-col justify-center items-center">
          <div className="w-full px-2 h-16 flex justify-center items-center">
            <input
              type="text"
              placeholder="Add a new todo"
              className="w-80 h-10 mx-4 pl-1.5 text-slate-900 dark:text-slate-100 outline-none focus:outline-none focus:border-b focus:border-gray-300 rounded-none"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e)}
            />
            <button
              className="bg-slate-500 w-20 h-10 rounded-lg ml-2"
              onClick={editIndex === null ? handleAddTodo : handleEditTodo}
            >
              {editIndex !== null ? "Edit" : "Add"}
            </button>
          </div>
        </div>
        <div>
          <ul className="w-96 h-fit bg-slate-700 rounded-lg mt-10 flex flex-col justify-center items-center">
            {todos.map((todo, index) => (
              <li
                key={index}
                className="w-full px-2 h-16 flex justify-between items-center ps-4 text-[1rem]"
              >
                <span className={`${todo.completed? 'line-through !text-green-600':''} text-slate-200 w-70 break-words tracking-wide font-semibold select-none`}>{todo.title}</span>
                <div className="w-30 h-10 flex justify-end items-center gap-2">
                  <button className={`${!todo.completed? 'text-yellow-500 hover:text-yellow-800':'text-gray-400 hover:text-gray-200'}`} onClick={()=> handleMarkCompleted(index)}>
                    {!todo.completed ? <CircleCheck /> : <CircleX />}
                  </button>
                  <button className="text-red-600 hover:text-red-900" onClick={()=> handleDeletedTodo(index)}>
                    <Trash2 />
                  </button>
                  <button className="text-blue-400 hover:text-blue-600" onClick={()=> {setInput(todo.title), setEditIndex(index)}}>
                    <SquarePen />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    </>
  );
}

export default App;
