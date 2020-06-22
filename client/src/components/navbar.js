import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import store, { set } from 'store2';

import M from 'materialize-css';
import axios from '../utils/axiosextension';

const Navbar = () => {
  const searchModel = useRef(undefined);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  const fetchUsers = async (query) => {
    setSearch(query);

    try {
      const res = await axios.post('/user/search', {
        query,
      });

      console.log(res.data);
      setUsers(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    M.Modal.init(searchModel.current);
  }, []);

  const renderList = () => {
    if (state) {
      return [
        <li key='7'>
          <i
            data-target='modal1'
            className='large material-icons modal-trigger'
            style={{ color: 'white' }}
          >
            search
          </i>
        </li>,
        <li key='1'>
          <Link to='/profile'>MyProfile</Link>
        </li>,
        <li key='2'>
          <Link to='/createpost'>CreatePost</Link>
        </li>,
        <li key='4'>
          <button
            className='btn green'
            onClick={() => {
              store.clear();
              dispatch({ type: 'CLEAR' });
              history.push('/login');
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key='5'>
          <Link to='/login'>Login</Link>
        </li>,
        <li key='6'>
          <Link to='/signup'>SignUp</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className='nav-wrapper green'>
        <Link key='100' to={state ? '/' : '/login'} className='brand-logo left'>
          Tell Tale
        </Link>
        <ul id='nav-mobile' className='right'>
          {renderList()}
        </ul>
      </div>

      <div
        id='modal1'
        className='modal'
        ref={searchModel}
        style={{ color: 'black' }}
      >
        <div className='modal-content'>
          <input
            type='text'
            style={{ color: 'black' }}
            placeholder='search users'
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />

          <ul className='collection'>
            {users.map((item) => {
              return (
                <Link
                  to={
                    item._id !== state._id ? `/profile/${item._id}` : `/profile`
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModel.current).close();
                  }}
                >
                  <li className='collection-item' key={item._id}>
                    {item.name}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className='modal-footer'>
          <button
            style={{ color: 'white' }}
            className='modal-close green btn-flat'
            onClick={() => setSearch('')}
          >
            close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
