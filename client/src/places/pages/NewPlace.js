import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import './PlaceForm.css';
import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload/ImageUpload';
import Spin from '../../shared/components/UIElements/Spin/LoadingSpinner';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/Util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

// const formReducer = (state, action) => {
//     switch (action.type) {
//         case 'INPUT_CHANGE':
//             let formIsValid = true;
//             for (const inputId in state.inputs) {
//                 if(inputId === action.inputId) {
//                     formIsValid = formIsValid && action.isValid
//                 } else {
//                     formIsValid = formIsValid && state.inputs[inputId].isValid;                }
//             } 
//           return {
//               ...state,
//               inputs: {
//                   ...state.inputs,
//                   [action.inputId]: {value: action.value, isValid: action.isValid}
//               },
//               isValid: formIsValid
//           };
//         default:
//             return state;
//     }
// };

const NewPlace = () => {

    const { loading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);
    const history = useHistory();
    // const [formState, dispatch] = React.useReducer(formReducer, {
    //     inputs: {
    //         title: {
    //             value: '',
    //             isValid: false
    //         },
    //         description: {
    //             value: '',
    //             isValid: false
    //         },
    //         address: {
    //             value: '',
    //             isValid: false
    //         }
    //     },
    //     isValid: false
    // });

    const INIT_STATE = {
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    };

    const  [formState, inputHandler] = useForm(INIT_STATE, false);

    // const inputHandler = React.useCallback((id, value, isValid) => {
    //     dispatch({ type: 'INPUT_CHANGE', value, isValid, inputId: id })
    // }, []);

    const placeSubmitHandler = async (event) => {
        event.preventDefault();
        // using transactions
        try {
            const  coordinates = {
                lat: Number(formState.inputs.latitude.value), 
                lng: Number(formState.inputs.longitude.value),
            };
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('coordinates', coordinates);
            formData.append('image', formState.inputs.image.value);
            // formData.append('creator', auth.userId); -> handled in server
            await sendRequest('http://localhost:5000/api/places', 'POST', formData, {
                Authorization: 'Bearer ' + auth.token
            })
            // Redirect
            history.push('/');
        } catch (err) {}
       
        // // without transactions -> 2 separate apis
        // try {
        //     await sendRequest('http://localhost:5000/api/places/createonly', 'POST', JSON.stringify({
        //         title: formState.inputs.title.value,
        //         description: formState.inputs.description.value,
        //         address: formState.inputs.address.value,
        //         image: formState.inputs.image.value,
        //         coordinates: {
        //             lat: Number(formState.inputs.latitude.value), 
        //             lng: Number(formState.inputs.longitude.value),
        //         },
        //         creator: auth.userId
        //     })).then(() => {
        //         sendRequest('http://localhost:5000/api/places/updateuserplace', 'PATCH', JSON.stringify({
        //         title: formState.inputs.title.value,
        //         description: formState.inputs.description.value,
        //         address: formState.inputs.address.value,
        //         image: formState.inputs.image.value,
        //         coordinates: {
        //             lat: Number(formState.inputs.latitude.value), 
        //             lng: Number(formState.inputs.longitude.value),
        //         },
        //         creator: auth.userId
        //       })).then(() =>  history.push('/')).catch((err) => {
        //         throw new Error('Something went wrong!!');
        //       })
        //     });
        //     // // Redirect
        //     // history.push('/');
        // } catch (err) {}

    };

    return (
       <>
        {
            loading && <Spin asOverlay />
        }
        {
            error && <ErrorModal error={error} onClear={clearError} />
        }
         <form className='place-form' onSubmit={placeSubmitHandler}>
            <Input label='Title' id='title' element='input' errorText='Please enter a valid title' validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} />
            <Input label='Description' element='textarea' id='description' errorText='Please enter a valid description' validators={[VALIDATOR_MINLENGTH(5)]} onInput={inputHandler} />
            <Input label='Address'  element='input' id='address' errorText='Please enter a valid address' validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} />
            <Input label='Latitude'  element='input' id='latitude' type='number' errorText='Please enter a valid Latitude' validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} />
            <Input label='Longitude'  element='input' id='longitude' type='number' errorText='Please enter a valid Longitude' validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} />
            <ImageUpload errorText='Please provide an image' id='image' onInput={inputHandler} />
            <Button type='submit' disabled={!formState.isValid}>Add Place</Button> 
        </form>
       </>
    )
}

export default NewPlace
