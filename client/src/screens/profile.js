import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import axios from '../utils/axiosextension';
import uploadPic from '../utils/upload_pic';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');
const getMyProfile = async (setMyProfile) => {
  try {
    const res = await axios.get('/me');
    const myProfile = res.data;
    setMyProfile(myProfile);
  } catch (error) {
    console.log(error);
  }
};

const Profile = () => {
  const [myProfile, setMyProfile] = useState(undefined);
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const [picData, setPicData] = useState('');
  const [picFileData, setPicFileData] = useState([]);

  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    getMyProfile(setMyProfile);
  }, []);

  const updateProfilePic = async (pic) => {
    const picUrl = await uploadPic(pic);

    const res = await axios.patch('/me', {
      picUrl,
    });

    const newMyProfile = Object.assign({}, myProfile);
    newMyProfile.picUrl = res.data.picUrl;
    setMyProfile(newMyProfile);

    const newUserForState = Object.assign({}, state);
    newUserForState.picUrl = res.data.picUrl;

    dispatch({ type: 'USER', payload: newUserForState });
  };

  return (
    <>
      {myProfile ? (
        <div style={{ maxWidth: '550px', margin: '0px auto' }}>
          <Modal
            isOpen={modelIsOpen}
            onRequestClose={() => setModelIsOpen(false)}
            style={customStyles}
          >
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <h2>
                Do you want to set this <br />
                pic as your profile picture?
              </h2>
              <div>
                <img
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '80px',
                  }}
                  loading='lazy'
                  src={picData}
                />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <div>
                <button
                  className='btn green'
                  name='action'
                  onClick={() => {
                    URL.revokeObjectURL(picData);
                    updateProfilePic(picFileData[0]);
                    setModelIsOpen(false);
                  }}
                >
                  Yes
                </button>
              </div>
              <div>
                <button
                  className='btn green'
                  name='action'
                  onClick={() => {
                    URL.revokeObjectURL(picData);
                    setModelIsOpen(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </Modal>

          <div style={{ margin: '18px 0px', borderBottom: '1px solid grey' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <div>
                <img
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '80px',
                  }}
                  src={myProfile.picUrl}
                />
              </div>
              <div>
                <h4>{state ? state.name : 'loading'}</h4>
                <h5>{state ? state.email : 'loading'}</h5>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '108%',
                  }}
                >
                  <h6>{myProfile.posts.length} posts</h6>
                  <h6>{myProfile.followers.length} followers</h6>
                  <h6>{myProfile.following.length} following</h6>
                </div>
              </div>
            </div>

            <div
              style={{ margin: '10px 0px 10px 42px' }}
              className='file-field input-field'
            >
              <div className='btn green'>
                <i class='material-icons'>add_a_photo</i>
                <input
                  type='file'
                  onChange={(e) => {
                    const fileData = e.target.files[0];
                    setPicFileData(e.target.files);
                    const urlData = URL.createObjectURL(fileData);
                    setPicData(urlData);
                    setModelIsOpen(true);
                  }}
                />
              </div>
              <div className='file-path-wrapper'>
                <input className='file-path validate' type='text' />
              </div>
            </div>
          </div>

          <div className='gallery'>
            {myProfile.posts.map((post) => {
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
