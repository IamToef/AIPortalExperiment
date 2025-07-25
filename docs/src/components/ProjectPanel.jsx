import React from 'react';
import {Outlet, Link, NavLink, useLocation} from "react-router-dom";

const ProjectPanel = () => {
  let location = useLocation();
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto col-2 px-0 px-md-2 bg-dark d-flex flex-column align-items-center vh-100 ">
          <Link to="/" className='fs-4 text-white text-decoration-none w-100 ps-3'>
            <i className='bi bi-robot'></i>
            <span className='ms-2'>MinTek</span>
          </Link>
          <hr />
          <ul className="nav nav-pills flex-column w-100">
            <li className='my-1'>
              <NavLink to="classes" className={`nav-link text-white py-3 ${location.pathname.includes('classes') ? 'active': ''}`} >
                <i className="bi bi-card-list"></i>
                <span className="ms-2">Classes</span>
              </NavLink>
            </li>
            <li className='my-1'>
              <NavLink to="upload" className={`nav-link text-white py-3 ${location.pathname.includes('upload') ? 'active': ''}`}>
                <i className="bi bi-cloud-arrow-up"></i>
                <span className="ms-2">Upload</span>
              </NavLink>
            </li>
            <li className='my-1'>
              <NavLink to="analyze" className={`nav-link text-white py-3 ${location.pathname.includes('analyze') ? 'active': ''}`}>
                <i className="bi bi-cloud-arrow-up"></i>
                <span className="ms-2">Analyze</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className='col m-0 p-0'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default ProjectPanel