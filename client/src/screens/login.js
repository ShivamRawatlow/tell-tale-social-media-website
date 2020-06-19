import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import axios from '../utils/axiosextension';
import M from 'materialize-css';
import store from 'store2';
import useSpinner from '../utils/spinner';

const Login = () => {
  const [spinner, showSpinner, hideSpinner] = useSpinner();
  const { dispatch } = useContext(UserContext);
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async (event) => {
    const userEmail = email.trim();
    const userPassword = password.trim();

    if (!userEmail || !userPassword) {
      M.toast({ html: 'Please fill all the entries' });
      return;
    }

    try {
      showSpinner();
      const res = await axios.post('/user/login', {
        email: userEmail,
        password: userPassword,
      });

      store.set('jwt', res.data.token);
      store.set('user', res.data.user);
      dispatch({ type: 'USER', payload: res.data.user });

      M.toast({ html: res.data.message, classes: '#43a047 green darken-1' });
      history.push('/');
    } catch (error) {
      hideSpinner();
      if (error) {
        console.log(error.message);
        M.toast({ html: 'No user found', classes: '#c62828 red darken-3' });
      }
    }
  };

  return (
    <>
      <div className='mycard'>
        <div className='card auth-card'>
          <h2 style={{ color: 'green' }} className='brand-logo'>
            Tell Tale
          </h2>
          <input
            type='text'
            placeholder='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            className='btn green'
            type='submit'
            name='action'
            onClick={() => {
              login();
            }}
          >
            Login
          </button>
          <h6>
            <Link style={{ color: 'green' }} to='/signup'>
              Dont have an account ?
            </Link>
          </h6>
        </div>
      </div>
      {spinner}
    </>
  );
};
export default Login;
