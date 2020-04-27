import React, { useState, useContext } from 'react';

import './Auth.css';
import Card from './../../shared/components/UIElements/Card/Card';
import Input from './../../shared/components/FormElements/Input/Input';
import Button from './../../shared/components/FormElements/Button/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import Spin from '../../shared/components/UIElements/Spin/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload/ImageUpload';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/Util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { postApi } from '../../shared/Util/api';

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setError] = useState('');
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

    const authSubmitHandler = async event => {
        event.preventDefault();
        // console.log(formState.inputs);
        if (isLoginMode) {
            const body = {
                email: formState.inputs.email.value,
                password: formState.inputs.password.value
            };
            setIsLoading(true);
            const { error, response } = await postApi('http://localhost:5000/api/users/login', body);

            if (response) {
                setIsLoading(false);
                auth.login(response.user.id);
            }

            if (error) {
                setIsLoading(false);
                setError(error.message || 'Something went wrong');
            }
            
        } else {
            const formData = new FormData();
            formData.append('name', formState.inputs.name.value);
            formData.append('email', formState.inputs.email.value);
            formData.append('password', formState.inputs.password.value);
            formData.append('image', formState.inputs.image.value);
            // const body = {
            //     name: formState.inputs.name.value,
            //     email: formState.inputs.email.value,
            //     password: formState.inputs.password.value
            // };
            setIsLoading(true);
            const { error, response } = await postApi('http://localhost:5000/api/users/signup', formData, true);

            if (response) {
                setIsLoading(false);
                // console.log(response);
                auth.login();
            }

            if (error) {
                setIsLoading(false);
                setError(error.message || 'Something went wrong');
                // console.error(error);
            }
        }
    };

    const authSwitchHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevState => !prevState);
    };

    const errorHandler = () => {
        setError(null);
    };

    return (
       <>
       <ErrorModal error={isError} onClear={errorHandler} />
        <Card className='authentication'>
            {isLoading && <Spin asOverlay />}
            <h2>Login Required</h2>
            <form onSubmit={authSubmitHandler}>
                {
                    !isLoginMode && (
                        <>
                         <Input element='input' id='name' type='text' label='Your Name' validators={[VALIDATOR_REQUIRE()]} errorText='Please enter a name' onInput={inputHandler}/>
                         <ImageUpload id='image' center onInput={inputHandler} />
                        </>
                    )
                }
                <Input element='input' id='email' type='email' label='E-Mail' validators={[VALIDATOR_EMAIL()]} errorText='Enter a valid Email' onInput={inputHandler}/>
                <Input element='input' id='password' type='password' label='Password' validators={[VALIDATOR_MINLENGTH(6)]} errorText='Enter a valid Password of min 6 characters' onInput={inputHandler} />
                <Button type='submit' disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
            </form>
            <Button inverse onClick={authSwitchHandler}>{isLoginMode ? 'SWITCH TO SIGNUP' : 'SWITCH TO LOGIN'}</Button>
        </Card>
       </>
    )
}

export default Auth
