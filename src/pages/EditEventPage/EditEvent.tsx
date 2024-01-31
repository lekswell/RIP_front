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
import './EditEvent.css'

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
  { label: 'Редактирование', link: '' },
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

  const handleEditClick = async (eventId: number) => {
    // Получаем данные из строки таблицы
    const editedEvent = events.find((event) => event.Event_id === eventId);
  
    // Создаем форму данных
    const formData = new FormData();
  
    // Получаем input для изображения
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
  
    // Создаем асинхронную функцию для обработки выбора файла
    const selectedFile = await new Promise<File | null>((resolve) => {
      // Обработка выбора файла
      imageInput.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        resolve(file || null);
      });
  
      // Открываем диалоговое окно выбора файла
      imageInput.click();
    });
  
    // Если файл выбран, добавляем его в formData
    if (selectedFile) {
      formData.append('Image', selectedFile);
    }
  
    formData.append('Name', editedEvent?.Name || '');
    formData.append('Start_date', editedEvent?.Start_date || '');
    formData.append('End_date', editedEvent?.End_date || '');
    formData.append('Status', editedEvent?.Status || '');
    formData.append('Info', editedEvent?.Info || '');
  
    console.log(formData);
  
  
    // Отправляем данные на сервер для редактирования события
    axios.put(`http://localhost:8000/events/${eventId}/edit/`, formData, { withCredentials: true })
      .then(() => {
        // Обновляем список событий после редактирования
        fetchEvents();
      })
      .catch((error) => {
        console.error('Error editing event:', error);
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

  const handleInputChange = (eventId: number, field: string, value: string) => {
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((event) => {
        if (event.Event_id === eventId) {
          return { ...event, [field]: value };
        }
        return event;
      });
      return updatedEvents;
    });
  };

  return (
    <div>
      <Header />
      <Breadcrumbs items={breadcrumbsItems} />
      <Link to="/RIP_front/add_event">
        <button className="btn-custom">Создать новое событие</button>
      </Link>
      <div className='table-events'>
      <table>
        <thead>
          <tr>
            <th>ID</th>
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
            <td>{event.Event_id}</td>
            <td>
            <input
                type="text"
                className='event-input'
                value={event.Name}
                onChange={(e) => handleInputChange(event.Event_id, 'Name', e.target.value)}
            />
            </td>
            <td>
            <input
                type="text"
                className='event-input'
                value={event.Start_date}
                onChange={(e) => handleInputChange(event.Event_id, 'Start_date', e.target.value)}
            />
            </td>
            <td>
            <input
                type="text"
                className='event-input'
                value={event.End_date}
                onChange={(e) => handleInputChange(event.Event_id, 'End_date', e.target.value)}
            />
            </td>
            <td>
            <input
                type="text"
                className='event-input'
                value={event.Status}
                onChange={(e) => handleInputChange(event.Event_id, 'Status', e.target.value)}
            />
            </td>
            <td>
            <input
                type="text"
                className='event-input'
                value={event.Info}
                onChange={(e) => handleInputChange(event.Event_id, 'Info', e.target.value)}
            />
            </td>
            <td>
            <img className='img-add' src={event.ImageURL} alt={`Event ${event.Event_id}`} style={{ height:'100px' }} />
            </td> 
            <td>
            <Button className='btn-edit' onClick={() => handleEditClick(event.Event_id)}>Редактировать</Button>
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
