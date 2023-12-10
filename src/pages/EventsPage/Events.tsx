// pages/Events.tsx
import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import EventCard from '../../components/EventCard/EventCard';
import Header from '../../components/Header/Header';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import "./Events.css"
//import logoImage from './logo.png';

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

  const fetchEvents = (searchText: string) => {
    // Fetch event data using the relative path with a query parameter
    fetch(`http://localhost:8000/events/?search=${searchText}`)
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  };

  const breadcrumbsItems = [
    { label: 'Актуальные мероприятия', link: '' },
  ];

  const handleSearchClick = () => {
    // Redirect to the same frontend page with the search query parameter
    navigateTo(`/RIP_front/events/?query=${searchValue}`);
    // Fetch data after navigating to the new URL
    fetchEvents(searchValue);
  };

  useEffect(() => {
    // Fetch data when the component mounts for the first time
    fetchEvents(searchValue);
  }, []); // Empty dependency array means this effect runs once on mount

  const searchInput = (
    <form>
      <InputField
        type="text"
        name="query"
        placeholder="Поиск мероприятий"
        className="search-input"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
      />
      <Button onClick={handleSearchClick}>Искать</Button>
    </form>
  );

  return (
    <div>
      <Header />
      <div>
        <Breadcrumbs items={breadcrumbsItems} />
        {searchInput}
        <div>
          <ul>
            {events.map((event) => (
              <EventCard
                key={event.Event_id}
                eventId={event.Event_id}
                name={event.Name}
                startDate={event.Start_date}
                endDate={event.End_date}
                image={event.Image}
                imageURL={event.ImageURL}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
