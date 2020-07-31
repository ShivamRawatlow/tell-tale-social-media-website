import React from 'react';

const Gallery = ({ profile }) => {
  return (
    <div className='container' style={{ width: '100%', maxWidth: 'initial' }}>
      <div className='row' style={{ margin: '0' }}>
        {profile.posts.map((post) => {
          return (
            <div className='col m4 s10 center-align' key={post._id}>
              <p>{post.description}</p>
              <img
                className='item'
                src={post.picUrl}
                alt={post.description}
                style={{
                  height: '180px',
                  width: '170px',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
