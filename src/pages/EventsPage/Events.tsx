// EventsPage.tsx

import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import EventCard from '../../components/EventCard/EventCard';
import Header from '../../components/Header/Header';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import './Events.css';
import StatusFilter from '../../components/StatusFilter/StatusFilter';
import logoImage from '/home/student/pythonProjects/front/src/components/Images/logo.png';
import full_cart from '../../components/Images/full.png';
import empty_cart from '../../components/Images/free.png'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/Store';
import { setSearch, setEventStatus } from '../../store/slices/FilterSlice';
import { setDraft } from '../../store/slices/AuthSlice'; // Обновлено здесь

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

const EventsPage: FC = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('query') || '';

  const [events, setEvents] = useState<Event[]>([]);
  const [searchValue, setSearchValue] = useState(searchParam || localStorage.getItem('search') || '');
  const [selectedStatus, setSelectedStatus] = useState(localStorage.getItem('eventStatus') || '');
  const [isSearchClicked, setIsSearchClicked] = useState(true);

  const mockEvents: Event[] = [
    {
      Event_id: 1,
      Name: 'Мероприятие 1',
      Start_date: '2023-12-01',
      End_date: '2023-12-03',
      Image: 'image1',
      ImageURL: logoImage,
      Status: 'A',
      Info: 'Крутое мероприятие №1',
    },
    {
      Event_id: 2,
      Name: 'Мероприятие 2',
      Start_date: '2023-12-05',
      End_date: '2023-12-07',
      Image: 'image2',
      ImageURL: logoImage,
      Status: 'C',
      Info: 'Крутое мероприятие №2',
    },
    {
      Event_id: 3,
      Name: 'Мероприятие 3',
      Start_date: '2023-12-10',
      End_date: '2023-12-12',
      Image: 'image3',
      ImageURL: logoImage,
      Status: 'S',
      Info: 'Крутое мероприятие №3',
    },
  ];
  
  const filter = useSelector((state: RootState) => state.filter);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.isAuthenticated) {
      const storedSearch = localStorage.getItem('search') || '';
      const storedEventStatus = localStorage.getItem('eventStatus') || '';

      dispatch(setSearch(filter.search || storedSearch));
      dispatch(setEventStatus(filter.eventStatus || storedEventStatus));
    } else {
      dispatch(setSearch(''));
      dispatch(setEventStatus(''));

      localStorage.removeItem('search');
      localStorage.removeItem('eventStatus');
    }
  }, [dispatch, filter.search, filter.eventStatus, auth.isAuthenticated, auth.login]);

  const fetchEvents = (searchText: string, status: string) => {
    const queryParams = new URLSearchParams({
      search: searchText,
      status: status,
    });

    axios.get(`http://localhost:8000/events/?${queryParams}`, {withCredentials: true})
    .then((response) => {
      console.log(response.data);
      setEvents(response.data.events);
  
      if (auth.isAuthenticated) {
        dispatch(setDraft(response.data.hasDraft))
        if (response.data.hasDraft === 'True') {
          localStorage.setItem('draftId', response.data.Draft.Reserve_id);
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching events:', error);
      setEvents(mockEvents);
    });
  };

  const breadcrumbsItems = [
    { label: 'Мероприятия', link: '/RIP_front/events' },
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchClick = () => {
    navigateTo(`/RIP_front/events/?query=${searchValue}`);
    setIsSearchClicked(true);

    if (auth.isAuthenticated) {
      dispatch(setSearch(searchValue));
      localStorage.setItem('search', searchValue);
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    fetchEvents(searchValue, status);

    if (auth.isAuthenticated) {
      dispatch(setEventStatus(status));
      localStorage.setItem('eventStatus', status);
    }
  };

  useEffect(() => {
    if (isSearchClicked) {
      fetchEvents(searchValue, selectedStatus);
      setIsSearchClicked(false);
    }
  }, [searchValue, selectedStatus, isSearchClicked]);

  const handleCartClick = () => {
    // Обработка клика по корзине
    navigateTo("/RIP_front/draft");
  };
  const cartIcon = (
    <div>
      <img className="button-image" src={full_cart} alt="Cart" />
      <Button className="btn-draft" onClick={handleCartClick}>
        Оформить заказ
      </Button>
    </div>
  );


  return (
    <div>
      <Header />
      <div className="header-row">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
      <div className="search-status-row">
        <InputField
          type="text"
          name="query"
          placeholder="Поиск мероприятий"
          className="search-input"
          value={searchValue}
          onChange={handleInputChange}
        />
        <Button className="btn-custom" onClick={handleSearchClick}>
          Искать
        </Button>
        <StatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
        />
        {auth.isAuthenticated && auth.role === 'User' ? (
          auth.hasDraft === 'True' ? cartIcon : <img className="button-image" src={empty_cart} alt="Empty Cart" />
        ) : null}
      </div>
      <div>
        <ul>
          {(events.length > 0 ? events : mockEvents).map((event) => (
            <EventCard
              eventId={event.Event_id}
              name={event.Name}
              startDate={event.Start_date}
              endDate={event.End_date}
              image={event.Image}
              status={event.Status}
              imageURL={event.ImageURL}
              key={event.Event_id}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventsPage;
