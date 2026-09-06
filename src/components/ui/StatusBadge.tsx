'use client';

import React from 'react';
import { STATUS_COLORS, STATUS_LABELS } from '@constants/index';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const label = STATUS_LABELS[status] || status;
  const colors = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${colors}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
