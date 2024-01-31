import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/Store';
import { setLogout, setIsAuthenticated, setUsername, setRole} from '../../store/slices/AuthSlice';
import Axios from 'axios';

const Navbar: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const login = useSelector((state: RootState) => state.auth.login);
  const role = useSelector((state: RootState) => state.auth.role);
  const dispatch = useDispatch();

  useEffect(() => {
    // Проверяем localStorage при загрузке компонента
    const storedLogin = localStorage.getItem('login');
    const storedRole = localStorage.getItem('role');
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');

    if (storedIsAuthenticated === 'true') {
      // Если в localStorage есть данные об аутентификации, устанавливаем их в Redux
      dispatch(setUsername(storedLogin || ''));
      dispatch(setRole(storedRole || ''));
      dispatch(setIsAuthenticated(storedIsAuthenticated));
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      // Выполнить запрос к бекенду для выхода пользователя
      await Axios.get('http://localhost:8000/auth/logout', {
        withCredentials: true,
      });

      // Успешно вышли, теперь вызываем action для выхода в Redux
      dispatch(setLogout());
      localStorage.removeItem('endDate');
      localStorage.removeItem('startDate');
      localStorage.removeItem('reserveStatus');

    } catch (error) {
      // Обработка ошибок, если не удалось выполнить выход
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <nav>
      {isAuthenticated === 'true' ? (
        <>
          {role === 'User' && (
            <>
              <Link to="/RIP_front/events" className="btn-custom">
                Каталог
              </Link>
              <Link to="/RIP_front/reserves" className="btn-custom">
                Заявки
              </Link>
            </>
          )}
          {role === 'Admin' && (
            <>
              <Link to="/RIP_front/events" className="btn-custom">
                Каталог
              </Link>
              <Link to="/RIP_front/edit_events" className="btn-custom">
                Каталог: изменить
              </Link>
              <Link to="/RIP_front/reserves" className="btn-custom">
                Заявки
              </Link>
            </>
          )}
          <Link to="/RIP_front/events" className="btn-custom" onClick={handleLogout}>
            {`${login}: Выход`}
          </Link>
        </>
      ) : (
        <>
          <Link to="/RIP_front/events" className="btn-custom">
            Каталог
          </Link>
          <Link to="/RIP_front/login" className="btn-custom">
            Войти
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
