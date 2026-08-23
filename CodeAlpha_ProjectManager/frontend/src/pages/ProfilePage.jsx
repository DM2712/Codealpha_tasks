import React, { useState, useEffect } from 'react';
import { useAppAuth } from '../context/AuthContext';
import { getProjects } from '../api/client';
import { User, Mail, Shield, FolderKanban, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { UserProfile } from '@clerk/clerk-react';

const ProfilePage = () => {
  const { userName, userEmail, userAvatar, userId } = useAppAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data || []))
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, []);

  const ownedProjects = projects.filter((p) => p.isOwner);
  const memberProjects = projects.filter((p) => !p.isOwner);

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div className="pm-card p-4 bg-white text-center">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="rounded-circle shadow-sm mb-3 border border-3 border-primary-subtle"
                style={{ width: '96px', height: '96px', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center shadow-sm mb-3"
                style={{ width: '96px', height: '96px', fontSize: '2rem', fontWeight: 'bold' }}
              >
                {userName ? userName[0].toUpperCase() : 'U'}
              </div>
            )}

            <h4 className="fw-bold text-dark mb-1">{userName}</h4>
            <p className="text-muted small mb-3">{userEmail}</p>

            <div className="d-flex justify-content-center gap-2 mb-4">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 rounded-pill">
                Active Member
              </span>
            </div>

            <div className="border-top pt-3 text-start small text-muted">
              <div className="d-flex justify-content-between mb-2">
                <span className="d-flex align-items-center gap-1.5">
                  <FolderKanban size={14} className="text-secondary" />
                  Projects Owned:
                </span>
                <span className="fw-bold text-dark">{ownedProjects.length}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="d-flex align-items-center gap-1.5">
                  <Shield size={14} className="text-secondary" />
                  Shared Projects:
                </span>
                <span className="fw-bold text-dark">{memberProjects.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details & Clerk Management */}
        <div className="col-lg-8">
          <div className="pm-card p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark mb-3">Your Projects Overview</h5>

            {loading ? (
              <div className="text-center py-3 text-muted small">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                You haven't joined any projects yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>Project Name</th>
                      <th>Role</th>
                      <th>Tasks Progress</th>
                      <th>Members</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {projects.map((proj) => (
                      <tr key={proj.id}>
                        <td className="fw-bold">{proj.name}</td>
                        <td>
                          <span
                            className={`badge ${
                              proj.isOwner ? 'bg-primary' : 'bg-secondary'
                            } text-capitalize`}
                          >
                            {proj.isOwner ? 'Owner' : proj.userRole}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{ height: '6px', width: '80px' }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${proj.taskStats?.progressPercentage || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {proj.taskStats?.done || 0}/{proj.taskStats?.total || 0}
                            </span>
                          </div>
                        </td>
                        <td className="text-muted">{proj.memberCount || 1} members</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Clerk Profile Management Component */}
          <div className="pm-card p-3 bg-white">
            <h5 className="fw-bold text-dark mb-3 px-2">Manage Account Security</h5>
            <div className="d-flex justify-content-center">
              <UserProfile routing="hash" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
