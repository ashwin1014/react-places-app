import React from 'react';

import './NewPlace.css';
import Input from '../../shared/components/FormElements/Input/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/Util/validators';

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for (const inputId in state.inputs) {
                if(inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;                }
            } 
          return {
              ...state,
              inputs: {
                  ...state.inputs,
                  [action.inputId]: {value: action.value, isValid: action.isValid}
              },
              isValid: formIsValid
          };
        default:
            return state;
    }
};

const NewPlace = () => {

    const [formState, dispatch] = React.useReducer(formReducer, {
        inputs: {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        isValid: false
    });

    const titleInputHandler = React.useCallback((id, value, isValid) => {
   
    }, []);

    return (
        <form className='place-form'>
            <Input label='Title' id='title' element='input' errorText='Please enter a valid title' validators={[VALIDATOR_REQUIRE()]} onInput={titleInputHandler} />
            <Input label='Description' id='description' errorText='Please enter a valid description' validators={[VALIDATOR_MINLENGTH(5)]} onInput={titleInputHandler} />
        </form>
    )
}

export default NewPlace
