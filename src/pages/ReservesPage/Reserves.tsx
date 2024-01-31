import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import DatePicker from 'react-datepicker';
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
} from '../../store/slices/FilterSlice';

registerLocale('ru', ru);

const breadcrumbsItems = [
  { label: 'Главная', link: '/RIP_front/events' },
  { label: 'Мои заявки', link: '' },
];

const ReservationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { startDate, endDate, reserveStatus } = useSelector((state: RootState) => state.filter);
  const role = useSelector((state: RootState) => state.auth.role);

  const [reservations, setReservations] = useState<any[]>([]);

  const loadReservations = async () => {
    try {
      const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
      const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : null;

      const response = await axios.get('http://localhost:8000/reserves/', {
        params: { start_date: formattedStartDate, end_date: formattedEndDate, status: reserveStatus },
        withCredentials: true,
      });

      setReservations(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadReservations();
  }, [startDate, endDate, reserveStatus]);

  // Начинаем опрашивать сервер каждые 5 секунд
  useEffect(() => {
    const intervalId = setInterval(loadReservations, 5000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [startDate, endDate, reserveStatus]);

  const handleFilterStartDateChange = (date: Date | null) => {
    dispatch(setStartDate(date ? date.toISOString() : null));
  };

  const handleFilterEndDateChange = (date: Date | null) => {
    dispatch(setEndDate(date ? date.toISOString() : null));
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setReserveStatus(event.target.value));
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
          <DatePicker
            selected={startDate ? new Date(startDate) : null}
            onChange={handleFilterStartDateChange}
            locale="ru"
            dateFormat="dd.MM.yyyy"
          />
        </div>

        <div className="filter-item">
          <h3>Конечная дата:</h3>
          <DatePicker
            selected={endDate ? new Date(endDate) : null}
            onChange={handleFilterEndDateChange}
            locale="ru"
            dateFormat="dd.MM.yyyy"
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Номер заявки</th>
              <th>Дата формирования</th>
              <th>Статус</th>

              {/* Заголовки для админа */}
              {role === 'Admin' && (
                <>
                  <th>Creation_date</th>
                  <th>Completion_date</th>
                  <th>Client_id</th>
                  <th>Moderator_id</th>
                  <th>Available</th>
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
                    {formatDate(reservation.reservation.Formation_date)}
                  </Link>
                </td>
                <td>
                  <Link to={`/RIP_front/reserves/${reservation.reservation.Reserve_id}`}>
                    {reservation.reservation.Status === 'iP' && 'В работе'}
                    {reservation.reservation.Status === 'Ca' && 'Отменена'}
                    {reservation.reservation.Status === 'C' && 'Завершена'}
                  </Link>
                </td>

                {/* Данные для админа */}
                {role === 'Admin' && (
                  <>
                    <td>
                    <Link to={`/RIP_front/reserves/${reservation.reservation.Reserve_id}`}>
                      {formatDate(reservation.reservation.Creation_date)}
                    </Link>
                    </td>
                    <td>
                    <Link to={`/RIP_front/reserves/${reservation.reservation.Reserve_id}`}>
                      {formatDate(reservation.reservation.Completion_date)}
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
                  </>
                )}
                {role === 'Admin' && reservation.reservation.Status === 'iP' && (
                  <td>
                    <button className='btn-edit' onClick={() => handleComplete(reservation)}>
                      Завершить
                    </button>
                    <button className='btn-edit' onClick={() => handleCancel(reservation)}>
                      Отменить
                    </button>
                  </td>
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
