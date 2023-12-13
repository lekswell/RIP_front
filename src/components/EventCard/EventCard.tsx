// EventCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../Images/logo.png';
import "./EventCard.css"

interface EventCardProps {
  eventId: number;
  name: string;
  startDate: string;
  endDate: string;
  image: string;
  status: string;
  imageURL: string;
}

const EventCard: React.FC<EventCardProps> = ({ eventId, name, startDate, endDate, image, status, imageURL }) => (
  <li>
    <h2>{name}</h2>
    <Link to={`/RIP_front/events/${eventId}`}>
      <img src={image !== 'http://localhost:9000/events/' ? imageURL : logoImage} alt={name} />
    </Link>
    <h5>
      {getStatusText(status)}: {startDate} - {endDate}
    </h5>
  </li>
);

// Функция для получения человекочитаемого статуса
const getStatusText = (status: string): string => {
  switch (status) {
    case 'A':
      return 'Доступно';
    case 'C':
      return 'Завершено';
    case 'S':
      return 'Скоро';
    default:
      return '';
  }
};

export default EventCard;
