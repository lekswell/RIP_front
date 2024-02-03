import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './AddEvent.css'

const AddEvents = () => {
  const navigateTo = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    Name: '',
    Start_date: '',
    End_date: '',
    Image: '',
    ImageURL: '',
    Status: 'S',
    Info: '',
  });

  useEffect(() => {
    if (id) {
      const fetchEventData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/events/${id}/`);
          const data = response.data;
          setFormData(data);
        } catch (error) {
          console.error('Error fetching event data:', error);
          // Обработка ошибок
        }
      };

      fetchEventData();
    }
  }, [id]);

  let breadcrumbsItems;
  if (window.location.pathname === "/RIP_front/add_event") {
    breadcrumbsItems = [
      { label: 'Главная', link: '/RIP_front/events' },
      { label: 'Таблица мероприятий', link: '/RIP_front/table_events' },
      { label: 'Новое событие', link: '' },
    ];  
  } else {
    breadcrumbsItems = [
      { label: 'Главная', link: '/RIP_front/events' },
      { label: 'Таблица мероприятий', link: '/RIP_front/table_events'},
      { label: 'Изменение события', link: '' },
    ];
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      Image: file,
      ImageURL: file ? URL.createObjectURL(file) : '', // Создаем временный URL для файла
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      Status: selectedStatus,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('Name', formData.Name);
    formDataToSend.append('Start_date', formData.Start_date);
    formDataToSend.append('End_date', formData.End_date);
  
    if (formData.Image) {
      // Проверяем, есть ли выбранный файл изображения
      formDataToSend.append('Image', formData.Image);
    }
  
    formDataToSend.append('Status', formData.Status);
    formDataToSend.append('Info', formData.Info);
  
    try {
      if (id) {
        await axios.put(`http://localhost:8000/events/${id}/edit/`, formDataToSend, {
          withCredentials: true,
        });
      } else {
        await axios.post('http://localhost:8000/events/add/', formDataToSend, {
          withCredentials: true,
        });
      }
  
      navigateTo('/RIP_front/table_events');
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };
  


  return (
    <div>
      <Header />
      <Breadcrumbs items={breadcrumbsItems} />
  
      <form className="event-form" onSubmit={handleSubmit}>
        <div className="columns">
          <div className="column">
            <h4>Название:</h4>
            <input
              type="text"
              id="name"
              className="registration-input"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              required
            />
            <h4>Изображение:</h4>
            <input
                type="file"
                id="image"
                className="btn-login"
                name="Image"
                accept="image/*"
                onChange={handleFileChange}
              />
          </div>
          <div className="column">
            <h4>Текущее изображение:</h4>
            {formData.ImageURL && (
            <div className="current-image">
              <img
                src={formData.ImageURL}
                alt="Current Event Image"
                style={{ maxHeight: '200px', margin: '0 30px' }}
              />
            </div>
          )}
          </div>
          <div className="column">
            <h4>Дата начала:</h4>
            <input
              type="date"
              id="start_date"
              className="registration-input"
              name="Start_date"
              value={formData.Start_date}
              onChange={handleInputChange}
              required
            />
            <h4>Статус:</h4>
            <select
              id="status"
              className="registration-input"
              name="Status"
              value={formData.Status}
              onChange={handleStatusChange}
            >
              <option value="S">Скоро</option>
              <option value="A">Доступно</option>
              <option value="C">Завершено</option>
            </select>
          </div>
          <div className="column">
            <h4>Дата завершения:</h4>
            <input
              type="date"
              id="end_date"
              className="registration-input"
              name="End_date"
              value={formData.End_date}
              onChange={handleInputChange}
              required
            />
            <h4>Информация:</h4>
            <textarea
              id="info"
              className="registration-input"
              name="Info"
              value={formData.Info}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </form>
      <button className="edit-btn" type="submit" onClick={handleSubmit}>
        {id ? 'Редактировать' : 'Добавить'}
      </button>
    </div>
  );
  

};

export default AddEvents;
