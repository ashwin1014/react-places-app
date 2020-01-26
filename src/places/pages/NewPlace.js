import React from 'react';

import './PlaceForm.css';
import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/Util/validators';
import { useForm } from '../../shared/hooks/form-hook';

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
        }
    };

    const  [formState, inputHandler] = useForm(INIT_STATE, false);

    // const inputHandler = React.useCallback((id, value, isValid) => {
    //     dispatch({ type: 'INPUT_CHANGE', value, isValid, inputId: id })
    // }, []);

    const placeSubmitHAndler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    };

    return (
        <form className='place-form' onSubmit={placeSubmitHAndler}>
            <Input label='Title' id='title' element='input' errorText='Please enter a valid title' validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} />
            <Input label='Description' element='textarea' id='description' errorText='Please enter a valid description' validators={[VALIDATOR_MINLENGTH(5)]} onInput={inputHandler} />
            <Input label='Address'  element='input' id='address' errorText='Please enter a valid address' validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} />
            <Button type='submit' disabled={!formState.isValid}>Add Place</Button> 
        </form>
    )
}

export default NewPlace
