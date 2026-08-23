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
    <div className="container-fluid px-3 px-md-5 py-4 max-w-[1440px]">
      {/* Header Section from Stitch Design */}
      <header className="mb-4 pb-2 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--on-surface)' }}>
            Good day, {userName} 👋
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: '0.95rem' }}>
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
      <div className="row g-3 mb-4">
        {/* Stat 1 */}
        <div className="col-sm-6 col-lg-3">
          <div className="pm-card-static p-3 bg-white d-flex align-items-center gap-3">
            <div className="p-2.5 rounded-3 bg-primary-subtle text-primary">
              <FolderKanban size={22} />
            </div>
            <div>
              <div className="text-secondary small fw-medium">Active Projects</div>
              <h4 className="fw-bold mb-0 font-mono text-dark">{totalProjects}</h4>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="col-sm-6 col-lg-3">
          <div className="pm-card-static p-3 bg-white d-flex align-items-center gap-3">
            <div className="p-2.5 rounded-3 bg-warning-subtle text-warning-emphasis">
              <Clock size={22} />
            </div>
            <div>
              <div className="text-secondary small fw-medium">In Progress Tasks</div>
              <h4 className="fw-bold mb-0 font-mono text-dark">{totalInProgressTasks}</h4>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="col-sm-6 col-lg-3">
          <div className="pm-card-static p-3 bg-white d-flex align-items-center gap-3">
            <div className="p-2.5 rounded-3 bg-success-subtle text-success">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="text-secondary small fw-medium">Completed Tasks</div>
              <h4 className="fw-bold mb-0 font-mono text-dark">{totalDoneTasks}</h4>
            </div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="col-sm-6 col-lg-3">
          <div className="pm-card-static p-3 bg-white d-flex align-items-center gap-3">
            <div className="p-2.5 rounded-3 bg-info-subtle text-info-emphasis">
              <Layers size={22} />
            </div>
            <div>
              <div className="text-secondary small fw-medium">Total Task Items</div>
              <h4 className="fw-bold mb-0 font-mono text-dark">{totalTasks}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="pm-card-static p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6 col-lg-7">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search projects by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 col-lg-5 d-flex gap-2 justify-content-md-end">
            <div className="btn-group w-100 w-md-auto" role="group">
              <button
                type="button"
                className={`btn btn-sm ${filterRole === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ borderRadius: '8px 0 0 8px', fontSize: '0.82rem' }}
                onClick={() => setFilterRole('all')}
              >
                All ({projects.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${filterRole === 'owned' ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ fontSize: '0.82rem' }}
                onClick={() => setFilterRole('owned')}
              >
                Owned by Me
              </button>
              <button
                type="button"
                className={`btn btn-sm ${filterRole === 'member' ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ borderRadius: '0 8px 8px 0', fontSize: '0.82rem' }}
                onClick={() => setFilterRole('member')}
              >
                Shared with Me
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
              ? 'Try adjusting your search terms or filters.'
              : 'Create a new project workspace to start organizing boards, assigning tasks, and collaborating.'
          }
          actionText={!searchQuery ? 'Create New Project' : undefined}
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredProjects.map((project) => (
            <div className="col" key={project.id}>
              <ProjectCard project={project} onDelete={handleDeleteProject} />
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={(newProj) => {
          setProjects((prev) => [newProj, ...prev]);
          fetchProjects();
        }}
      />
    </div>
  );
};

export default DashboardPage;
