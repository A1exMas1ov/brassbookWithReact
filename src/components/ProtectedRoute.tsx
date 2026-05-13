// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../main';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { store } = useContext(Context);
  
  // Проверяем наличие токена и авторизацию
  const token = localStorage.getItem('token');
  const isAuth = store.isAuth || token;
  
  if (!isAuth) {
    // Нет токена - редирект на логин
    return <Navigate to="/signin" replace />;
  }
  
  // Есть токен - показываем страницу
  return children;
};

export default ProtectedRoute;