// ReservationDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs'; 
import './Reserve.css';

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
  const navigateTo = useNavigate();
  const [reservation, setReservation] = useState<any | null>(null);
  const [editFormMap, setEditFormMap] = useState<{ [eventId: number]: any }>({});

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const draftId = localStorage.getItem('draftId');
        const response = await axios.get(`http://localhost:8000/reserves/${id}/`, {
          withCredentials: true,
        });
        setReservation(response.data);
        initializeFormMap(response.data.reservation_data);
  
        if (id === draftId) {
          // Добавил условие для управления отображением элементов управления
          console.log('Current reservation status:', response.data.reservation.Status);
        }
      } catch (error) {
        console.error('Ошибка при загрузке заявки:', error);
      }
    };
  
    fetchReservation();
  }, [id]);


  const draftId = localStorage.getItem('draftId');
  const isDraft = id === draftId;

  let breadcrumbsItems;
  if (isDraft) {
    breadcrumbsItems = [
      { label: 'Главная', link: '/RIP_front/events' },
      { label: 'Оформление', link: '' },
    ];
  } else {
    breadcrumbsItems = [
      { label: 'Главная', link: '/RIP_front/events' },
      { label: 'Мои заявки', link: '/RIP_front/reserves' },
      { label: 'Подробнее', link: '' },
    ];
  }

  const initializeFormMap = (reservationData: any[]) => {
    const formMap: { [eventId: number]: any } = {};
    reservationData.forEach((reservationItem) => {
      formMap[reservationItem.event_reservation.Event_id] = {
        Group_info: reservationItem.event_reservation.Group_info || '',
        Group_size: reservationItem.event_reservation.Group_size || '',
        Date: reservationItem.event_reservation.Date || '',
      };
    });
    setEditFormMap(formMap);
  };

  const handleInputChange = (eventId: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormMap((prevFormMap) => ({
      ...prevFormMap,
      [eventId]: {
        ...prevFormMap[eventId],
        [name]: value,
      },
    }));
  };

  const handleEdit = (eventId: number) => {
    const editedFormData = editFormMap[eventId];

    // Отправка данных на сервер для изменения
    axios.put(`http://localhost:8000/reserve/${eventId}/${draftId}/edit/`, editedFormData, { withCredentials: true })
      .then(() => {
        console.log(`Successfully edited event with ID ${eventId}`);
        fetchCartData();
      })
      .catch((error) => {
        console.error(`Error editing event with ID ${eventId}:`, error);
      });
  };

  const handleDelete = (eventId: number) => {
    // Отправка запроса на сервер для удаления
    axios.delete(`http://localhost:8000/reserve/${eventId}/${draftId}/delete/`, { withCredentials: true })
      .then(() => {
        console.log(`Successfully deleted event with ID ${eventId}`);
        fetchCartData();
      })
      .catch((error) => {
        console.error(`Error deleting event with ID ${eventId}:`, error);
      });
  };

  const fetchCartData = () => {
    // Получение draftId из localStorage
    const draftId = localStorage.getItem('draftId');
  
    // Проверка наличия draftId перед отправкой запроса
    if (draftId) {
      axios.get(`http://localhost:8000/reserves/${draftId}/`, { withCredentials: true })
        .then((response) => {
          const cartStatus = response.data.reservation.Status;
          console.log(cartStatus);
  
          // Если статус не равен 'M', удалите setDraft и draftId из localStorage
          if (cartStatus !== 'M') {
            localStorage.removeItem('setDraft');
            localStorage.removeItem('draftId');
            navigateTo("/RIP_front/events");
          }
  
          setReservation(response.data);
          initializeFormMap(response.data.reservation_data);
        })
        .catch((error) => {
          console.error('Error fetching cart data:', error);
        });
    }
  };

  const handleConfirmOrder = () => {
    // Отправка запроса на сервер для подтверждения заказа
    axios.put(`http://localhost:8000/reserves/${draftId}/edit_status_user/`, { Status: 'iP' }, { withCredentials: true })
      .then(() => {
        console.log('Order confirmed');
        localStorage.removeItem('draftId');
        localStorage.removeItem('setDraft');
        navigateTo("/RIP_front/events");
      })
      .catch((error) => {
        console.error('Error confirming order:', error);
      });
  };

  const handleCancelOrder = () => {
    // Отправка запроса на сервер для отмены заказа
    axios.delete(`http://localhost:8000/reserves/${draftId}/delete/`, { withCredentials: true })
      .then(() => {
        console.log('Order canceled');
        localStorage.removeItem('draftId');
        localStorage.removeItem('setDraft');
        navigateTo("/RIP_front/events");
      })
      .catch((error) => {
        console.error('Error canceling order:', error);
      });
  };

  return (
    <div>
      <Header />
      <Breadcrumbs items={breadcrumbsItems} className="breadcrumbs-container" />
  
      {reservation ? (
        <div className="reservation-details-container">
          <div className="general-info">
            <h2>Детали заявки</h2>
            {isDraft ? (
              <>
                <h3>Дата создания: {formatDate(reservation.reservation.Creation_date)}</h3>
                <h3>Статус: {reservation.reservation.Status === 'M' && 'Черновик заявки'}</h3>
                <button className="btn-draft" onClick={handleConfirmOrder}>
                  Сформировать заявку
                </button>
                <button className="btn-draft" onClick={handleCancelOrder}>
                  Отменить заявку
                </button>
              </>
            ) : (
              <>
                <h3>№ заявки: {reservation.reservation.Reserve_id}</h3>
                <h3>Дата создания: {formatDate(reservation.reservation.Creation_date)}</h3>
                <h3>Дата формирования: {reservation.reservation.Formation_date
                ? formatDate(reservation.reservation.Formation_date) : ''}</h3>
                <h3>Дата завершения: {reservation.reservation.Completion_date 
                ? formatDate(reservation.reservation.Completion_date) : ''} </h3>
                <h3>
                  Статус: {reservation.reservation.Status === 'iP' && 'В работе'}
                          {reservation.reservation.Status === 'Ca' && 'Отменена'}
                          {reservation.reservation.Status === 'C' && 'Завершена'}
                </h3>
              </>
            )}
          </div>
  
          <div className="event-info">
            <h2>Мероприятия:</h2>
            {reservation.reservation_data.map((eventData: any, index: number) => (
              <div key={index} className="event-data">
                <h3>
                  <Link to={`/RIP_front/events/${eventData.event_reservation.Event_id}`}>
                    {eventData.event.Name}
                  </Link>
                </h3>
                {isDraft ? (
                  <>
                    <div className="form-group">
                      <h4>Дата посещения:</h4>
                      <input
                        type="date"
                        id={`date-${eventData.event_reservation.Event_id}`}
                        className='registration-input'
                        name="Date"
                        value={editFormMap[eventData.event_reservation.Event_id]?.Date || ''}
                        onChange={(e) => handleInputChange(eventData.event_reservation.Event_id, e)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <h4>Информация о группе:</h4>
                      <input
                        type="text"
                        id={`groupInfo-${eventData.event_reservation.Event_id}`}
                        className='registration-input'
                        name="Group_info"
                        value={editFormMap[eventData.event_reservation.Event_id]?.Group_info || ''}
                        onChange={(e) => handleInputChange(eventData.event_reservation.Event_id, e)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <h4>Размер группы:</h4>
                      <input
                        type="text"
                        id={`groupSize-${eventData.event_reservation.Event_id}`}
                        className='registration-input'
                        name="Group_size"
                        value={editFormMap[eventData.event_reservation.Event_id]?.Group_size || ''}
                        onChange={(e) => handleInputChange(eventData.event_reservation.Event_id, e)}
                        required
                      />
                    </div>
                    <div>
                    <button className="btn-edit" onClick={() => handleEdit(eventData.event_reservation.Event_id)}>
                      Сохранить
                    </button>
                    <button className="btn-edit" onClick={() => handleDelete(eventData.event_reservation.Event_id)}>
                      Удалить
                    </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>Название группы: {eventData.event_reservation.Group_info}</h3>
                    <h3>Количество человек: {eventData.event_reservation.Group_size}</h3>
                    <h3>Дата: {eventData.event_reservation.Date}</h3>
                  </>
                )}
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
