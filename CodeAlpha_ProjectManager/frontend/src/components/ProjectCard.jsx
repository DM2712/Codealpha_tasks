import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle2, ArrowRight, Trash2, Clock, PlayCircle } from 'lucide-react';

const ProjectCard = ({ project, onDelete }) => {
  const { id, name, description, userRole, isOwner, memberCount = 1, taskStats, task_stats } = project;
  const stats = taskStats || task_stats || {};
  const total = stats.total ?? project.totalTasks ?? 0;
  const done = stats.done ?? project.doneTasks ?? 0;
  const inProgress = stats.inProgress ?? stats.in_progress ?? 0;
  const progress = total > 0 ? Math.round((done / total) * 100) : (stats.progressPercentage ?? stats.progress_percentage ?? 0);

  const getStatusBadge = () => {
    if (total > 0 && progress === 100) {
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1 px-2 py-0.5 rounded-pill" style={{ fontSize: '0.72rem' }}>
          <CheckCircle2 size={11} />
          <span>100% Done</span>
        </span>
      );
    }
    if (progress > 0 || inProgress > 0) {
      return (
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle d-inline-flex align-items-center gap-1 px-2 py-0.5 rounded-pill" style={{ fontSize: '0.72rem' }}>
          <Clock size={11} />
          <span>{progress}% Active</span>
        </span>
      );
    }
    return (
      <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle d-inline-flex align-items-center gap-1 px-2 py-0.5 rounded-pill" style={{ fontSize: '0.72rem' }}>
        <PlayCircle size={11} />
        <span>0% Ready</span>
      </span>
    );
  };

  return (
    <div className="card pm-card h-100 border-0 shadow-sm">
      <div className="card-body p-3.5 p-sm-4 d-flex flex-column">
        {/* Header with Title and Badges */}
        <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
          <h5 className="card-title fw-bold text-dark mb-0 text-truncate" title={name} style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>
            {name}
          </h5>
          <div className="d-flex align-items-center gap-1.5 flex-shrink-0">
            {getStatusBadge()}
            <span
              className={`badge rounded-pill px-2.5 py-1 text-capitalize ${
                isOwner ? 'bg-primary text-white' : 'bg-light text-primary border border-primary'
              }`}
              style={{ fontSize: '0.72rem' }}
            >
              {isOwner ? 'Owner' : userRole || 'Member'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="card-text text-muted small mb-3 flex-grow-1" style={{ minHeight: '34px', lineHeight: '1.45' }}>
          {description ? (
            description.length > 85 ? `${description.substring(0, 85)}...` : description
          ) : (
            <span className="fst-italic text-secondary">No description provided</span>
          )}
        </p>

        {/* Enhanced Progress Section with Clear Percentage Bar */}
        <div className="p-2.5 rounded-3 bg-light border border-outline-variant mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1.5">
            <span className="small fw-semibold text-secondary d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem' }}>
              <CheckCircle2 size={13} className={progress === 100 ? 'text-success' : 'text-primary'} />
              <span>Completion Rate</span>
            </span>
            <span className="small font-mono fw-bold text-dark" style={{ fontSize: '0.78rem' }}>
              {done}/{total} tasks ({progress}%)
            </span>
          </div>
          <div className="progress" style={{ height: '7px', borderRadius: '5px', backgroundColor: '#e2e8f0' }}>
            <div
              className={`progress-bar progress-bar-striped ${
                progress === 100 ? 'bg-success' : 'bg-primary'
              }`}
              role="progressbar"
              style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        {/* Footer with Member Count & Actions */}
        <div className="d-flex justify-content-between align-items-center pt-2.5 border-top mt-auto">
          <div className="d-flex align-items-center text-muted small">
            <Users size={15} className="me-1 text-secondary" />
            <span className="fw-semibold font-mono">{memberCount}</span>
            <span className="ms-1">{memberCount === 1 ? 'member' : 'members'}</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            {isOwner && onDelete && (
              <button
                className="btn btn-outline-danger btn-sm p-1.5 rounded-3"
                title="Delete Project"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(id, name);
                }}
              >
                <Trash2 size={14} />
              </button>
            )}

            <Link
              to={`/projects/${id}`}
              className="btn btn-primary-pm btn-sm d-flex align-items-center gap-1 py-1.5 px-3"
            >
              <span>Board</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
