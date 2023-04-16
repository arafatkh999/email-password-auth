import React from 'react';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';
import { useRef } from 'react';



const auth = getAuth(app);

const Login = () => {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const emailRef = useRef();

    const handleLogin = event =>{
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        //Validation
        setError('');
        setSuccess('');

        if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
            setError('Please add at least two Uppercase');
            return;

        }
        else if(!/(?=.*[!@#$&*])/.test(password)){
            setError('Please add at least one special character');
            return;
        }
        else if(password.length < 6){
            setError('Password must be 6 character long');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
        .then(result =>{
          const loggedUser = result.user;
          setSuccess('User login Successfully');
          setError('');
        })
        .catch(error =>{
          setError(error.message)
        })

    }

    const handleResetPassword = (event)=>{
      const email = emailRef.current.value;
      if(!email){
        alert('Please provide your email to reset password');
        return;
      
      }
      sendPasswordResetEmail(auth, email)
      .then(()=>{
        alert('Please check your email');
      })
      .catch(error=>{
        console.log(error);
        setError(error.message)
      })


    }
    return (
        <div className='w-25 mx-auto'>
            <h2>Please login</h2>
            <Form onSubmit={handleLogin}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" ref={emailRef} name='email' placeholder="Enter email"  required/>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name='password' placeholder="Password" required/>
      </Form.Group>

      <Form.Group controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Remember me" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
    <p><small>Forget Password ? Please <button onClick={handleResetPassword} className='btn btn-link'>Reset Password</button> </small></p>
    <p> <small>New to this website ? Please <Link to='/register'>Register</Link></small> </p>
    <p className='text-danger'>{error}</p>
    <p className='text-success'>{success}</p>
        </div>
    );
};

export default Login;