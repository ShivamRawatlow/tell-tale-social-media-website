import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import App, { UserContext } from '../App';
import axios from '../utils/axiosextension';

const PostComponent = ({ item, setData, data }) => {
  const { state } = useContext(UserContext);

  const [alreadyLiked, setAlreadyLiked] = useState(false);

  useEffect(() => {
    likeCheck();
  }, []);

  const refreshPost = (post) => {
    const newData = data.map((item) => {
      if (item._id === post._id) {
        return post;
      } else {
        return item;
      }
    });
    setData(newData);
  };

  const likePost = async (post) => {
    try {
      const res = await axios.post(`/me/like/${post._id}`);
      const likes = res.data;
      const newPost = Object.assign({}, post);
      newPost.likes = likes;
      refreshPost(newPost);
    } catch (error) {
      console.log(error);
    }
  };

  const unlikePost = async (likeId, post) => {
    try {
      const res = await axios.post(`/me/unlike/${likeId}`);
      const likes = res.data;
      const newPost = Object.assign({}, post);
      newPost.likes = likes;
      refreshPost(newPost);
    } catch (error) {
      console.log(error);
    }
  };

  const makeComment = async (post, description) => {
    try {
      const res = await axios.post(`/me/comment`, {
        postId: post._id,
        description,
      });
      const comments = res.data;
      const newPost = Object.assign({}, post);
      newPost.comments = comments;
      refreshPost(newPost);
    } catch (error) {}
  };

  const deletePost = async (postId) => {
    try {
      const res = await axios.delete(`/me/post/${postId}`);
      const newData = data.filter((item) => {
        return item._id !== res.data._id;
      });

      setData(newData);
    } catch (error) {}
  };

  const deleteComment = async (commentId, post) => {
    try {
      const res = await axios.delete(`/me/post/comment/${commentId}`);
      const comments = post.comments.filter((comment) => {
        return comment._id !== res.data._id;
      });
      const newPostObject = Object.assign({}, post);
      newPostObject.comments = comments;
      refreshPost(newPostObject);
    } catch (error) {}
  };

  const likeCheck = () => {
    const alreadyLiked = item.likes.find((e) => e.sender === state._id);
    if (!alreadyLiked) {
      setAlreadyLiked(false);
    } else {
      setAlreadyLiked(true);
    }
  };

  return (
    <div className='card home-card'>
      <div className='container' style={{ width: '100%', maxWidth: 'initial' }}>
        <div className='row valign-wrapper' style={{ margin: '0' }}>
          <div
            className='col s2'
            style={{ marginTop: '.5rem', height: '100%' }}
          >
            <img
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '40px',
                padding: '.2rem',
              }}
              src={item.owner.picUrl}
            />
          </div>
          <div className='col s8 center-align' style={{ height: '100%' }}>
            <Link
              style={{
                height: '100%',
                color: 'black',
              }}
              to={
                item.owner._id !== state._id
                  ? `/profile/${item.owner._id}`
                  : `/profile`
              }
            >
              <h5>{item.owner.name}</h5>
            </Link>
          </div>
          <div className='col s2' style={{ height: '100%' }}>
            {item.owner._id === state._id && (
              <i
                className='material-icons'
                style={{ float: 'right' }}
                onClick={() => deletePost(item._id)}
              >
                delete
              </i>
            )}
          </div>
        </div>
      </div>

      <div className='card-image' style={{ padding: '1rem' }}>
        <img src={item.picUrl} alt='image' />
      </div>

      <div className='card-content'>
        <p>
          <strong>{item.description}</strong>
        </p>
        <div
          style={{
            margin: '5px 5px',
            borderBottom: '1px solid grey',
          }}
        />
        <div style={{ display: 'box' }}>
          <i
            className='material-icons'
            style={{ color: 'red' }}
            onClick={() => {
              const alreadyLiked = item.likes.find(
                (e) => e.sender === state._id
              );
              if (!alreadyLiked) {
                likePost(item);
                setAlreadyLiked(true);
              } else {
                unlikePost(alreadyLiked._id, item);
                setAlreadyLiked(false);
              }
            }}
          >
            {alreadyLiked ? 'favorite' : 'favorite_border'}
          </i>
          <h6
            style={{
              display: 'inline',
            }}
          >
            {item.likes.length}
          </h6>
        </div>
        <div>
          {item.comments.map((comment) => {
            return (
              <h6 key={comment._id} style={{ wordWrap: 'break-word' }}>
                <span style={{ fontWeight: '500' }}>
                  {comment.sender.name + ' :    '}
                </span>
                {comment.description}
                {comment.sender._id === state._id && (
                  <i
                    className='material-icons'
                    style={{ float: 'right' }}
                    onClick={() => deleteComment(comment._id, item)}
                  >
                    delete
                  </i>
                )}
              </h6>
            );
          })}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            makeComment(item, e.target[0].value);
            e.target[0].value = '';
          }}
        >
          <input type='text' placeholder='add comment' />
        </form>
      </div>
    </div>
  );
};

export default PostComponent;
