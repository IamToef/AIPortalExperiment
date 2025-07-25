import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='d-flex flex-column flex-md-row justify-content-between bg-dark p-2'>
      <div className='text-white col-3 fs-2 ps-4 d-none d-md-inline'>
        <i className='bi bi-robot'></i>
        <span className='ms-4'>MinTek</span>
      </div>

      <div className='d-flex flex-column flex-md-row justify-content-center col-6'>
        <div className="dropdown me-2">
          <button className="btn btn-dark dropdown-toggle h-100 fs-4" type="button" id="productMenu" data-bs-toggle="dropdown">
            Products
          </button>
          <ul className="dropdown-menu fs-4" aria-labelledby="productMenu">
            <li><a className="dropdown-item" href="#">Dashboard</a></li>
            <li><a className="dropdown-item" href="#">Shop</a></li>
          </ul>
        </div>
        <button className='btn btn-dark me-2 fs-4'>
          Price
        </button>
        <button className='btn btn-dark fs-4'>
          Docs
        </button>
      </div>

      <div className='col-3 d-flex justify-content-center'>
        <Link to="/login" className='btn btn-dark border-light fs-4'>
          <span className='pe-2'>Sign in</span>
          <i className='bi bi-arrow-right'></i>
        </Link>
      </div>
    </div>
    
  )
}

export default Navbar