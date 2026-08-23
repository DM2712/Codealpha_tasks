import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle2, ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';

const ProjectCard = ({ project, onDelete }) => {
  const { id, name, description, userRole, isOwner, memberCount = 1, taskStats } = project;
  const total = taskStats?.total || 0;
  const done = taskStats?.done || 0;
  const progress = taskStats?.progressPercentage || 0;

  return (
    <div className="card pm-card h-100 border-0">
      <div className="card-body p-4 d-flex flex-column">
        {/* Header with Title and Role */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title fw-bold text-dark mb-0 text-truncate" title={name}>
            {name}
          </h5>
          <span
            className={`badge rounded-pill px-2.5 py-1 text-capitalize ${
              isOwner ? 'bg-primary text-white' : 'bg-light text-primary border border-primary'
            }`}
            style={{ fontSize: '0.75rem' }}
          >
            {isOwner ? 'Owner' : userRole || 'Member'}
          </span>
        </div>

        {/* Description */}
        <p className="card-text text-muted small mb-4 flex-grow-1" style={{ minHeight: '40px', lineHeight: '1.5' }}>
          {description ? (
            description.length > 90 ? `${description.substring(0, 90)}...` : description
          ) : (
            <span className="fst-italic text-secondary">No description provided</span>
          )}
        </p>

        {/* Progress Section */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-muted small fw-semibold d-flex align-items-center gap-1">
              <CheckCircle2 size={14} className="text-success" />
              Tasks Completed
            </span>
            <span className="small fw-bold text-dark">
              {done}/{total} ({progress}%)
            </span>
          </div>
          <div className="progress" style={{ height: '6px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}>
            <div
              className={`progress-bar ${progress === 100 ? 'bg-success' : 'bg-primary'}`}
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        {/* Footer with Member Count & Actions */}
        <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
          <div className="d-flex align-items-center text-muted small">
            <Users size={16} className="me-1 text-secondary" />
            <span className="fw-semibold">{memberCount}</span>
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
                <Trash2 size={15} />
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
