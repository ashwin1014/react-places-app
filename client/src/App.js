import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import MainNavigation from './shared/components/UIElements/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import LoadingSpinner from './shared/components/UIElements/Spin/LoadingSpinner';
import { useAuth } from './shared/hooks/auth-hook';

const Users = lazy(() => import('./users/pages/Users'));
const NewPlace = lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = lazy(() => import('./places/pages/UpdatePlace'));
const AuthPage = lazy(() => import('./users/pages/Auth'));

const App = () => {

  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
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
    <AuthContext.Provider value={{isLoggedIn: !!token, login: login, logout: logout, userId: userId, token}}>
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner asOverlay />}>
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
