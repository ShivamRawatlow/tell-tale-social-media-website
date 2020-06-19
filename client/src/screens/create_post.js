import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';
import checkExtension from '../utils/check_file_type';
import uploadPic from '../utils/upload_pic';
import axios from '../utils/axiosextension';
import useSpinner from '../utils/spinner';

const CreatePost = () => {
  const [spinner, showSpinner, hideSpinner] = useSpinner();
  const history = useHistory();
  const [description, setBody] = useState('');
  const [pic, setPic] = useState('');
  const [picData, setPicData] = useState('');
  const [showImageDiv, setShowImageDiv] = useState(false);

  const sendPostData = async (description, pic) => {
    try {
      showSpinner();
      const picUrl = await uploadPic(pic);

      if (!picUrl) {
        return new Error('Image was not uploaded');
      }

      const res = await axios.post('/me/post', {
        description,
        picUrl,
      });

      if (res.status === 201) {
        M.toast({ html: 'post created' });
        history.push('/');
      }
    } catch (error) {
      hideSpinner();
      console.log(error.message);
      M.toast({
        html: 'Something went wrong',
        classes: '#c62828 red darken-3',
      });
    }
  };

  const submitPost = async () => {
    if (!pic) {
      M.toast({ html: 'no file uploaded' });
      return;
    }

    const ext_error = checkExtension(pic);

    if (ext_error) {
      M.toast({ html: ext_error.message });
      return;
    }

    sendPostData(description, pic);
  };

  return (
    <>
      <div
        className='card input-filed'
        style={{
          margin: '30px auto',
          maxWidth: '500px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <input
          type='text'
          placeholder='body'
          value={description}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className='file-field input-field'>
          <div className='btn green'>
            <span>Upload Image</span>
            <input
              type='file'
              onChange={(e) => {
                const fileData = e.target.files[0];
                const urlData = URL.createObjectURL(fileData);
                setPicData(urlData);
                setShowImageDiv(true);
                setPic(fileData);
              }}
            />
          </div>
          <div className='file-path-wrapper'>
            <input className='file-path validate' type='text' />
          </div>
        </div>
        {showImageDiv ? (
          <div>
            <img
              style={{
                width: '300px',
                height: '300px',
              }}
              src={picData}
            />
          </div>
        ) : null}
        <button
          className='btn green'
          type='submit'
          name='action'
          onClick={() => submitPost()}
        >
          CreatePost
        </button>
      </div>
      {spinner}
    </>
  );
};

export default CreatePost;
