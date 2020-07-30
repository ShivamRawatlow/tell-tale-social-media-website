import React, { useEffect, useContext } from 'react';
import store from 'store2';
import UserProfile from '../screens/user_profile';
import MyFollowersPost from '../screens/my_followers_post';
import Login from '../screens/login';
import Home from '../screens/home';
import Profile from '../screens/profile';
import SignUp from '../screens/signup';
import CreatePost from '../screens/create_post';
import { Route, Switch, useHistory } from 'react-router-dom';
import { UserContext } from '../App';

const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = store.get('user');
    if (user) {
      dispatch({ type: 'USER', payload: user }); // if the user again access the website without login
    } else {
      history.push('/login');
    }
  }, []);

  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/login'>
        <Login />
      </Route>
      <Route path='/signup'>
        <SignUp />
      </Route>
      <Route exact path='/profile'>
        <Profile />
      </Route>
      <Route path='/createpost'>
        <CreatePost />
      </Route>
      <Route path='/profile/:userId'>
        <UserProfile />
      </Route>
      <Route path='/myfollowerspost'>
        <MyFollowersPost />
      </Route>
    </Switch>
  );
};

export default Routing;
