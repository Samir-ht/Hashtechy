import "./App.css";
import Navbar from "./nav";
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      console.log("sdff");

      const response = await axios.get("http://localhost:3010/tasks");
      console.log(response);

      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    console.log("enter");
    
    if (todo.trim() === "") return;
    try {
      if (editId) {
        const response = await axios.put(
          `http://localhost:3010/task/${editId}`,
          { todo }
        );
        setTodos(
          todos.map((item) =>
            item._id === editId ? { ...item, todo: response.data.todo } : item
          )
        );

        setEditId(null);
      } else {
        const response = await axios.post("http://localhost:3010/task", {
          todo,
        });
        setTodos([...todos, response.data]);
      }
      setTodo("");
    } catch (error) {
      alert("Task Not Added");
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    let edited = todos.find((i) => i._id === id);
    if (edited) {
      setTodo(edited.todo);
      setEditId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3010/task/${id}`);
      setTodos(todos.filter((item) => item._id !== id));
    } catch (error) {
      alert("Task Not Deleted");
      console.error(error);
    }
  };

  const handleCheckbox = async (id,todo,isCompleted) => {
    try {
      const {data} = await updateTask(id,todo,!isCompleted);
      setTodos(todos.map(todo=> todo._id === id ? data : todo));
    } catch (error) {
      console.error("Error updating checkbox:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 rounded-xl p-5 bg-gray-500">
        <h1 className="text-xl font-bold">Add Work To Do</h1>
        <input
          type="text"
          onChange={(e) => setTodo(e.target.value)}
          value={todo}
          className="border-spacing-1 rounded-sm w-1/2"
        />
        <button
          onClick={handleAdd}
          className="bg-transparent hover:bg-gray-700 p-3 py-1 rounded-md mx-3"
        >
          ADD
        </button>
      </div>

      <div className="container mx-auto my-5 rounded-xl p-5 bg-gray-400 min-h-screen">
        <h2 className="text-xl font-bold">Works-TO-DO</h2>
        {todos.length === 0 && <div>No Work Added</div>}
        <div className="todos">
          {todos.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center my-2"
            >
              {/* <p>{item.todo}</p> */}
              <input
                className="justify-start"
                type="checkbox"
                checked={item.isCompleted}
                onChange={() => handleCheckbox(item._id)}
              />
              <div className={item.isCompleted ? "line-through" : ""}>
                {item.todo}
              </div>
              <div className="flex justify-end "> 
              <button
                onClick={() => handleEdit(item._id)}
                className="bg-transparent hover:bg-gray-700 p-3 py-1 rounded-md mx-1 "
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-gray-600 hover:bg-gray-700 p-3 py-1 rounded-md mx-1"
              >
                Delete
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
