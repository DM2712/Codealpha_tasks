import React, { useState, useEffect } from 'react';
import { getProjects, deleteProject } from '../api/client';
import { useAppAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import {
  FolderKanban,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';

const DashboardPage = ({ isCreateModalOpen, setIsCreateModalOpen }) => {
  const { userName } = useAppAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // all, owned, member

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`Are you sure you want to delete "${projectName}"? This will permanently delete all associated tasks, comments, and member assignments.`)) {
      return;
    }

    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success(`Project "${projectName}" deleted`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterRole === 'owned') return project.isOwner;
    if (filterRole === 'member') return !project.isOwner;
    return true;
  });

  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, p) => acc + (p.taskStats?.total || 0), 0);
  const totalDoneTasks = projects.reduce((acc, p) => acc + (p.taskStats?.done || 0), 0);
  const totalInProgressTasks = projects.reduce((acc, p) => acc + (p.taskStats?.inProgress || 0), 0);

  return (
    <div className="container-fluid px-3 px-md-5 py-4 max-w-[1440px] pb-5">
      {/* Header Section from Stitch Design */}
      <header className="mb-4 pb-2 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--on-surface)', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>
            Good day, {userName} 👋
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
            Here's what's happening with your projects and tasks today.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5 px-3 py-2 bg-white"
            style={{ borderRadius: '8px', fontSize: '0.85rem' }}
            onClick={() => {
              // Quick toggle role filter
              setFilterRole((prev) => (prev === 'all' ? 'owned' : prev === 'owned' ? 'member' : 'all'));
            }}
          >
            <Filter size={15} />
            <span>Filter ({filterRole === 'all' ? 'All' : filterRole === 'owned' ? 'Owned' : 'Shared'})</span>
          </button>

          <button
            className="btn btn-primary-pm d-flex align-items-center gap-1.5 px-3 py-2 shadow-sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>
      </header>

      {/* Stats Grid (Stitch Dashboard KPI Cards) */}
      <div className="row g-2 g-sm-3 mb-4">
        {/* Stat 1 */}
        <div className="col-6 col-lg-3">
          <div className="pm-card-static p-2.5 p-sm-3 bg-white d-flex align-items-center gap-2.5 gap-sm-3 h-100">
            <div className="p-2 p-sm-2.5 rounded-3 bg-primary-subtle text-primary shrink-0">
              <FolderKanban size={20} />
            </div>
            <div className="min-w-0">
              <div className="text-secondary small fw-medium text-truncate" style={{ fontSize: '0.75rem' }}>Active Projects</div>
              <h4 className="fw-bold mb-0 font-mono text-dark" style={{ fontSize: '1.25rem' }}>{totalProjects}</h4>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="col-6 col-lg-3">
          <div className="pm-card-static p-2.5 p-sm-3 bg-white d-flex align-items-center gap-2.5 gap-sm-3 h-100">
            <div className="p-2 p-sm-2.5 rounded-3 bg-warning-subtle text-warning-emphasis shrink-0">
              <Clock size={20} />
            </div>
            <div className="min-w-0">
              <div className="text-secondary small fw-medium text-truncate" style={{ fontSize: '0.75rem' }}>In Progress</div>
              <h4 className="fw-bold mb-0 font-mono text-dark" style={{ fontSize: '1.25rem' }}>{totalInProgressTasks}</h4>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="col-6 col-lg-3">
          <div className="pm-card-static p-2.5 p-sm-3 bg-white d-flex align-items-center gap-2.5 gap-sm-3 h-100">
            <div className="p-2 p-sm-2.5 rounded-3 bg-success-subtle text-success shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div className="min-w-0">
              <div className="text-secondary small fw-medium text-truncate" style={{ fontSize: '0.75rem' }}>Completed</div>
              <h4 className="fw-bold mb-0 font-mono text-dark" style={{ fontSize: '1.25rem' }}>{totalDoneTasks}</h4>
            </div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="col-6 col-lg-3">
          <div className="pm-card-static p-2.5 p-sm-3 bg-white d-flex align-items-center gap-2.5 gap-sm-3 h-100">
            <div className="p-2 p-sm-2.5 rounded-3 bg-info-subtle text-info-emphasis shrink-0">
              <Layers size={20} />
            </div>
            <div className="min-w-0">
              <div className="text-secondary small fw-medium text-truncate" style={{ fontSize: '0.75rem' }}>Total Tasks</div>
              <h4 className="fw-bold mb-0 font-mono text-dark" style={{ fontSize: '1.25rem' }}>{totalTasks}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="pm-card-static p-3 bg-white mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6 col-lg-7">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-end-0 text-secondary">
                <Search size={15} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-5 d-flex gap-1 justify-content-md-end overflow-x-auto">
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn btn-sm ${filterRole === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ borderRadius: '8px 0 0 8px', fontSize: '0.78rem' }}
                onClick={() => setFilterRole('all')}
              >
                All ({projects.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${filterRole === 'owned' ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ fontSize: '0.78rem' }}
                onClick={() => setFilterRole('owned')}
              >
                Owned
              </button>
              <button
                type="button"
                className={`btn btn-sm ${filterRole === 'member' ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ borderRadius: '0 8px 8px 0', fontSize: '0.78rem' }}
                onClick={() => setFilterRole('member')}
              >
                Shared
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid Content */}
      {loading ? (
        <LoadingSpinner text="Loading workspace projects..." />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={searchQuery ? 'No matching projects found' : 'No projects created yet'}
          description={
            searchQuery
              ? `No projects matched "${searchQuery}". Try clearing search.`
              : 'Create your first project board to start organizing agile sprints and collaborating.'
          }
          actionLabel="Create Project"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="row g-3 g-md-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="col-12 col-md-6 col-lg-4">
              <ProjectCard project={project} onDelete={handleDeleteProject} />
            </div>
          ))}
        </div>
      )}

      {/* Mobile Floating Action Button */}
      <button
        type="button"
        className="mobile-fab-btn d-md-none"
        onClick={() => setIsCreateModalOpen(true)}
        title="Create New Project"
        aria-label="Create New Project"
      >
        <Plus size={24} />
      </button>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={(newProj) => {
          setProjects((prev) => [newProj, ...prev]);
        }}
      />
    </div>
  );
};

export default DashboardPage;
