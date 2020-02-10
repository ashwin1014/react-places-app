import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import MainNavigation from './shared/components/UIElements/Navigation/MainNavigation';

const Users = lazy(() => import('./users/pages/Users'));
const NewPlace = lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = lazy(() => import('./places/pages/UpdatePlace'));
const AuthPage = lazy(() => import('./users/pages/Auth'));

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<div>Loading ...</div>}>
    <MainNavigation />
     <main>
      <Switch>
       <Route path='/' component={Users} exact />
       <Route path='/:userId/places' component={UserPlaces} exact />
       <Route path='/places/new' component={NewPlace} exact />
       <Route path='/places/:placeId' component={UpdatePlace} exact />
       <Route path='/auth' component={AuthPage} exact />
       <Redirect to='/' />
      </Switch>
     </main>
    </Suspense>
  </BrowserRouter>
);

export default App;
