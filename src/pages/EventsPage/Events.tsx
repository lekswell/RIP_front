// pages/Events.tsx
import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import EventCard from '../../components/EventCard/EventCard';
import Header from '../../components/Header/Header';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import './Events.css';
import StatusFilter from '../../components/StatusFilter/StatusFilter';
import logoImage from '/home/student/pythonProjects/front/src/components/Images/logo.png'

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
  const [searchValue, setSearchValue] = useState(searchParam);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const fetchEvents = (searchText: string, status: string) => {
    const queryParams = new URLSearchParams({
      search: searchText,
      status: status,
    });

    // Simulate server response when the server is not available
    const isServerAvailable = Math.random() > 0.5; // Adjust the probability as needed
    if (!isServerAvailable) {
      // Create three mock event cards
      const mockEvents = [
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

      setEvents(mockEvents);
      return;
    }

    // Actual fetch when the server is available
    fetch(`http://localhost:8000/events/?${queryParams}`)
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  };

  const breadcrumbsItems = [
    { label: 'Все мероприятия', link: '/RIP_front/events' },
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  
  const handleSearchClick = () => {
    navigateTo(`/RIP_front/events/?query=${searchValue}`);
    setIsSearchClicked(true);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    fetchEvents(searchValue, status);
  };

  useEffect(() => {
    // Fetch data when the component mounts for the first time
    fetchEvents(searchValue, selectedStatus);
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // Fetch data when the component mounts and whenever searchValue or selectedStatus changes
    if (isSearchClicked) {
      fetchEvents(searchValue, selectedStatus);
      setIsSearchClicked(false); // Reset the flag after filtering
    }
  }, [searchValue, selectedStatus, isSearchClicked]);

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
        <Button onClick={handleSearchClick}>Искать</Button>
        <StatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
        />
      </div>
      <div>
        <ul>
          {events.map((event) => (
            <EventCard
              eventId={event.Event_id}
              name={event.Name}
              startDate={event.Start_date}
              endDate={event.End_date}
              image={event.Image}
              status={event.Status}
              imageURL={event.ImageURL}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventsPage;
