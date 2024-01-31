import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useNavigate } from 'react-router-dom';
import './Draft.css';

const breadcrumbsItems = [
  { label: 'Главная', link: '/RIP_front/events' },
  { label: 'Заказ', link: '' },
];

const CartPage = () => {
  const navigateTo = useNavigate();
  const [cartData, setCartData] = useState<any>({});
  const [editFormMap, setEditFormMap] = useState<{ [eventId: number]: any }>({});
  const [isDraftConfirmed, setIsDraftConfirmed] = useState(false);

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

  useEffect(() => {
    // Загрузка данных черновой заявки при монтировании компонента
    fetchCartData();
  }, []);

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
  
          setCartData(response.data);
          initializeFormMap(response.data.reservation_data);
        })
        .catch((error) => {
          console.error('Error fetching cart data:', error);
        });
    }
  };


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

  const handleEdit = (eventId: number) => {
    const editedFormData = editFormMap[eventId];
    const draftId = localStorage.getItem('draftId');
  
    // Отправка данных на сервер для изменения
    axios.put(`http://localhost:8000/reserve/${eventId}/${draftId}/edit/`, editedFormData, { withCredentials: true })
      .then(() => {
        console.log(`Successfully edited event with ID ${eventId}`);
        fetchCartData();
        // Можете добавить обновление состояния или другую логику здесь
      })
      .catch((error) => {
        console.error(`Error editing event with ID ${eventId}:`, error);
      });
  };
  
  const handleDelete = (eventId: number) => {
    const draftId = localStorage.getItem('draftId');
  
    // Отправка запроса на сервер для удаления
    axios.delete(`http://localhost:8000/reserve/${eventId}/${draftId}/delete/`, { withCredentials: true })
      .then(() => {
        console.log(`Successfully deleted event with ID ${eventId}`);
        fetchCartData();
        // Можете добавить обновление состояния или другую логику здесь
      })
      .catch((error) => {
        console.error(`Error deleting event with ID ${eventId}:`, error);
      });
  };

  const handleConfirmOrder = () => {
    const draftId = localStorage.getItem('draftId');
  
    // Отправка запроса на сервер для подтверждения заказа
    axios.put(`http://localhost:8000/reserves/${draftId}/edit_status_user/`, { Status: 'iP' }, { withCredentials: true })
      .then(() => {
        console.log('Order confirmed');
        // Можете добавить обновление состояния или другую логику здесь
        setIsDraftConfirmed(true);
        localStorage.removeItem('draftId');
        localStorage.removeItem('setDraft')
        navigateTo("/RIP_front/events");
      })
      .catch((error) => {
        console.error('Error confirming order:', error);
      });
  };

  const handleCancelOrder = () => {
    const draftId = localStorage.getItem('draftId');
  
    // Отправка запроса на сервер для отмены заказа
    axios.delete(`http://localhost:8000/reserves/${draftId}/delete/`, { withCredentials: true })
      .then(() => {
        console.log('Order canceled');
        // Можете добавить обновление состояния или другую логику здесь
        setIsDraftConfirmed(false);
        localStorage.removeItem('draftId');
        localStorage.removeItem('setDraft')
        navigateTo("/RIP_front/events");
      })
      .catch((error) => {
        console.error('Error canceling order:', error);
      });
  };

  return (
    <div>
      <Header />
      <Breadcrumbs items={breadcrumbsItems} />
      <div className="events-container">
        {cartData.reservation_data && cartData.reservation_data.map((reservationItem: any, index: number) => (
          <div key={index} className='events-data'>
            <h3>{reservationItem.event.Name}</h3>
            <div className="form-row">
              <div className="form-group">
                <h4>Дата посещения:</h4>
                <input
                  type="date"
                  id={`date-${reservationItem.event_reservation.Event_id}`}
                  className='registration-input'
                  name="Date"
                  value={editFormMap[reservationItem.event_reservation.Event_id]?.Date || ''}
                  onChange={(e) => handleInputChange(reservationItem.event_reservation.Event_id, e)}
                  required
                />
              </div>
              <div className="form-group">
                <h4>Информация о группе:</h4>
                <input
                  type="text"
                  id={`groupInfo-${reservationItem.event_reservation.Event_id}`}
                  className='registration-input'
                  name="Group_info"
                  value={editFormMap[reservationItem.event_reservation.Event_id]?.Group_info || ''}
                  onChange={(e) => handleInputChange(reservationItem.event_reservation.Event_id, e)}
                  required
                />
              </div>
              <div className="form-group">
                <h4>Размер группы:</h4>
                <input
                  type="text"
                  id={`groupSize-${reservationItem.event_reservation.Event_id}`}
                  className='registration-input'
                  name="Group_size"
                  value={editFormMap[reservationItem.event_reservation.Event_id]?.Group_size || ''}
                  onChange={(e) => handleInputChange(reservationItem.event_reservation.Event_id, e)}
                  required
                />
              </div>
            </div>

            {/* Добавление кнопок "Изменить" и "Удалить" */}
            <div className="buttons-container">
              <button className='btn-custom' onClick={() => handleEdit(reservationItem.event_reservation.Event_id)}>Сохранить</button>
              <button className='btn-custom' onClick={() => handleDelete(reservationItem.event_reservation.Event_id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
      {!isDraftConfirmed && (
        <div className="confirmation-buttons">
          <button className='btn-edit' onClick={handleConfirmOrder}>Сформировать заказ</button>
          <button className='btn-edit' onClick={handleCancelOrder}>Отменить заказ</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
