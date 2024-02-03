// EditEventsPage.tsx

import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Button/Button';
import { RootState } from '../../store/Store';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './TableEvents.css'

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

const breadcrumbsItems = [
  { label: 'Главная', link: '/RIP_front/events' },
  { label: 'Таблица мероприятий', link: '' },
];

const EditEventsPage: FC = () => {
  const navigateTo = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Проверяем авторизацию пользователя
    if (!auth.isAuthenticated || auth.role !== 'Admin') {
      // Если пользователь не авторизован или не администратор, перенаправляем его на другую страницу
      navigateTo('/login'); // Замените '/login' на путь к странице входа
    } else {
      // Получаем события при загрузке страницы
      fetchEvents();
    }
  }, [auth.isAuthenticated, auth.role, navigateTo]);

  const fetchEvents = () => {
    axios.get('http://localhost:8000/events/')
      .then((response) => {
        setEvents(response.data.events);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
        // Обработка ошибок
      });
  };
  
  const handleDeleteClick = (eventId: number) => {
    // Обработка нажатия кнопки удаления
    // Например, отправка запроса на удаление события
    axios.delete(`http://localhost:8000/events/${eventId}/delete/`, { withCredentials: true })
      .then(() => {
        // Обновляем список событий после удаления
        fetchEvents();
      })
      .catch((error) => {
        console.error('Error deleting event:', error);
        // Обработка ошибок
      });
  };

  return (
    <div>
      <Header />
      <Breadcrumbs items={breadcrumbsItems} />
      <Link to="/RIP_front/add_event">
        <button className="btn-custom">Добавить событие</button>
      </Link>
      <div className='table-events'>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Дата начала</th>
            <th>Дата окончания</th>
            <th>Статус</th>
            <th>Описание</th>
            <th>Изображение</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
        {events.map((event) => (
        <tr key={event.Event_id}>
            <td>{event.Name}</td>
            <td>{event.Start_date}</td>
            <td>{event.End_date}</td>
            <td>{event.Status}</td>
            <td>{event.Info}</td>
            <td> 
            <img className='img-add' src={event.ImageURL} alt={`Event ${event.Event_id}`} style={{ height:'100px' }} />
            </td> 
            <td>
            <Link to={`/RIP_front/events/${event.Event_id}/edit/`}>
              <button className="btn-edit">Редактировать</button>
            </Link>
            <Button className='btn-edit' onClick={() => handleDeleteClick(event.Event_id)}>Удалить</Button>
            </td>
        </tr>
        ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default EditEventsPage;
