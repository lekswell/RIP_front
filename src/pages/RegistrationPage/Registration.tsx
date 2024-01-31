// Registration.tsx

import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Импорт AxiosError
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Header from '../../components/Header/Header';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import "./Registration.css"; // Укажите правильный путь к стилям

interface RegistrationProps {
  // Дополнительные пропсы, если нужно
}

const Registration: React.FC<RegistrationProps> = () => {
  const navigateTo = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const breadcrumbsItems = [
    { label: 'Мероприятия', link: '/RIP_front/events' },
    { label: `Регистрация`, link: '' },
  ];

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRegistration = async () => {
    try {
      setErrors([]); // Очищаем предыдущие ошибки
  
      if (!email) {
        setErrors(prevErrors => [...prevErrors, 'Введите Email']);
        return;
      }
  
      if (!username) {
        setErrors(prevErrors => [...prevErrors, 'Введите имя пользователя']);
        return;
      }
  
      if (!password) {
        // Если пароль не введен, добавляем ошибку в список
        setErrors(prevErrors => [...prevErrors, 'Введите пароль']);
        return; // Прекращаем обработку, если пароль не введен
      }
  
      await axios.post('http://localhost:8000/auth/register', {
        Email: email,
        Username: username,
        Password: password,
      });
  
      // Успешная регистрация, перенаправление на страницу входа
      navigateTo('/RIP_front/login');
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const errorData = error.response.data;
  
        if (errorData.Ошибка === 'Пользователь с таким email или username уже существует') {
          setErrors(prevErrors => [...prevErrors, 'Пользователь с таким email или username уже существует']);
        } else {
          console.error('Ошибка при регистрации:', error);
          setErrors(prevErrors => [
            ...prevErrors,
            'Ошибка при регистрации. Пожалуйста, попробуйте еще раз.',
          ]);
        }
      }
    }
  };

  return (
    <div className="registration-container">
      <Header />
      <Breadcrumbs items={breadcrumbsItems} />
      <div className="registration-form">
        <div className="register-field">
          <InputField
            type="text"
            name="email"
            placeholder="Email"
            className="registration-input"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="register-field">
          <InputField
            type="text"
            name="username"
            placeholder="Имя пользователя"
            className="registration-input"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="register-field">
          <InputField
            type="password"
            name="password"
            placeholder="Пароль"
            className="registration-input"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {errors.length > 0 && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <Button className="btn-login" onClick={handleRegistration}>
          Зарегистрироваться
        </Button>
      </div>
    </div>
  );
};

export default Registration;
