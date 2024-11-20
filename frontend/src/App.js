import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [todoList, setTodoList] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/todo');
        setTodoList(response.data);
      } catch (err) {
        setError('Failed to fetch tasks');
      }
    };

    fetchTodos();
  }, []);

  const addTodoHandler = async () => {
    if (!title.trim() || !desc.trim()) {
      setError('Please enter both title and description');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/todo/', { 
        'title': title, 
        'description': desc 
      });
      
      setTodoList([...todoList, response.data]);
      setTitle('');
      setDesc('');
      setError(null);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const deleteTask = async (index) => {
    try {
      console.log("Deleting task with title:", todoList[index].title);
      const response = await axios.delete(`http://localhost:8000/api/todo/${todoList[index].title}`);
      console.log("Delete Response:", response);
      
      // Update the state to remove the deleted task from the list
      const newTodoList = todoList.filter((_, i) => i !== index);
      setTodoList(newTodoList);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError('Failed to delete task');
    }
  };
  

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.headerContent}>
              <h1 style={styles.title}>Task Manager</h1>
              <p style={styles.subtitle}>FASTAPI - React - MongoDB</p>
            </div>
          </div>

          <div style={styles.contentSection}>
            {error && (
              <div style={styles.errorBox}>
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)} 
                  style={styles.errorClose}
                >
                  ×
                </button>
              </div>
            )}

            <div style={styles.formContainer}>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task Title"
                  style={styles.input}
                />
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Task Description"
                  style={styles.textarea}
                ></textarea>
                <button 
                  onClick={addTodoHandler}
                  style={styles.addButton}
                >
                  Add Task
                </button>
              </div>
            </div>

            <div style={styles.taskSection}>
              <h2 style={styles.taskTitle}>Your Tasks</h2>
              {todoList.length === 0 ? (
                <p style={styles.noTasks}>No tasks yet. Start adding tasks!</p>
              ) : (
                <div style={styles.taskGrid}>
                  {todoList.map((todo, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.taskItem,
                        background: `linear-gradient(135deg, ${getRandomColor()} 0%, ${getRandomColor()} 100%)`
                      }}
                    >
                      <div style={styles.taskItemContent}>
                        <h3 style={styles.taskItemTitle}>{todo.title}</h3>
                        <p style={styles.taskItemDesc}>{todo.description}</p>
                      </div>
                      <div style={styles.taskItemActions}>
                        <button 
                          onClick={() => deleteTask(index)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={styles.footer}>
            <div style={styles.footerContent}>
              © {new Date().getFullYear()} Task Manager. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Function to generate random vibrant colors
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 65%)`;
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif',
    margin: '0',
    padding: '20px',
    boxSizing: 'border-box'
  },
  container: {
    width: '100%',
    maxWidth: '800px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
    padding: '20px',
    textAlign: 'center'
  },
  headerContent: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  title: {
    margin: '0 0 10px',
    fontSize: '28px',
    fontWeight: '700'
  },
  subtitle: {
    margin: '0',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '16px'
  },
  contentSection: {
    padding: '20px',
    maxWidth: '700px',
    margin: '0 auto'
  },
  formContainer: {
    marginBottom: '30px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontSize: '16px'
  },
  textarea: {
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    minHeight: '100px',
    fontSize: '16px'
  },
  addButton: {
    padding: '12px 20px',
    backgroundColor: '#6a11cb',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  errorBox: {
    backgroundColor: '#ffdddd',
    color: 'red',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  errorClose: {
    background: 'none',
    border: 'none',
    color: 'red',
    fontSize: '20px',
    cursor: 'pointer'
  },
  taskSection: {
    marginTop: '20px'
  },
  taskTitle: {
    textAlign: 'center',
    color: '#6a11cb',
    marginBottom: '20px'
  },
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '10px'
  },
  taskItem: {
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  taskItemContent: {
    padding: '20px',
    color: 'white'
  },
  taskItemTitle: {
    margin: '0 0 10px',
    fontSize: '20px',
    fontWeight: '700'
  },
  taskItemDesc: {
    margin: '0',
    fontSize: '15px',
    opacity: '0.9'
  },
  taskItemActions: {
    padding: '15px',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  deleteButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  noTasks: {
    textAlign: 'center',
    color: '#888',
    fontSize: '16px'
  },
  footer: {
    background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
    textAlign: 'center',
    padding: '15px',
    fontSize: '14px'
  }
};

export default App;