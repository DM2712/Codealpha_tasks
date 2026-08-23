import React, { useState } from 'react';
import { addProjectMember, removeProjectMember } from '../api/client';
import toast from 'react-hot-toast';
import { Users, UserPlus, Trash2, Shield, UserCheck, Mail } from 'lucide-react';

const MemberManagementModal = ({
  isOpen,
  onClose,
  projectId,
  members = [],
  ownerId,
  currentUserId,
  isOwner,
  onMemberChanged,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  if (!isOpen) return null;

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter the user email');
      return;
    }

    try {
      setLoading(true);
      const newMember = await addProjectMember(projectId, {
        email: email.trim(),
        role,
      });
      toast.success(`Added ${newMember.name || email} to the project!`);
      setEmail('');
      setRole('member');
      if (onMemberChanged) onMemberChanged();
    } catch (err) {
      toast.error(err.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (targetUserId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this project?`)) return;

    try {
      setRemovingId(targetUserId);
      await removeProjectMember(projectId, targetUserId);
      toast.success(`${memberName} has been removed`);
      if (onMemberChanged) onMemberChanged();
    } catch (err) {
      toast.error(err.message || 'Failed to remove member');
    } finally {
      setRemovingId(null);
    }
  };

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
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-light border-bottom px-4 py-3">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-3">
                <Users size={20} />
              </div>
              <h5 className="modal-title fw-bold mb-0">Manage Team & Members</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            {/* Add Member Section (Visible to Owner & Admin) */}
            {isOwner && (
              <div className="p-3 bg-light rounded-3 mb-4 border">
                <h6 className="fw-bold d-flex align-items-center gap-1.5 mb-3 text-dark">
                  <UserPlus size={16} className="text-primary" />
                  <span>Invite New Member</span>
                </h6>
                <form onSubmit={handleAddMember}>
                  <div className="row g-2">
                    <div className="col-7">
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-white">
                          <Mail size={14} className="text-muted" />
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="User email address..."
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="col-3">
                      <select
                        className="form-select form-select-sm"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={loading}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="col-2">
                      <button
                        type="submit"
                        className="btn btn-primary-pm btn-sm w-100 py-1"
                        disabled={loading || !email.trim()}
                      >
                        {loading ? '...' : 'Add'}
                      </button>
                    </div>
                  </div>
                  <small className="text-muted mt-2 d-block" style={{ fontSize: '0.72rem' }}>
                    Note: Users must have registered or logged into the platform at least once to be invited.
                  </small>
                </form>
              </div>
            )}

            {/* Current Members List */}
            <div>
              <h6 className="fw-bold mb-3 text-dark d-flex justify-content-between align-items-center">
                <span>Project Members</span>
                <span className="badge bg-secondary rounded-pill">{members.length}</span>
              </h6>

              <div className="d-flex flex-column gap-2" style={{ maxHeight: '260px', overflowY: 'auto' }}>
                {members.map((member) => {
                  const isMemberOwner = member.userId === ownerId;
                  const isCurrent = member.userId === currentUserId;
                  const canRemove = (isOwner || isCurrent) && !isMemberOwner;

                  return (
                    <div
                      key={member.id || member.userId}
                      className="d-flex justify-content-between align-items-center p-2.5 rounded-3 border bg-white"
                    >
                      <div className="d-flex align-items-center gap-2.5">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} alt={member.name} className="user-avatar-sm" />
                        ) : (
                          <div className="user-avatar-initials">{getInitials(member.name)}</div>
                        )}
                        <div>
                          <div className="fw-bold small text-dark lh-sm">
                            {member.name} {isCurrent && <span className="text-muted fw-normal">(You)</span>}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {member.email}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <span
                          className={`badge rounded-pill text-capitalize px-2 py-0.5 ${
                            isMemberOwner
                              ? 'bg-primary-subtle text-primary border border-primary-subtle'
                              : 'bg-light text-secondary border'
                          }`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {isMemberOwner ? 'Owner' : member.role || 'Member'}
                        </span>

                        {canRemove && (
                          <button
                            className="btn btn-outline-danger btn-sm p-1 rounded-2 border-0"
                            title={isCurrent ? 'Leave Project' : 'Remove Member'}
                            onClick={() => handleRemoveMember(member.userId, member.name)}
                            disabled={removingId === member.userId}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light border-top px-4 py-3">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagementModal;
