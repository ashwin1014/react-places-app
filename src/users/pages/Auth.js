import React, { useState, useContext } from 'react';

import './Auth.css';
import Card from './../../shared/components/UIElements/Card/Card';
import Input from './../../shared/components/FormElements/Input/Input';
import Button from './../../shared/components/FormElements/Button/Button';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/Util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const authSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
        auth.login();
    };

    const authSwitchHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevState => !prevState);
    };

    return (
        <Card className='authentication'>
            <h2>Login Required</h2>
            <form onSubmit={authSubmitHandler}>
                {
                    !isLoginMode && (
                        <Input element='input' id='name' type='text' label='Your Name' validators={[VALIDATOR_REQUIRE()]} errorText='Please enter a name' onInput={inputHandler}/>
                    )
                }
                <Input element='input' id='email' type='email' label='E-Mail' validators={[VALIDATOR_EMAIL()]} errorText='Enter a valid Email' onInput={inputHandler}/>
                <Input element='input' id='password' type='password' label='Password' validators={[VALIDATOR_MINLENGTH(6)]} errorText='Enter a valid Password of min 6 characters' onInput={inputHandler} />
                <Button type='submit' disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
            </form>
            <Button inverse onClick={authSwitchHandler}>{isLoginMode ? 'SWITCH TO SIGNUP' : 'SWITCH TO LOGIN'}</Button>
        </Card>
    )
}

export default Auth
