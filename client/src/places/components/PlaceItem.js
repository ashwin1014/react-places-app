import React from 'react';

import './PlaceItem.css';
import Card from '../../shared/components/UIElements/Card/Card';
import Button from '../../shared/components/FormElements/Button/Button';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import Map from '../../shared/components/UIElements/Map/Map';

import { AuthContext } from '../../shared/context/auth-context';

const PlaceItem = ({ id, image, title, description, address, creatorId, coordinates }) => {
    const [showMap, setShowMap] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const auth = React.useContext(AuthContext);

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
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
                <div className='place-item__image'>
                <img src={image} alt={title}/>
                </div>
                <div className='place-item__info'>
                <h2>{title}</h2>
                <h3>{address}</h3>
                <p>{description}</p>
                </div>
                <div className='place-item__actions'>
                <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                {
                    auth.isLoggedIn && (
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
