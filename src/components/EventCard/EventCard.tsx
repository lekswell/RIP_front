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
  imageURL: string;
}

const EventCard: React.FC<EventCardProps> = ({ eventId, name, startDate, endDate, image, imageURL }) => (
  <li>
    <h2>{name}</h2>
    <Link to={`/RIP_front/events/${eventId}`}>
      <img src={image !== 'http://localhost:9000/events/' ? imageURL : logoImage} alt={name} />
    </Link>
    <h5>
      {startDate} - {endDate}
    </h5>
  </li>
);

export default EventCard;
