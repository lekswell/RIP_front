import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import './Reserves.css';
import Header from '../../components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/Store';
import {
  setStartDate,
  setEndDate,
  setReserveStatus,
  setClientId,
} from '../../store/slices/FilterSlice';

registerLocale('ru', ru);


const ReservationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { startDate, endDate, reserveStatus, clientId } = useSelector((state: RootState) => state.filter);
  const role = useSelector((state: RootState) => state.auth.role);
  const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
  const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

  let breadcrumbsItems;
  if (role === 'Admin') {
    breadcrumbsItems = [
      { label: 'Главная', link: '/RIP_front/events' },
      { label: 'Заявки', link: '' },
    ];
  } else {
    breadcrumbsItems = [
      { label: 'Главная', link: '/RIP_front/events' },
      { label: 'Мои заявки', link: '' },
    ];
  }
  const [reservations, setReservations] = useState<any[]>([]);

  const loadReservations = async () => {
    try {
      const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
      const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

      const response = await axios.get('http://localhost:8000/reserves/', {
        params: {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          status: reserveStatus,
          clientId, // Добавлен новый параметр
        },
        withCredentials: true,
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [startDate, endDate, reserveStatus, clientId]);

  useEffect(() => {
    const intervalId = setInterval(loadReservations, 5000);
    return () => clearInterval(intervalId);
  }, [startDate, endDate, reserveStatus, clientId]);

  const handleFilterStartDateChange = (date: Date | null) => {
    dispatch(setStartDate(date ? date.toISOString() : null));
  };

  const handleFilterEndDateChange = (date: Date | null) => {
    dispatch(setEndDate(date ? date.toISOString() : null));
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setReserveStatus(event.target.value));
  };

  const handleClientIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setClientId(event.target.value));
  };

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

  const handleComplete = async (reservation: any) => {
    try {
      // Отправляем запрос на сервер для завершения заявки
      await axios.put(`http://localhost:8000/reserves/${reservation.reservation.Reserve_id}/edit_status_admin/`, 
      { Status: 'C' },
      { withCredentials: true });
      
      // После успешного завершения обновляем данные
      loadReservations();
    } catch (error) {
      console.error('Ошибка при завершении заявки:', error);
    }
  };

  const handleCancel = async (reservation: any) => {
    try {
      // Отправляем запрос на сервер для отмены заявки
      await axios.put(`http://localhost:8000/reserves/${reservation.reservation.Reserve_id}/edit_status_admin/`, 
      { Status: 'Ca' },
      { withCredentials: true });
      
      // После успешной отмены обновляем данные
      loadReservations();
    } catch (error) {
      console.error('Ошибка при отмене заявки:', error);
    }
  };

  return (
    <div>
      <Header />
      <Breadcrumbs items={breadcrumbsItems} />

      <div className="filter-container">
        <div className="filter-item">
          <h3>Статус:</h3>
          <select onChange={handleStatusChange} value={reserveStatus || ''}>
            <option value="">Все</option>
            <option value="iP">В работе</option>
            <option value="Ca">Отменена</option>
            <option value="C">Завершена</option>
          </select>
        </div>
        <div className="filter-item">
          <h3>Начальная дата:</h3>
          <input
            type="date"
            id="start_date"
            className="registration-input"
            name="Start_date"
            value={formattedStartDate}
            onChange={(e) => handleFilterStartDateChange(new Date(e.target.value))}
            required
          />
        </div>

        <div className="filter-item">
          <h3>Конечная дата:</h3>
          <input
            type="date"
            id="end_date"
            className="registration-input"
            name="End_date"
            value={formattedEndDate}
            onChange={(e) => handleFilterEndDateChange(new Date(e.target.value))}
            required
          />
        </div>

        {role === 'Admin' && (
          <div className="filter-item">
            <h3>Клиент ID:</h3>
            <input
              type="text"
              placeholder="Введите Client ID"
              value={clientId || ''}
              onChange={handleClientIdChange}
            />
          </div>
        )}
      </div>

      <div className="table-container">
  <table>
    <thead>
      <tr>
        <th>№ заявки</th>
        <th>Дата формирования</th>
        <th>Статус</th>
        {role === 'Admin' && (
          <>
            <th>Дата создания</th>
            <th>Дата завершения</th>
            <th>Клиент Id</th>
            <th>Модератор Id</th>
            <th>Доступно</th>
            <th>Действия</th>
          </>
        )}
      </tr>
    </thead>
    <tbody>
      {reservations.map((reservation, index) => (
        <tr key={index}>
          <td>
            <Link to={`/RIP_front/reserves/${reservation.reservation.Reserve_id}`}>
              {index + 1}
            </Link>
          </td>
          <td>
            <Link to={`/RIP_front/reserves/${reservation.reservation.Reserve_id}`}>
              {formatDate(reservation.reservation.Formation_date) || ''}
            </Link>
          </td>
          <td>
            <Link to={`/RIP_front/reserves/${reservation.reservation.Reserve_id}`}>
              {reservation.reservation.Status === 'iP' && 'В работе'}
              {reservation.reservation.Status === 'Ca' && 'Отменена'}
              {reservation.reservation.Status === 'C' && 'Завершена'}
            </Link>
          </td>
          {role === 'Admin' && (
            <>
              <td>
                <Link to={`/RIP_front/reserves/${reservation.reservation.Reserve_id}`}>
                  {reservation.reservation.Creation_date
                    ? formatDate(reservation.reservation.Creation_date)
                    : ''}
                </Link>
              </td>
              <td>
                <Link to={`/RIP_front/reserves/${reservation.reservation.Reserve_id}`}>
                  {reservation.reservation.Completion_date
                    ? formatDate(reservation.reservation.Completion_date)
                    : ''}
                </Link>
              </td>
              <td>
                <Link to={`/RIP_front/reserves/${reservation.reservation.Reserve_id}`}>
                  {reservation.reservation.Client_id}
                </Link>
              </td>
              <td>
                <Link to={`/RIP_front/reserves/${reservation.reservation.Reserve_id}`}>
                  {reservation.reservation.Moderator_id}
                </Link>
              </td>
              <td>
                <Link to={`/RIP_front/reserves/${reservation.reservation.Reserve_id}`}>
                  {reservation.reservation.Available !== undefined
                    ? String(reservation.reservation.Available)
                    : 'Неизвестно'}
                </Link>
              </td>
              {reservation.reservation.Status === 'iP' && (
                <td>
                  <button className="btn-edit" onClick={() => handleComplete(reservation)}>
                    Принять
                  </button>
                  <button className="btn-edit" onClick={() => handleCancel(reservation)}>
                    Отклонить
                  </button>
                </td>
              )}
            </>
          )}
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
};

export default ReservationsPage;
