import React from 'react';
import { BounceLoader } from 'react-spinners';
import '../App.css';

const FullPageLoader = () => {
  return (
    <div className='fp-container'>
      <div className='fp-loader'>
        <BounceLoader color='green' />
      </div>
    </div>
  );
};

export default FullPageLoader;
