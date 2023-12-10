// pages/Event.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import EventInfo from '../../components/EventInfo/EventInfo';
import Header from '../../components/Header/Header';
import "./Event.css"
//import logoImage from '../logo.png';

interface Event {
  Event_id: number;
  Name: string;
  Start_date: string;
  End_date: string;
  Image: string;
  ImageURL: string;
  Status: string;
  Info: string;
}

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [eventData, setEventData] = useState<Event>({
    Event_id: 0,
    Name: '',
    Start_date: '',
    End_date: '',
    Image: '',
    ImageURL: '',
    Status: '',
    Info: '',
  });

  const breadcrumbsItems = [
    { label: 'Актуальные мероприятия', link: '/RIP_front/events' },
    { label: `Подробнее: ${eventData.Name}`, link: '' },
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
      <Header />
      <Breadcrumbs items={breadcrumbsItems} />
      <div className="row">
        <EventInfo
          name={eventData.Name}
          startDate={eventData.Start_date}
          endDate={eventData.End_date}
          image={eventData.Image}
          imageURL={eventData.ImageURL}
          info={eventData.Info}
        />
      </div>
    </div>
  );
};

export default EventPage;
