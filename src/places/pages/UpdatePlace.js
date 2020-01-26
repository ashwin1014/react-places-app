import React from 'react';
import { useParams } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import Card from '../../shared/components/UIElements/Card/Card';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/Util/validators';
import { useForm } from '../../shared/hooks/form-hook';

import './PlaceForm.css';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan, New York City. It was designed by Shreve, Lamb & Harmon and completed in 1931.',
        imageUrl: 'https://aws-tiqets-cdn.imgix.net/images/content/1e74453a4d2c45f9becb39add27f2dff.jpg?auto=format&fit=crop&ixlib=python-1.1.2&q=70&s=b720cbf5ab86e1786ee7bd2a6b4f26be&w=800&h=800&dpr=1',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Emp. State Building',
        description: 'The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan, New York City. It was designed by Shreve, Lamb & Harmon and completed in 1931.',
        imageUrl: 'https://aws-tiqets-cdn.imgix.net/images/content/1e74453a4d2c45f9becb39add27f2dff.jpg?auto=format&fit=crop&ixlib=python-1.1.2&q=70&s=b720cbf5ab86e1786ee7bd2a6b4f26be&w=800&h=800&dpr=1',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        },
        creator: 'u2'
    }
]

const UpdatePlace = () => {
    const { placeId } = useParams();
    const [loading, setLoading] = React.useState(true);

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

    const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

 React.useEffect(() => {
     if (identifiedPlace) {
        setFormData({
            title: {
                value: identifiedPlace.title,
                isValid: true
            },
            description: {
                value: identifiedPlace.description,
                isValid: true
            }
        }, true)
     }
     setLoading(false);

 }, [setFormData,identifiedPlace]);
    const handleSubmit = event => {
        event.preventDefault();
        console.log(formState.inputs)
    };

    if (!identifiedPlace) {
        return (
            <div className='center'>
                <Card><h2>Could not find place</h2></Card>
            </div>
        )
    }

    if (loading) {
        return (
            <div className='center'>
                <h2>Loading...</h2>
            </div>
        )
    }

    return (
       <form className='place-form' onSubmit={handleSubmit}>
        <Input id='title' element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} value={formState.inputs.title.value} valid={formState.inputs.title.isValid} onInput={inputHandler}/>
        <Input id='description' element='textarea' label='Description' validators={[VALIDATOR_MINLENGTH(5)]} value={formState.inputs.description.value} valid={formState.inputs.description.isValid} onInput={inputHandler} />
        <Button type='submit' disabled={!formState.isValid}>Update Place</Button>
       </form>
    )
}

export default UpdatePlace
