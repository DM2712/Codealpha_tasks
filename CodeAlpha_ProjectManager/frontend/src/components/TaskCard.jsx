import React from 'react';
import { format, isPast, isToday } from 'date-fns';
import { MessageSquare, Calendar, User, Flag } from 'lucide-react';

const TaskCard = ({ task, onClick, onDragStart, onStatusChange }) => {
  const { id, title, description, priority = 'medium', status, due_date, assignee, commentCount = 0 } = task;

  const getPriorityStyle = (pri) => {
    switch (pri?.toLowerCase()) {
      case 'high':
        return { color: 'text-danger', iconClass: 'text-danger', label: 'High' };
      case 'low':
        return { color: 'text-success', iconClass: 'text-success', label: 'Low' };
      default:
        return { color: 'text-warning-emphasis', iconClass: 'text-warning', label: 'Medium' };
    }
  };

  const priStyle = getPriorityStyle(priority);

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      const isOverdue = isPast(date) && !isToday(date) && status !== 'done';
      return {
        text: format(date, 'MMM d'),
        isOverdue,
        isToday: isToday(date),
      };
    } catch {
      return null;
    }
  };

  const dueInfo = formatDueDate(due_date);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      className="task-item-card"
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task)}
      onClick={() => onClick && onClick(task)}
    >
      {/* Top row: Priority Tag chip & Quick status */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className={`badge ${priority === 'high' ? 'badge-priority-high' : priority === 'low' ? 'badge-priority-low' : 'badge-priority-medium'}`}>
          {priority}
        </span>

        {/* Quick status dropdown */}
        <select
          className="form-select form-select-sm py-0 px-2 text-muted border-0 bg-light"
          style={{ width: 'auto', fontSize: '0.72rem', height: '22px', borderRadius: '6px' }}
          value={status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            onStatusChange && onStatusChange(id, e.target.value);
          }}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Task Title */}
      <h6 className="fw-semibold text-dark mb-1.5 lh-sm" style={{ fontSize: '0.92rem', fontFamily: 'var(--font-display)' }}>
        {title}
      </h6>

      {/* Description Snippet */}
      {description && (
        <p className="text-muted small mb-3 text-truncate" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
          {description}
        </p>
      )}

      {/* Footer Info: Flag priority, Calendar due date, comments, assignee */}
      <div className="d-flex justify-content-between align-items-end pt-2 border-top mt-2">
        <div className="d-flex flex-column gap-1">
          {/* Priority indicator */}
          <div className="d-flex align-items-center gap-1 small" style={{ fontSize: '0.75rem' }}>
            <Flag size={12} className={priStyle.iconClass} />
            <span className={`fw-medium font-mono ${priStyle.color}`} style={{ fontSize: '0.72rem' }}>
              {priStyle.label}
            </span>
          </div>

          {/* Due date */}
          {dueInfo && (
            <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.72rem' }}>
              <Calendar size={12} />
              <span className={`font-mono ${dueInfo.isOverdue ? 'text-danger fw-bold' : ''}`}>
                {dueInfo.text}
              </span>
            </div>
          )}
        </div>

        {/* Right side: Comments count & Assignee Avatar */}
        <div className="d-flex align-items-center gap-2">
          {commentCount > 0 && (
            <div className="d-flex align-items-center gap-1 text-muted small" style={{ fontSize: '0.72rem' }}>
              <MessageSquare size={12} />
              <span className="font-mono">{commentCount}</span>
            </div>
          )}

          <div title={assignee?.name || 'Unassigned'}>
            {assignee ? (
              assignee.avatarUrl ? (
                <img src={assignee.avatarUrl} alt={assignee.name} className="user-avatar-sm" />
              ) : (
                <div className="user-avatar-initials">{getInitials(assignee.name)}</div>
              )
            ) : (
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-light text-muted border"
                style={{ width: '26px', height: '26px', fontSize: '0.72rem' }}
              >
                <User size={13} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
