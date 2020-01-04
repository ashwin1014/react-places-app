import React from 'react'
import UsersList from '../components/UsersList';
const Users = () => {

    const USERS = [{ id: 'u1', name: 'Jane Doe', image: 'https://randomuser.me/api/portraits/women/49.jpg', places: 3 }];

    return (
        <UsersList items={USERS}  />
    )
}

export default Users
