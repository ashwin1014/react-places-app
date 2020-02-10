import React from 'react';

import './Auth.css';
import Card from './../../shared/components/UIElements/Card/Card';
import Input from './../../shared/components/FormElements/Input/Input';
import Button from './../../shared/components/FormElements/Button/Button';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../shared/Util/validators';
import { useForm } from '../../shared/hooks/form-hook';

const Auth = () => {

    const [formState, inputHandler] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    });

    const authSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    };

    return (
        <Card className='authentication'>
            <h2>Login Required</h2>
            <form onSubmit={authSubmitHandler}>
                <Input element='input' id='email' type='email' label='E-Mail' validators={[VALIDATOR_EMAIL()]} errorText='Enter a valid Email' onInput={inputHandler}/>
                <Input element='input' id='password' type='password' label='Password' validators={[VALIDATOR_MINLENGTH(6)]} errorText='Enter a valid Password of min 6 characters' onInput={inputHandler} />
                <Button type='submit' disabled={!formState.isValid}>SUBMIT</Button>
            </form>
        </Card>
    )
}

export default Auth
