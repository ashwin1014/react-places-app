import { useState, useEffect, useCallback } from 'react';
import serialize from 'serialize-javascript';


let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setUserId(uid);
    const tokenExpirationDate = expirationDate || new Date(new Date.getItem() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    const obj = {
      userId: uid,
      token,
      expiration: tokenExpirationDate.toISOString()
    }
    localStorage.setItem('userData', serialize(obj, {isJSON: true, space: 2}))
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData')
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = localStorage.getItem('userData', eval('(' + localStorage.getItem('test') + ')'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId };

};