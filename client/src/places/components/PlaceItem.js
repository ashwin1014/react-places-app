import React from 'react';

import './PlaceItem.css';
import Card from '../../shared/components/UIElements/Card/Card';
import Button from '../../shared/components/FormElements/Button/Button';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import Map from '../../shared/components/UIElements/Map/Map';
import { useHttpClient } from '../../shared/hooks/http-hook';

import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/Spin/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';

const PlaceItem = ({ id, image, title, description, address, creatorId, coordinates, onDelete }) => {
    const { loading, error, sendRequest, clearError } = useHttpClient();
    const [showMap, setShowMap] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const auth = React.useContext(AuthContext);

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = async () => {
        setShowConfirmModal(true);
       try {
           await  sendRequest(`http://localhost:5000/api/places/${id}`, 'DELETE', null, {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
           });
           onDelete(id);
       } catch(err) {}
    };

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };

    const confirmDeleteHandler = () => {
        console.log('Deleting...');
        setShowConfirmModal(false);
    };

    return (
        <>
           <ErrorModal error={error} onClear={clearError} />
            <Modal show={showMap} onCancel={closeMapHandler} header={address} contentClass='place-item__modal-content' footerClass='place-item__modal-actions' footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
                <div className='map-container'>
                    <Map center={coordinates} />
                </div>
            </Modal>
            <Modal show={showConfirmModal} onCancel={cancelDeleteHandler} header="Are you sure ?" footerClass='place-item__modal-actions' footer={
                <>
                    <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                    <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                </>
            }>
                <p>Are you sure you want to delete this place?</p>
            </Modal>
            <li className='place-item'>
            <Card className='place-item__content'>
                {
                    loading && <LoadingSpinner asOverlay />
                }
                <div className='place-item__image'>
                <img src={`http://localhost:5000/${image}`} alt={title}/>
                </div>
                <div className='place-item__info'>
                <h2>{title}</h2>
                <h3>{address}</h3>
                <p>{description}</p>
                </div>
                <div className='place-item__actions'>
                <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                {
                    auth.userId === creatorId && (
                        <>
                        <Button to={`/places/${id}`}>EDIT</Button>
                        <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
                        </>
                    )
                }
                </div>
            </Card>
            </li>
        </>
    )
}

export default PlaceItem
