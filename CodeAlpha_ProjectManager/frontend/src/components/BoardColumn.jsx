import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const BoardColumn = ({
  status,
  title,
  tasks = [],
  onTaskClick,
  onOpenCreateTask,
  onStatusChange,
  onDropTask,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const getStatusDotColor = () => {
    switch (status) {
      case 'todo':
        return '#94a3b8';
      case 'in_progress':
        return '#2563eb';
      case 'done':
        return '#059669';
      default:
        return '#94a3b8';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const taskData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (taskData && taskData.id && taskData.status !== status) {
        onDropTask(taskData.id, status);
      }
    } catch (err) {
      console.warn('Drop error:', err);
    }
  };

  const handleCardDragStart = (e, task) => {
    e.dataTransfer.setData('application/json', JSON.stringify(task));
  };

  return (
    <div
      className={`kanban-column column-${status} ${isDragOver ? 'drop-zone-active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header from Stitch Kanban Screen */}
      <div className="kanban-column-header">
        <div className="d-flex align-items-center gap-2">
          <span
            className="rounded-circle d-inline-block"
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: getStatusDotColor(),
            }}
          ></span>
          <h6
            className="fw-bold mb-0 text-uppercase tracking-wider text-dark"
            style={{ fontSize: '0.8rem', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
          >
            {title}{' '}
            <span className="text-secondary font-mono fw-normal" style={{ fontSize: '0.75rem' }}>
              ({tasks.length})
            </span>
          </h6>
        </div>

        <button
          className="btn btn-sm btn-link text-secondary p-0 border-0"
          title={`Add task to ${title}`}
          onClick={() => onOpenCreateTask && onOpenCreateTask(status)}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Task List */}
      <div className="task-card-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
            onDragStart={handleCardDragStart}
            onStatusChange={onStatusChange}
          />
        ))}

        {tasks.length === 0 && (
          <div className="d-flex flex-column align-items-center justify-content-center p-4 border border-dashed rounded-3 text-muted bg-white bg-opacity-60">
            <span className="small text-secondary">No tasks in {title}</span>
            <button
              className="btn btn-link btn-sm text-primary text-decoration-none p-0 mt-1 fw-semibold"
              style={{ fontSize: '0.8rem' }}
              onClick={() => onOpenCreateTask && onOpenCreateTask(status)}
            >
              + Add Task
            </button>
          </div>
        )}
      </div>

      {/* Bottom Add Task Button */}
      <div className="pt-2 mt-auto border-top">
        <button
          className="btn btn-sm btn-light w-100 text-secondary fw-semibold d-flex align-items-center justify-content-center gap-1 py-1.5"
          style={{ borderRadius: '6px', fontSize: '0.8rem' }}
          onClick={() => onOpenCreateTask && onOpenCreateTask(status)}
        >
          <Plus size={15} />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};

export default BoardColumn;
