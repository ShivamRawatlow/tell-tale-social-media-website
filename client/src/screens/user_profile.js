import React, { useEffect, useState, useContext } from 'react';
import axios from '../utils/axiosextension';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(undefined);
  const { userId } = useParams();
  const { state, dispatch } = useContext(UserContext);
  const [showFollow, setShowFollow] = useState(true);

  useEffect(() => {
    getUserProfile(setUserProfile, userId);
  }, [userId]);

  const getUserProfile = async (setUserProfile, userId) => {
    try {
      const res = await axios.get(`/user/${userId}`);
      const userProfile = res.data;
      setUserProfile(userProfile);

      const alreadyFollowed = userProfile.followers.find(
        (e) => e.sender === state._id
      );

      setShowFollow(alreadyFollowed);
    } catch (error) {
      console.log(error);
    }
  };

  const followUser = async (userId) => {
    try {
      const res = await axios.post(`/me/follow/${userId}`);
      const followers = res.data;
      const user = Object.assign({}, userProfile);
      user.followers = followers;
      setUserProfile(user);

      const newUserForState = Object.assign({}, state);
      newUserForState.followers = followers;
      dispatch({ type: 'USER', payload: newUserForState });
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (followId) => {
    try {
      const res = await axios.post(`/me/unfollow/${followId}`);
      const followers = res.data;

      const user = Object.assign({}, userProfile);
      user.followers = followers;
      setUserProfile(user);

      const newUserForState = Object.assign({}, state);
      newUserForState.followers = followers;
      dispatch({ type: 'USER', payload: newUserForState });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: '550px', margin: '0px auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              margin: '18px 0px',
              borderBottom: '1px solid grey',
            }}
          >
            <div>
              <img
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '80px',
                }}
                loading='lazy'
                src={userProfile.picUrl}
              />
            </div>
            <div>
              <h4>{userProfile.name}</h4>
              <h5>{userProfile.email}</h5>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '108%',
                }}
              >
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.followers.length} followers</h6>
                <h6>{userProfile.following.length} following</h6>
              </div>
              <button
                className='btn green'
                type='submit'
                name='action'
                onClick={() => {
                  const alreadyFollowed = userProfile.followers.find(
                    (e) => e.sender === state._id
                  );
                  if (!alreadyFollowed) {
                    setShowFollow(true);
                    followUser(userProfile._id);
                  } else {
                    setShowFollow(false);
                    unfollowUser(alreadyFollowed._id);
                  }
                }}
              >
                {showFollow ? 'unfollow' : 'follow'}
              </button>
            </div>
          </div>
          <div className='gallery'>
            {userProfile.posts.map((post) => {
              return (
                <img
                  className='item'
                  key={post._id}
                  src={post.picUrl}
                  alt={post.description}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </>
  );
};
export default Profile;
