import React from 'react';
import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';


const auth = getAuth(app);

const Register = () => {

    const [error, setError] = useState('');
    // const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('')

    const handleSubmit = (event) =>{
        //1. Prevent page refresh
        event.preventDefault();
        setSuccess('');
        setError('');
        //2. Collect form data
        const email = event.target.email.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        console.log(email, password);
        //Validate
        if(!/(?=.*[A-Z])/.test(password)){
            setError('Please add at least one Uppercase');
            return;
        }
        else if(!/(?=.*[0-9])/.test(password)){
            setError('Please add at least one number');
            return;

        }
        else if (password.length < 6){
            setError('Please add at least 6 characters in your password');
            return;
        }
        //3.Create user in firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
            const loggedUser = result.user;
            console.log(loggedUser);
            setError('');
            event.target.reset();
            setSuccess('User has created successfully');
            sendVerificationEmail(result.user);
            updateUserData(result.user, name)
        })
        .catch(error =>{
            console.error(error);
            setError(error.message);
            
        })
    }


    const sendVerificationEmail = (user) =>{
        sendEmailVerification(user)
        .then(result =>{
            console.log(result);
            alert('Please verify your email address')
        })

    }

    const updateUserData = (user, name) =>{
        updateProfile(user, {
            displayName : name
        })
        .then(()=>{
            console.log('user name updated')
        })
        .catch(error=>{
            setError(error.message);
        })
    }

    const handleEmailChange = (event) =>{
        // setEmail(event.target.value)
    }

    const handlePasswordBlur = (event) =>{

    }
    return (
        <div className='w-50 mx-auto'>
            <h4>Please Register</h4>
            <form onSubmit={handleSubmit}>
                <input className='w-50 mb-4 rounded ps-2' type="text" name="text" id="text" placeholder='Your Name' required/>
                <br />
                <input className='w-50 mb-4 rounded ps-2' onChange={handleEmailChange} type="email" name="email" id="email" placeholder='Your Email' required/>
                <br />
                <input className='w-50 mb-4 rounded ps-2' onBlur={handlePasswordBlur} type="password" name="password" id="password" placeholder='Your Password'  required/>
                <br />
                <input className='btn btn-primary' type="submit" value="Register" />
            </form>
            <p><small>Already have an account ? Please <Link to='/login'>Login</Link></small></p>
            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
        </div>
    );
};

export default Register;