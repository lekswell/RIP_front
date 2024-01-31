import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import EventInfo from '../../components/EventInfo/EventInfo';
import Header from '../../components/Header/Header';
import "./Event.css"
import logoImage from '/home/student/pythonProjects/front/src/components/Images/logo.png';
import axios from 'axios';

// Mock event data
const mockEventData = {
  Event_id: 1,
  Name: 'Мероприятие',
  Start_date: '2023-09-01',
  End_date: '2024-01-20',
  Image: 'image1',
  ImageURL: logoImage,
  Status: 'A',
  Info: 'Крутое мероприятие в музее МГТУ',
};

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [eventData, setEventData] = useState(mockEventData);

  const breadcrumbsItems = [
    { label: 'Мероприятия', link: '/RIP_front/events' },
    { label: `Подробнее: ${eventData.Name}`, link: '' },
  ];

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Изменение на axios
        const response = await axios.get(`http://localhost:8000/events/${id}/`);
        const data = response.data;
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
        setEventData(mockEventData);
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
