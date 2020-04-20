import React, { useEffect } from 'react'

import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';

import Spin from '../../shared/components/UIElements/Spin/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import Card from '../../shared/components/UIElements/Card/Card';

const UserPlaces = () => {
    const userId = useParams().userId;
    const [loadedPlaces, setLoadedPlaces] = React.useState();
    const { loading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
                setLoadedPlaces(responseData);
            } catch (err) {}
        };
        fetchPlaces();
    }, [sendRequest, userId])

    const placeDeletedHandler = deletedPlaceId => {
        setLoadedPlaces(prevState => prevState.filter(place => place.id !== deletedPlaceId));
    };

    if (!loading && loadedPlaces && loadedPlaces.places.length === 0) {
         return (
            <div className='center'>
             <Card>
               <h2>No places found</h2>
             </Card>
            </div>
         );
    }

    return (
        <>
         <ErrorModal error={error} onClear={clearError}  />
         { loading && <Spin asOverlay /> }
         {
             !loading && loadedPlaces && loadedPlaces.length > 0 && <PlaceList items={loadedPlaces} onDelete={placeDeletedHandler} />
         }
        </>
    )
};

export default UserPlaces