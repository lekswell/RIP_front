import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import logoImage from './logo.png';
import './Events.css';

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
    // Fetch event data using the relative path with query parameter
    fetch(`http://localhost:8000/events/?search=${searchText}`)
      .then(response => response.json())
      .then(data => {
        setEvents(data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  };

  const breadcrumbsItems = [
    { label: 'Актуальные мероприятия', link: '' } // Link to the current page
  ];

  const handleSearchClick = () => {
    // Redirect to the same frontend page with the search query parameter
    navigateTo(`/events/?query=${searchValue}`);
    // Fetch data after navigating to the new URL
    fetchEvents(searchValue);
  };
  useEffect(() => {
    // Fetch data when the component mounts for the first time or when search query changes
    fetchEvents(searchValue);
  }, [searchValue]); // Update the effect to run whenever searchValue changes

const searchInput = (
  <form>
    <input
      type="text"
      name="query"
      placeholder="Поиск мероприятий"
      className="search-input"
      value={searchValue}
      onChange={(event) => setSearchValue(event.target.value)}
    />
    <button type="button" className="btn-custom" onClick={handleSearchClick}>
      Искать
    </button>
  </form>
);


  return (
    <div>
      <header>
        <a href="/events">
          <img className='logo'  src={logoImage} />
        </a>
        <h2>Музей МГТУ им. Н.Э.Баумана</h2>
        {searchInput} {/* Render search input here */}
        <a href="{% url 'personal_account_url' %}" className="btn-custom">Личный кабинет</a>
      </header>
      <Breadcrumbs items={breadcrumbsItems} />
      <ul>
        {events.map((event) => (
          <li key={event.Event_id}>
            <h2>{event.Name}</h2>
            <a href={`/events/${event.Event_id}`}>
              <img style={{ textAlign: 'center' }} src={(event.Image !== 'http://localhost:9000/events/') ? event.ImageURL : logoImage} alt={event.Name} />
            </a>
            <h5>
              {event.Start_date} - {event.End_date}
            </h5>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsPage;
