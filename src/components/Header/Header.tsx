// Header.tsx
import React from 'react';
import logoImage from '../Images/logo.png';
import { Link } from 'react-router-dom';
import "./Header.css"

const Header: React.FC = () => (
  <header>
    <Link to="/RIP_front/events">
      <img className='logo' src={logoImage}/>
    </Link>
    <h2>Музей МГТУ им. Н.Э.Баумана</h2>
    <a href="/RIP_front/events" className="btn-custom">Вернуться к мероприятиям</a>
    <a href="{% url 'personal_account_url' %}" className="btn-custom">Личный кабинет</a>
  </header>
);

export default Header;
