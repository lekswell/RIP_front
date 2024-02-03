import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../Images/logo.png';
import "./EventCard.css";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/Store';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setDraft } from '../../store/slices/AuthSlice'; 

interface EventCardProps {
  eventId: number;
  name: string;
  startDate: string;
  endDate: string;
  image: string;
  status: string;
  imageURL: string;
}


const EventCard: React.FC<EventCardProps> = ({ eventId, name, startDate, endDate, image, status, imageURL }) => {
  const dispatch = useDispatch(); // Get the dispatch function
  const role = useSelector((state: RootState) => state.auth.role);

  const handleAddClick = (eventId: number) => {
    // Подготавливаем данные для запроса
    const requestData = {
      Group_info: '', // или оставьте undefined
      Group_size: 0, // или оставьте undefined
      Date: '2023-02-05',       // или оставьте undefined
    };
    // Отправляем POST-запрос на сервер
    axios.post(`http://localhost:8000/events/${eventId}/add/`, requestData, { withCredentials: true })
      .then(response => {
        // Обработка успешного ответа
        console.log('Успешно добавлено в заявку:', response.data);

        // Dispatch the action to update hasDraft to true
        dispatch(setDraft('True'));
      })
      .catch(error => {
        // Обработка ошибок
        console.error('Ошибка при добавлении в заявку:', error);
      });
  };

  return (
    <li className="event-card">
      <h2>{name}</h2>
      <Link to={`/RIP_front/events/${eventId}`}>
        <img src={image !== 'http://localhost:9000/events/' ? imageURL : logoImage} alt={name} />
      </Link>
      <h5>
      {getStatusText(status)}: {new Date(startDate).toLocaleDateString('ru-RU')} - {new Date(endDate).toLocaleDateString('ru-RU')}
      </h5>
      {role === 'User' && (
        <div className="admin-controls">
          <button className='btn-custom' onClick={() =>{handleAddClick(eventId) }}>Посетить мероприятие</button>
        </div>
      )}
    </li>
  );
};

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
