// ReservationsPage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Импортируем Link
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import './Reserves.css';
import Header from '../../components/Header/Header';
import { useSelector } from 'react-redux';
import {RootState} from '../../store/Store'

registerLocale('ru', ru);

const breadcrumbsItems = [
  { label: 'Главная', link: '/RIP_front/events' },
  { label: 'Мои заявки', link: '' },
];

const ReservationsPage: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(
    auth.isAuthenticated ? 
      (localStorage.getItem('startDate') ? new Date(localStorage.getItem('startDate')!) : new Date()) 
      : null
  );
  
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(
    auth.isAuthenticated ? 
      (localStorage.getItem('endDate') ? new Date(localStorage.getItem('endDate')!) : new Date()) 
      : null
  );
  
  const [status, setStatus] = useState<string | null>(
    auth.isAuthenticated ? 
      (localStorage.getItem('reserveStatus') || '') 
      : null
  );
  
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      loadReservations();
    } else {
      // Обнулить значения, если пользователь не аутентифицирован
      localStorage.removeItem('endDate');
      localStorage.removeItem('startDate');
      localStorage.removeItem('reserveStatus');
    }
  }, [auth.isAuthenticated, filterStartDate, filterEndDate, status]);

  const loadReservations = async () => {
    try {
      const formattedStartDate = filterStartDate?.toISOString().split('T')[0] || null;
      const formattedEndDate = filterEndDate?.toISOString().split('T')[0] || null;

      const response = await axios.get('http://localhost:8000/reserves/', {
        params: { start_date: formattedStartDate, end_date: formattedEndDate, status },
        withCredentials: true,
      });

      setReservations(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  const handleFilterStartDateChange = (date: Date | null) => {
    setFilterStartDate(date);
    localStorage.setItem('startDate', date?.toISOString() || '');

  };

  const handleFilterEndDateChange = (date: Date | null) => {
    setFilterEndDate(date);
    localStorage.setItem('endDate', date?.toISOString() || '');
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
    localStorage.setItem('reserveStatus', event.target.value);
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
          <select onChange={handleStatusChange} value={status || ''}>
            <option value="">Все</option>
            <option value="iP">В работе</option>
            <option value="Ca">Отменена</option>
            <option value="C">Завершена</option>
          </select>
        </div>

        <div className="filter-item">
          <h3>Начальная дата:</h3>
          <DatePicker
            selected={filterStartDate}
            onChange={handleFilterStartDateChange}
            locale="ru"
            dateFormat="dd.MM.yyyy"
          />
        </div>

        <div className="filter-item">
          <h3>Конечная дата:</h3>
          <DatePicker
            selected={filterEndDate}
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
              </tr>
            ))}
          </tbody>
      </table>
      </div>
    </div>
  );
};

export default ReservationsPage;
