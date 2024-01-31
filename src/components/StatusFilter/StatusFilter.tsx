// components/StatusFilter/StatusFilter.tsx
import React from 'react';
import "./StatusFilter.css"

interface StatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatus, onStatusChange }) => {
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value;
    onStatusChange(status);
  };

  return (
    <select value={selectedStatus} onChange={handleStatusChange}>
      <option value="">Все</option>
      <option value="A">Доступно</option>
      <option value="C">Завершено</option>
      <option value="S">Скоро</option>
    </select>
  );
};

export default StatusFilter;
