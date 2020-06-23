import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import axios from '../utils/axiosextension';
import M from 'materialize-css';
import store from 'store2';
import uploadPic from '../utils/upload_pic';
import useSpinner from '../utils/spinner';

const SignUp = () => {
  const { dispatch } = useContext(UserContext);
  const [spinner, showSpinner, hideSpinner] = useSpinner();

  const history = useHistory();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(undefined);

  const postData = async (event) => {
    let picUrl = undefined;

    const userName = name.trim();
    const userEmail = email.trim();
    const userPassword = password.trim();
    const userConfirmPassword = confirmPassword.trim();

    if (!userName || !userEmail || !userPassword || !userConfirmPassword) {
      M.toast({ html: 'Please fill all the entries' });
      return;
    }

    if (userPassword !== userConfirmPassword) {
      M.toast({
        html: 'Confirm password and Password do not match',
        classes: '#c62828 red darken-3',
      });
      return;
    }
    try {
      showSpinner();
      if (profilePic) {
        picUrl = await uploadPic(profilePic);
        console.log('Pic uploaded : ', picUrl);
      }

      const res = await axios.post('/user/signup', {
        name: userName,
        email: userEmail,
        password: userPassword,
        picUrl: picUrl,
      });

      const token = res.data.token;
      store.set('jwt', token);
      store.set('user', res.data.user);
      dispatch({ type: 'USER', payload: res.data.user });

      M.toast({ html: res.data.message, classes: '#43a047 green darken-1' });
      history.push('/');
    } catch (error) {
      hideSpinner();
      if (error.response) {
        const message = error.response;
        console.log('Error message', error);
        M.toast({
          html: 'Something went wrong',
          classes: '#c62828 red darken-3',
        });
        return;
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
            placeholder='name'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
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
          <input
            type='password'
            placeholder='confirm password'
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <div className='file-field input-field'>
            <div className='btn green'>
              <span>Upload Profile Pic</span>
              <input
                type='file'
                onChange={(e) => {
                  setProfilePic(e.target.files[0]);
                }}
              />
            </div>
            <div className='file-path-wrapper'>
              <input
                className='file-path validate'
                placeholder='optional'
                type='text'
              />
            </div>
          </div>
          <button
            className='btn green'
            type='submit'
            name='action'
            onClick={() => {
              postData();
            }}
          >
            SignUp
          </button>
          <h6>
            <Link style={{ color: 'green' }} to='/login'>
              Already have an account ?
            </Link>
          </h6>
        </div>
      </div>
      {spinner}
    </>
  );
};
export default SignUp;
