// ReservationDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './Reserve.css';

const breadcrumbsItems = [
  { label: 'Главная', link: '/RIP_front/events' },
  { label: 'Мои заявки', link: '/RIP_front/reserves' },
  { label: 'Подробнее', link: '' },
];

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Europe/Moscow',
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

const ReservationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<any | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/reserves/${id}/`, {
          withCredentials: true,
        });
        setReservation(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке заявки:', error);
      }
    };

    fetchReservation();
  }, [id]);

  return (
    <div>
      <Header />
      <Breadcrumbs items={breadcrumbsItems} className="breadcrumbs-container" />
  
      {reservation ? (
        <div className="reservation-details-container">
          <div className="general-info">
            <h2>Детали заявки</h2>
            <h3>Номер заявки: {reservation.reservation.Reserve_id}</h3>
            <h3>Дата создания: {formatDate(reservation.reservation.Creation_date)}</h3>
            <h3>Дата формирования: {formatDate(reservation.reservation.Formation_date)}</h3>
            <h3>Дата завершения: {formatDate(reservation.reservation.Completion_date)}</h3>
            <h3>
                Статус: {reservation.reservation.Status === 'iP' && 'В работе'}
                        {reservation.reservation.Status === 'Ca' && 'Отменена'}
                        {reservation.reservation.Status === 'C' && 'Завершена'}
            </h3>
          </div>
  
          <div className="event-info">
            <h2>Данные о мероприятиях:</h2>
            {reservation.reservation_data.map((eventData: any, index: number) => (
              <div key={index} className="event-data">
                <h3>
                  Название события:
                  <Link to={`/RIP_front/events/${eventData.event_reservation.Event_id}`}>
                    {eventData.event.Name}
                  </Link>
                </h3>
                <h3>Название группы: {eventData.event_reservation.Group_info}</h3>
                <h3>Количество человек: {eventData.event_reservation.Group_size}</h3>
                <h3>Дата: {eventData.event_reservation.Date}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Загрузка деталей заявки...</p>
      )}
    </div>
  );
};

export default ReservationDetailsPage;
