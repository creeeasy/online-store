import React from 'react';
import { InquiryUtils } from '../utils/orderInquiryAPI';
InquiryUtils

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClass = InquiryUtils.getStatusColor(status);
  const statusIcon = InquiryUtils.getStatusIcon(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
      {statusIcon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;