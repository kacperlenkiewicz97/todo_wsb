import React, { useState, useEffect } from 'react';
import './index.css';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() !== '') {
      const response = await fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: inputValue, done: false }),
      });
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const handleToggleTodo = async (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = {
      ...updatedTodos[index],
      done: !updatedTodos[index].done,
    };
    setTodos(updatedTodos);
  
    await fetch(`http://localhost:3001/todos/${updatedTodos[index].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodos[index]),
    });
  };
  

  const handleDeleteTodo = async (index) => {
    const todo = todos[index];
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);

    await fetch(`http://localhost:3001/todos/${todo.id}`, {
      method: 'DELETE',
    });
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch('http://localhost:3001/todos');
      const data = await response.json();
      setTodos(data);
    };

    fetchTodos();
  }, []);

  return (
    <div className="app">
      <h1>TODO App</h1>
      <div>
        <input
          type="text"
          className="input-text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleAddTodo}>Dodaj</button>
      </div>
      <ul className="todo-list">
  {todos.map((todo, index) => (
    <li
    key={todo.id}
    className={`todo-item ${todo.done ? 'done' : ''}`}
  >
      {todo.title}
      <button onClick={() => handleToggleTodo(index)}>
        {todo.done ? 'Undone' : 'Done'}
      </button>
      <button onClick={() => handleDeleteTodo(index)}>Usuń</button>
    </li>
  ))}
</ul>

    </div>
  );
};

export default App;
