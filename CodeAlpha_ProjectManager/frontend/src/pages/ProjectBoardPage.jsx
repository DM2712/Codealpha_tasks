import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getProject,
  getProjectTasks,
  updateTask,
  deleteProject,
} from '../api/client';
import { useAppAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import BoardColumn from '../components/BoardColumn';
import TaskModal from '../components/TaskModal';
import MemberManagementModal from '../components/MemberManagementModal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Filter,
  Trash2,
  Layers,
} from 'lucide-react';

const ProjectBoardPage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { userId } = useAppAuth();
  const { socket, joinProject, leaveProject } = useSocket();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [activeMobileColumn, setActiveMobileColumn] = useState('all');

  // Modal states
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalInitialStatus, setTaskModalInitialStatus] = useState('todo');
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const boardContainerRef = useRef(null);

  // Load project details and tasks
  const loadProjectData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectData, tasksData] = await Promise.all([
        getProject(projectId),
        getProjectTasks(projectId),
      ]);
      setProject(projectData);
      setTasks(tasksData || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [projectId, navigate]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  // Join Socket.io room for real-time updates
  useEffect(() => {
    if (!projectId) return;

    joinProject(projectId);

    if (socket) {
      const handleTaskCreated = (newTask) => {
        setTasks((prev) => {
          if (prev.some((t) => t.id === newTask.id)) return prev;
          return [newTask, ...prev];
        });
      };

      const handleTaskUpdated = (updatedTask) => {
        setTasks((prev) =>
          prev.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
        );
      };

      const handleTaskDeleted = ({ taskId }) => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      };

      const handleMemberChanged = () => {
        getProject(projectId).then(setProject).catch(console.warn);
      };

      const handleProjectDeleted = () => {
        toast.error('This project was deleted by the owner.');
        navigate('/dashboard');
      };

      socket.on('task:created', handleTaskCreated);
      socket.on('task:updated', handleTaskUpdated);
      socket.on('task:deleted', handleTaskDeleted);
      socket.on('member:added', handleMemberChanged);
      socket.on('member:removed', handleMemberChanged);
      socket.on('project:deleted', handleProjectDeleted);

      return () => {
        leaveProject(projectId);
        socket.off('task:created', handleTaskCreated);
        socket.off('task:updated', handleTaskUpdated);
        socket.off('task:deleted', handleTaskDeleted);
        socket.off('member:added', handleMemberChanged);
        socket.off('member:removed', handleMemberChanged);
        socket.off('project:deleted', handleProjectDeleted);
      };
    }
  }, [socket, projectId, joinProject, leaveProject, navigate]);

  // Open modal to create a new task
  const handleOpenCreateTask = (status = 'todo') => {
    setSelectedTask(null);
    setTaskModalInitialStatus(status);
    setIsTaskModalOpen(true);
  };

  // Open modal to view/edit existing task
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Handle task drag & drop status change or quick dropdown
  const handleStatusChange = async (taskId, newStatus) => {
    const originalTask = tasks.find((t) => t.id === taskId);
    if (!originalTask || originalTask.status === newStatus) return;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      toast.error('Failed to update task status');
      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? originalTask : t))
      );
    }
  };

  const handleDeleteProject = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${project.name}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteProject(projectId);
      toast.success('Project deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading project board..." />;
  }

  if (!project) {
    return null;
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

    if (filterAssignee === 'me') {
      if (task.assigned_to !== userId) return false;
    } else if (filterAssignee === 'unassigned') {
      if (task.assigned_to) return false;
    } else if (filterAssignee !== 'all') {
      if (task.assigned_to !== filterAssignee) return false;
    }

    return true;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

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
    <div className="container-fluid px-2 px-md-4 py-3 pb-5">
      {/* Board Header Section */}
      <div className="px-3 py-3 border-bottom bg-white rounded-3 shadow-sm mb-3 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Link to="/dashboard" className="btn btn-outline-secondary btn-sm p-1 rounded-2">
              <ArrowLeft size={16} />
            </Link>
            <span className="small text-secondary text-uppercase fw-semibold font-mono" style={{ letterSpacing: '0.05em' }}>
              PROJECT WORKSPACE
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h2 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)' }}>
              {project.name}
            </h2>
            <span
              className={`badge rounded-pill text-capitalize ${
                project.isOwner ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-light text-secondary border'
              }`}
              style={{ fontSize: '0.75rem' }}
            >
              {project.isOwner ? 'Owner' : project.userRole || 'Member'}
            </span>
          </div>

          {project.description && (
            <p className="text-secondary small mb-0 mt-1" style={{ maxWidth: '650px' }}>
              {project.description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="d-flex align-items-center gap-2 flex-wrap justify-content-between justify-content-md-end">
          {/* Member avatars chip */}
          <button
            type="button"
            className="member-chip-btn"
            onClick={() => setIsMemberModalOpen(true)}
            title="Manage Team Members"
          >
            <div className="avatar-stack">
              {(project.members || []).slice(0, 3).map((m) => (
                m.avatarUrl ? (
                  <img key={m.userId} src={m.avatarUrl} alt={m.name} className="user-avatar-xs" />
                ) : (
                  <div key={m.userId} className="user-avatar-initials-xs">
                    {getInitials(m.name)}
                  </div>
                )
              ))}
            </div>
            <span className="small fw-semibold text-secondary font-mono">
              {project.members?.length || 1}
            </span>
            <Users size={15} className="text-primary" />
          </button>

          {/* New Task Button */}
          <button
            type="button"
            className="btn-primary-pm"
            onClick={() => handleOpenCreateTask('todo')}
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>

          {/* Delete Project (Owner only) */}
          {project.isOwner && (
            <button
              type="button"
              className="btn-action-icon-danger"
              title="Delete Project"
              onClick={handleDeleteProject}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="pm-card-static p-2.5 bg-white mb-3">
        <div className="row g-2 align-items-center">
          {/* Search Box */}
          <div className="col-12 col-md-5 col-lg-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-end-0 text-secondary">
                <Search size={14} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search tasks on this board..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Priority Filter */}
          <div className="col-6 col-md-3 col-lg-3">
            <div className="d-flex align-items-center gap-1">
              <span className="small text-secondary text-nowrap d-none d-sm-inline">Priority:</span>
              <select
                className="form-select form-select-sm"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Assignee Filter */}
          <div className="col-6 col-md-4 col-lg-3">
            <div className="d-flex align-items-center gap-1">
              <span className="small text-secondary text-nowrap d-none d-sm-inline">Assignee:</span>
              <select
                className="form-select form-select-sm"
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
              >
                <option value="all">All Members</option>
                <option value="me">Assigned to Me</option>
                <option value="unassigned">Unassigned</option>
                {(project.members || []).map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Task count */}
          <div className="col-12 col-lg-2 text-end text-secondary small font-mono d-none d-lg-block">
            <strong>{filteredTasks.length}</strong> / <strong>{tasks.length}</strong> tasks
          </div>
        </div>
      </div>

      {/* Mobile Column Quick Switcher Tabs (Stitch Mobile Spec) */}
      <div className="d-flex d-md-none bg-white p-1 rounded-3 border mb-3 shadow-sm gap-1 overflow-x-auto">
        <button
          className={`btn btn-sm flex-fill py-1.5 px-2 rounded-2 text-nowrap ${
            activeMobileColumn === 'all'
              ? 'bg-primary text-white fw-bold shadow-sm'
              : 'text-secondary bg-transparent'
          }`}
          style={{ fontSize: '0.75rem' }}
          onClick={() => setActiveMobileColumn('all')}
        >
          All ({filteredTasks.length})
        </button>

        <button
          className={`btn btn-sm flex-fill py-1.5 px-2 rounded-2 text-nowrap ${
            activeMobileColumn === 'todo'
              ? 'bg-secondary text-white fw-bold shadow-sm'
              : 'text-secondary bg-transparent'
          }`}
          style={{ fontSize: '0.75rem' }}
          onClick={() => setActiveMobileColumn('todo')}
        >
          To Do ({todoTasks.length})
        </button>

        <button
          className={`btn btn-sm flex-fill py-1.5 px-2 rounded-2 text-nowrap ${
            activeMobileColumn === 'in_progress'
              ? 'bg-primary text-white fw-bold shadow-sm'
              : 'text-secondary bg-transparent'
          }`}
          style={{ fontSize: '0.75rem' }}
          onClick={() => setActiveMobileColumn('in_progress')}
        >
          In Progress ({inProgressTasks.length})
        </button>

        <button
          className={`btn btn-sm flex-fill py-1.5 px-2 rounded-2 text-nowrap ${
            activeMobileColumn === 'done'
              ? 'bg-success text-white fw-bold shadow-sm'
              : 'text-secondary bg-transparent'
          }`}
          style={{ fontSize: '0.75rem' }}
          onClick={() => setActiveMobileColumn('done')}
        >
          Done ({doneTasks.length})
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="kanban-board-container" ref={boardContainerRef}>
        {(activeMobileColumn === 'all' || activeMobileColumn === 'todo') && (
          <BoardColumn
            status="todo"
            title="To Do"
            tasks={todoTasks}
            onTaskClick={handleTaskClick}
            onOpenCreateTask={handleOpenCreateTask}
            onStatusChange={handleStatusChange}
            onDropTask={handleStatusChange}
          />
        )}

        {(activeMobileColumn === 'all' || activeMobileColumn === 'in_progress') && (
          <BoardColumn
            status="in_progress"
            title="In Progress"
            tasks={inProgressTasks}
            onTaskClick={handleTaskClick}
            onOpenCreateTask={handleOpenCreateTask}
            onStatusChange={handleStatusChange}
            onDropTask={handleStatusChange}
          />
        )}

        {(activeMobileColumn === 'all' || activeMobileColumn === 'done') && (
          <BoardColumn
            status="done"
            title="Done"
            tasks={doneTasks}
            onTaskClick={handleTaskClick}
            onOpenCreateTask={handleOpenCreateTask}
            onStatusChange={handleStatusChange}
            onDropTask={handleStatusChange}
          />
        )}
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <button
        type="button"
        className="mobile-fab-btn d-md-none"
        onClick={() => handleOpenCreateTask(activeMobileColumn === 'all' ? 'todo' : activeMobileColumn)}
        title="Add Task"
        aria-label="Add Task"
      >
        <Plus size={24} />
      </button>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        initialStatus={taskModalInitialStatus}
        projectId={projectId}
        projectMembers={project.members || []}
        projectOwnerId={project.owner_id}
        onTaskCreated={(newTask) => {
          setTasks((prev) => [newTask, ...prev]);
        }}
        onTaskUpdated={(updatedTask) => {
          setTasks((prev) =>
            prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
          );
        }}
        onTaskDeleted={(deletedTaskId) => {
          setTasks((prev) => prev.filter((t) => t.id !== deletedTaskId));
        }}
      />

      {/* Member Management Modal */}
      <MemberManagementModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        projectId={projectId}
        members={project.members || []}
        ownerId={project.owner_id}
        currentUserId={userId}
        isOwner={project.isOwner}
        onMemberChanged={() => {
          getProject(projectId).then(setProject).catch(console.warn);
        }}
      />
    </div>
  );
};

export default ProjectBoardPage;
