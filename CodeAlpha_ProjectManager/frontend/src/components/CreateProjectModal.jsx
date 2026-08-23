import React, { useState } from 'react';
import { createProject } from '../api/client';
import toast from 'react-hot-toast';
import { FolderPlus, X } from 'lucide-react';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    try {
      setLoading(true);
      const newProject = await createProject({
        name: name.trim(),
        description: description.trim(),
      });
      toast.success('Project created successfully!');
      setName('');
      setDescription('');
      onClose();
      if (onProjectCreated) {
        onProjectCreated(newProject);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light border-bottom px-4 py-3">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-3">
                <FolderPlus size={20} />
              </div>
              <h5 className="modal-title fw-bold mb-0">Create New Project</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">Project Name <span className="text-danger">*</span></label>
                <input
                  id="new-project-name-input"
                  name="projectName"
                  type="text"
                  className="form-control form-control-lg fs-6"
                  placeholder="e.g. Website Redesign, Mobile App v2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold">Description (Optional)</label>
                <textarea
                  id="new-project-desc-input"
                  name="projectDescription"
                  className="form-control"
                  rows="3"
                  placeholder="Briefly describe the goals, team scope, and deliverables..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer bg-light border-top px-4 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                id="new-project-submit-btn"
                type="submit"
                className="btn btn-primary-pm d-flex align-items-center gap-2"
                disabled={loading || !name.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Project</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
