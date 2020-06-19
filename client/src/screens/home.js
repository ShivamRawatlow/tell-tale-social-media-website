import React, { useState, useEffect, useContext } from 'react';
import axios from '../utils/axiosextension';
import App, { UserContext } from '../App';
import '../App.css';
import PostComponent from '../components/post_component';

const getPosts = async (setData) => {
  const res = await axios.get('/post/allposts');
  const data = res.data;
  setData(data);
};

const Home = () => {
  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    getPosts(setData);
  }, []);

  return (
    <>
      {state ? (
        <div className='home'>
          {data.map((item) => {
            return (
              <div key={item._id}>
                <PostComponent item={item} setData={setData} data={data} />
              </div>
            );
          })}
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </>
  );
};
export default Home;
