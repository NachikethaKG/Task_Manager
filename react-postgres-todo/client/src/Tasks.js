import React, { useEffect, useState } from 'react';
import './Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error(`Failed to load tasks (${res.status})`);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
      setError('Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    const desc = description.trim();
    if (!desc) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc })
      });
      if (!res.ok) throw new Error('Failed to add task');
      setDescription('');
      await fetchTasks();
    } catch (e) {
      console.error(e);
      setError('Could not add task');
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      if (!res.ok) throw new Error('Failed to update task');
      await fetchTasks();
    } catch (e) {
      console.error(e);
      setError('Could not update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete task');
      await fetchTasks();
    } catch (e) {
      console.error(e);
      setError('Could not delete task');
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = tasks.length - completedCount;

  if (loading) return <div className="loading">Loading Tasks...</div>;

  return (
    <div className="tasks-page">
      <div className="tasks-container">
        <h1>📝 My Tasks</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="task-stats">
          <div className="stat-item">
            <div className="stat-number">{tasks.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{activeCount}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What needs to be done?"
            maxLength={255}
          />
          <button type="submit" disabled={!description.trim()}>Add Task</button>
        </form>

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">No tasks yet</div>
              <div className="empty-state-subtext">Add a task above to get started!</div>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.task_id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content" onClick={() => toggleTask(task.task_id, task.completed)}>
                  <div className="task-checkbox"></div>
                  <div className="task-text">{task.description}</div>
                </div>
                <div className="task-actions">
                  <button className="delete-btn" onClick={() => deleteTask(task.task_id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
