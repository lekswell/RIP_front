// EventPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import './Events.css'; // Assuming you have a CSS file for styling
import './Event.css'
import logoImage from './logo.png';

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Accessing the Event_id from the URL
  const [eventData, setEventData] = useState({
    Name: '',
    Start_date: '',
    End_date: '',
    Image: '',
    ImageURL: '',
    Status: '',
    Info: '',
  });

  const breadcrumbsItems = [
    { label: 'Актуальные мероприятия', link: '/events' },
    { label: 'Подробнее: ' + eventData.Name , link: '' },
  ];

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/events/${id}`);
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventData();

    return () => {
      // Cleanup code (if needed)
    };
  }, [id]);

  return (
    <div className="container">
      <header>
        <a href="/events">
          <img className='logo' src="http://localhost:9000/events/logo-bmstu.png" />
        </a>
        <h2>Музей МГТУ им. Н.Э.Баумана</h2>
        <a href="/events" className="btn-custom">Вернуться к мероприятиям</a>
        <a href="{% url 'personal_account_url' %}" className="btn-custom">Личный кабинет</a>
      </header>
      {
        <div className="row">
          <Breadcrumbs items={breadcrumbsItems} />
          <div className="col">
            <div className="card-table">
              <div className="card-cell">
                <h2>{eventData.Name}</h2>
                <h2>
                  {eventData.Start_date} - {eventData.End_date}
                </h2>
                <img
                  className="img-card"
                  src={eventData.Image !== 'http://localhost:9000/events/' ? eventData.ImageURL: logoImage}
                  alt={eventData.Name}
                />
              </div>
              <div className="card-cell">
                <div>
                  <h2>О мероприятии:</h2>
                  <h4>{eventData.Info}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default EventPage;
