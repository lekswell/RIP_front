// EventInfo.tsx
import React from 'react';
import logoImage from '../Images/logo.png';
import "./EventInfo.css"

interface EventInfoProps {
  name: string;
  startDate: string;
  endDate: string;
  image: string;
  imageURL: string;
  info: string;
}

const EventInfo: React.FC<EventInfoProps> = ({ name, startDate, endDate, image, imageURL, info }) => (
  <div className="card-table">
    <div className="card-cell">
      <h2>{name}</h2>
      <h2>
        {startDate} - {endDate}
      </h2>
      <img className="img-card" src={image !== 'http://localhost:9000/events/' ? imageURL : logoImage} alt={name} />
    </div>
    <div className="card-cell">
      <div>
        <h2>О мероприятии:</h2>
        <h4>{info}</h4>
      </div>
    </div>
  </div>
);

export default EventInfo;
