import React, { useState, useEffect } from 'react';
import {
  createTask,
  updateTask,
  deleteTask,
  getTaskComments,
  createComment,
  deleteComment,
} from '../api/client';
import { useAppAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import {
  X,
  Calendar,
  User,
  Trash2,
  Send,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';

const TaskModal = ({
  isOpen,
  onClose,
  task = null, // null means creating a new task
  initialStatus = 'todo',
  projectId,
  projectMembers = [],
  projectOwnerId,
  onTaskUpdated,
  onTaskCreated,
  onTaskDeleted,
}) => {
  const { userId } = useAppAuth();
  const { socket } = useSocket();

  const isEditing = Boolean(task && task.id);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Comments states
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Operation states
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Populate form on open
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setStatus(task.status || 'todo');
        setPriority(task.priority || 'medium');
        setAssignedTo(task.assigned_to || task.assignee?.userId || '');
        setDueDate(task.due_date ? task.due_date.substring(0, 10) : '');
        fetchComments(task.id);
      } else {
        setTitle('');
        setDescription('');
        setStatus(initialStatus || 'todo');
        setPriority('medium');
        setAssignedTo('');
        setDueDate('');
        setComments([]);
      }
    }
  }, [isOpen, task, initialStatus]);

  // Listen for real-time comment events
  useEffect(() => {
    if (!socket || !task?.id) return;

    const handleCommentCreated = (payload) => {
      if (payload.taskId === task.id) {
        setComments((prev) => {
          if (prev.some((c) => c.id === payload.comment.id)) return prev;
          return [...prev, payload.comment];
        });
      }
    };

    const handleCommentDeleted = (payload) => {
      if (payload.taskId === task.id) {
        setComments((prev) => prev.filter((c) => c.id !== payload.commentId));
      }
    };

    socket.on('comment:created', handleCommentCreated);
    socket.on('comment:deleted', handleCommentDeleted);

    return () => {
      socket.off('comment:created', handleCommentCreated);
      socket.off('comment:deleted', handleCommentDeleted);
    };
  }, [socket, task?.id]);

  const fetchComments = async (taskId) => {
    try {
      setLoadingComments(true);
      const data = await getTaskComments(taskId);
      setComments(data || []);
    } catch (err) {
      console.warn('Error loading comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        const updated = await updateTask(task.id, {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          assigned_to: assignedTo || null,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        });
        toast.success('Task updated successfully');
        if (onTaskUpdated) onTaskUpdated(updated);
      } else {
        const created = await createTask({
          projectId,
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          assigned_to: assignedTo || null,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        });
        toast.success('Task created successfully');
        if (onTaskCreated) onTaskCreated(created);
      }
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      setDeleting(true);
      await deleteTask(task.id);
      toast.success('Task deleted');
      if (onTaskDeleted) onTaskDeleted(task.id);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      const newComment = await createComment({
        taskId: task.id,
        content: commentText.trim(),
      });
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      toast.error(err.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('Comment removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove comment');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Modal Header */}
          <div className="modal-header bg-light border-bottom px-4 py-3">
            <h5 className="modal-title fw-bold text-dark mb-0">
              {isEditing ? 'Task Details & Activity' : 'Create New Task'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Left Form Column */}
              <div className={isEditing ? 'col-lg-7' : 'col-12'}>
                <form onSubmit={handleSave}>
                  {/* Task Title */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Task Title <span className="text-danger">*</span></label>
                    <input
                      id="task-title-input"
                      name="taskTitle"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Design Landing Page mockups"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Add details, acceptance criteria, or links..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Status & Priority Row */}
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label fw-semibold">Status</label>
                      <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label fw-semibold">Priority</label>
                      <select
                        className="form-select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                  </div>

                  {/* Assignee & Due Date Row */}
                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <label className="form-label fw-semibold">Assignee</label>
                      <select
                        className="form-select"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {projectMembers.map((m) => (
                          <option key={m.userId} value={m.userId}>
                            {m.name} ({m.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label fw-semibold">Due Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    {isEditing ? (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                        onClick={handleDeleteTask}
                        disabled={deleting || saving}
                      >
                        <Trash2 size={15} />
                        <span>Delete Task</span>
                      </button>
                    ) : (
                      <div></div>
                    )}

                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={onClose}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        id="task-submit-btn"
                        type="submit"
                        className="btn btn-primary-pm btn-sm px-4"
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Activity / Comments Column (Only in Edit mode) */}
              {isEditing && (
                <div className="col-lg-5 border-start ps-lg-4 d-flex flex-column">
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-1.5 text-dark">
                    <MessageSquare size={16} className="text-primary" />
                    <span>Comments & Activity ({comments.length})</span>
                  </h6>

                  {/* Comment List */}
                  <div
                    className="flex-grow-1 overflow-y-auto pe-1 mb-3"
                    style={{ maxHeight: '280px', minHeight: '180px' }}
                  >
                    {loadingComments ? (
                      <div className="text-center py-4 text-muted small">Loading comments...</div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-4 text-muted small bg-light rounded-3">
                        No comments yet. Start the conversation!
                      </div>
                    ) : (
                      comments.map((comment) => {
                        const canDelete =
                          comment.user_id === userId || projectOwnerId === userId;
                        return (
                          <div key={comment.id} className="comment-bubble mb-2.5">
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <div className="d-flex align-items-center gap-1.5">
                                <span className="fw-bold small text-dark">
                                  {comment.author?.name || 'Member'}
                                </span>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                  • {comment.created_at ? format(new Date(comment.created_at), 'MMM d, h:mm a') : 'just now'}
                                </span>
                              </div>
                              {canDelete && (
                                <button
                                  className="btn btn-link text-danger p-0 border-0"
                                  title="Delete comment"
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  <X size={13} />
                                </button>
                              )}
                            </div>
                            <p className="mb-0 text-secondary small text-break">
                              {comment.content}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add Comment Form */}
                  <form onSubmit={handleAddComment} className="mt-auto">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={submittingComment}
                      />
                      <button
                        className="btn btn-primary-pm btn-sm px-3"
                        type="submit"
                        disabled={submittingComment || !commentText.trim()}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
