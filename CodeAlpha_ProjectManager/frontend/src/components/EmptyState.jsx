import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'Get started by creating a new item.',
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-5 px-3 pm-card-static my-3 bg-white">
      <div className="d-inline-flex p-3 rounded-circle bg-light text-primary mb-3">
        <Icon size={36} />
      </div>
      <h5 className="fw-bold mb-2">{title}</h5>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '420px', fontSize: '0.95rem' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary-pm btn-sm px-3 py-2">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
