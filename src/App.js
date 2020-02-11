import React, { Suspense, lazy, useState, useCallback } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import MainNavigation from './shared/components/UIElements/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';

const Users = lazy(() => import('./users/pages/Users'));
const NewPlace = lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = lazy(() => import('./places/pages/UpdatePlace'));
const AuthPage = lazy(() => import('./users/pages/Auth'));


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
      <Route path='/' component={Users} exact />
      <Route path='/:userId/places' component={UserPlaces} exact />
      <Route path='/places/new' component={NewPlace} exact />
      <Route path='/places/:placeId' component={UpdatePlace} exact />
      <Redirect to='/' />
     </Switch>
    )
  } else (
    routes = (
      <Switch>
       <Route path='/' component={Users} exact />
       <Route path='/:userId/places' component={UserPlaces} exact />
       <Route path='/auth' component={AuthPage} exact />
       <Redirect to='/auth' />
      </Switch>
    )
  )

  return (
    <AuthContext.Provider value={{isLoggedIn: isLoggedIn, login: login, logout: logout}}>
    <BrowserRouter>
      <Suspense fallback={<div>Loading ...</div>}>
      <MainNavigation />
      <main>
        {routes}
      </main>
      </Suspense>
    </BrowserRouter>
  </AuthContext.Provider>
  )
}

export default App;
