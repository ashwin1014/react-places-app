import React from 'react'
import UsersList from '../components/UsersList';
import { getApi } from '../../shared/Util/api'; 
import { useHttpClient } from '../../shared/hooks/http-hook';

import Spin from '../../shared/components/UIElements/Spin/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
const Users = () => {

    const { loading, error, sendRequest, clearError } = useHttpClient();

    // const [loading, setLoading] = React.useState(false);
    // const [isError, setIsError] = React.useState();
    const [loadedUsers, setLoadedUsers] = React.useState();

    // const fetchUsers = async () => {
    //     setLoading(true);
    //     setIsError();
    //     const { error, response } = await getApi('http://localhost:5000/api/users');
    //     if (response) {
    //         setLoading(false);
    //         setLoadedUsers(response.users);
    //     }
    //     if (error) {
    //         setLoading(false);
    //         setIsError(error.message || 'Something went wrong');
    //     }
    // };

    // const errorHandler = () => {
    //     setIsError();
    // };

    const fetchUsers = async () => {
        try {
            const response = await sendRequest('http://localhost:5000/api/users');
            setLoadedUsers(response.users);
        } catch (err) {

        }
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
         {
             loading && (
                 <div className='center'>
                     <Spin asOverlay />
                 </div>
             )
         }
         <ErrorModal error={error} onClear={clearError} />
         {
             loadedUsers && !loading && <UsersList items={loadedUsers}  />
         }
        </>
    )
}

export default Users
