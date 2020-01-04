import React from 'react';
import { Link } from 'react-router-dom';

import './MainNavigation.css';
import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../Backdrop/Backdrop';

const MainNavigation = () => {
    const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);

    const closeDrawerHandler = () => {
        setDrawerIsOpen(false);
    }
    return (
       <>
       {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
        <SideDrawer className='main-navigation__drawer-nav' show={drawerIsOpen} onClick={closeDrawerHandler}>
         <NavLinks />
        </SideDrawer>
       <MainHeader>
           <button className='main-navigation__menu-btn' onClick={() => setDrawerIsOpen(!drawerIsOpen)}>
               <span></span>
               <span></span>
               <span></span>
           </button>
           <h1 className='main-navigation__title'><Link to='/'>Your Places</Link></h1>
           <nav className='main-navigation__header-nav'>
               <NavLinks />
           </nav>
       </MainHeader>
       </>
    )
};

export default MainNavigation
