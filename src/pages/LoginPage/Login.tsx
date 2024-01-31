// LoginPage.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUsername, setRole, setIsAuthenticated } from '../../store/slices/AuthSlice';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import Axios from 'axios';
import "./Login.css"

const LoginPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const breadcrumbsItems = [
      { label: 'Мероприятия', link: '/RIP_front/events' },
      { label: `Вход в аккаунт`, link: '' },
    ];

    const handleLogin = async () => {
        try {
            const response = await Axios.post(`http://localhost:8000/auth/login`, {
                Email: email,
                Password: password,
            }, {
                withCredentials: true,
            });

            // Сохраняем данные в localStorage после успешного входа
            localStorage.setItem('login', response.data.Username);
            localStorage.setItem('role', response.data.Role);
            localStorage.setItem('isAuthenticated', 'true');

            dispatch(setUsername(response.data.Username));
            dispatch(setRole(response.data.Role));
            dispatch(setIsAuthenticated('true'));

            navigate('/RIP_front/events');
        } catch (error) {
            console.error('Ошибка входа:', error);
            setError('Неверные почта или пароль. Пожалуйста, попробуйте снова.');
        }
    };

    return (
        <div>
            <Header />
            <Breadcrumbs items={breadcrumbsItems} />
            <div className="register-field">
            <InputField
                className="registration-input"
                name="email"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div className="register-field">
            <InputField
                className="registration-input"
                name="password"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button className="btn-login" onClick={handleLogin}>Войти</Button>
            <h4> Нет аккаунта? <Link to="/RIP_front/registration">Зарегистрироваться</Link> </h4>
        </div>
    );
};

export default LoginPage;
