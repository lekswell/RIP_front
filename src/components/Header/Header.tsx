import React from 'react';
import logoImage from '../Images/logo.png';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './Header.css';

const Header: React.FC = () => (
  <header>
    <Link to="/RIP_front/events">
      <img className="logo" src={logoImage} alt="Logo" />
    </Link>
    <h2>Музей МГТУ им. Н.Э.Баумана</h2>
    <Navbar />
  </header>
);

export default Header;