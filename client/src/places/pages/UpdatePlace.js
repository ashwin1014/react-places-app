import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import Card from '../../shared/components/UIElements/Card/Card';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/Util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './PlaceForm.css';
import LoadingSpinner from '../../shared/components/UIElements/Spin/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';

const UpdatePlace = () => {
    const { placeId } = useParams();
    const history = useHistory();
    const auth = React.useContext(AuthContext);
    const { loading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = React.useState();

    const INIT_STATE = {
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    };

    const  [formState, inputHandler, setFormData] = useForm(INIT_STATE, true);

    // const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    React.useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.description,
                        isValid: true
                    }
                }, true)
            } catch(err) {}
        };
        fetchPlace();
    }, [placeId, sendRequest]);
    
    const handleSubmit = async event => {
        event.preventDefault();
       try {
        await sendRequest(`http://localhost:5000/api/places/${placeId}`, 'PATCH', JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value
        }), {
            'Content-Type': 'application/json',
             Authorization: 'Bearer ' + auth.token
        });
        history.push(`/${auth.userId}/places`);
       }
       catch (err) {}
    };

    if (!loadedPlace && !loading && !error) {
        return (
            <div className='center'>
                <Card><h2>Could not find place</h2></Card>
            </div>
        )
    }

    if (loading) {
        return (
            <div className='center'>
                <LoadingSpinner asOverlay />
            </div>
        )
    }

    return (
      <>
       <ErrorModal error={error} onClear={clearError} />
        {
            !loading && loadedPlace && (
                <form className='place-form' onSubmit={handleSubmit}>
                <Input id='title' element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} value={loadedPlace.title} valid={true} onInput={inputHandler}/>
                <Input id='description' element='textarea' label='Description' validators={[VALIDATOR_MINLENGTH(5)]} value={loadedPlace.description} valid={true} onInput={inputHandler} />
                <Button type='submit' disabled={!formState.isValid}>Update Place</Button>
               </form>
            )            
        }
      </>
    )
}

export default UpdatePlace
