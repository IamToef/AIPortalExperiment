import React from 'react';
import Navbar from './Navbar';

const Home = () => {
  return (
    <>
    <Navbar />
    <div className="container d-flex justify-content-center col-12 mt-4">
      <div className="d-flex flex-column justify-content-center me-4 col-4 py-4">
        <h1 className='py-4'>Computer vision services</h1>
        <p className='py-2-2'>Analyze images to provide computer vision results. Use professionally in the industry. This webpage is only a trial version </p>
        <div className='btn btn-primary btn-lg mt-2'>
          Getting started
        </div>
      </div>
      <div className="col-4 d-flex justify-content-center">
        <img src="homeImg.jpg" width="300" height="500" className='rounded'></img>
      </div>
    </div>
    </>
  )
};

export default Home;