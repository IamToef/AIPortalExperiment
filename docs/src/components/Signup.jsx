import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {url} from "../App.jsx";
import {Link} from 'react-router-dom';

const Signup = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    retyped_password: "",
  })
  const [error, setError] = useState();
  const [back, setBack] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event)=>{
    event.preventDefault();
    // Check if password retyped correctly
    if(values.password !== values.retyped_password) {
      setError("Passwords mismatched");
      return;
    }
    axios.get(`${url}/auth/customer`)
    .then((result)=>{
      if(result.data.status) {
        const customers_names = []
        const customers_emails = []
        result.data.result.forEach((customer)=>customers_names.push(customer.username));
        result.data.result.forEach((customer)=>customers_emails.push(customer.email));
        if (customers_names.includes(values.username)) {
          setError("Username already chosen");
          setBack(true);
        } else if(customers_emails.includes(values.email)) {
          setError("Email already registered");
          setBack(true);
        } else {
          axios.post(`${url}/auth/add_customer`, values)
          .then(result=>{
            if(result.data.status) {
              navigate('/');
            } else {
              setError(result.data.error);
            }
          })
        }
      } else {
        alert(result.data.error)
      }
    })
    .catch(error=>{
      console.log(error);
    });
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 bg-secondary'>
      <div className='col-3 h-35 rounded border'>
        <div className='text-white bg-dark rounded border text-center'>
          <h2>Register Page</h2>
        </div>
        <div className='p-3 bg-white'>  
          <div className='text-warning'>
            {error && <span>{error && error}. </span>}
            {back && <span>Return to <Link to='/login'>login</Link></span>}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className='mb-1'><strong>Username:</strong></label>
              <input type="text" id="username" placeholder='Enter Username' required autoComplete='false'
              className='form-control' onChange={(e)=>setValues({...values, username:e.target.value})}/>
            </div>
            <div className='mb-3'>
              <label htmlFor="email" className='mb-1'><strong>Email:</strong></label>
              <input type="email" id="email" placeholder='Enter Email' required autoComplete='false'
              className="form-control" onChange={(e)=>setValues({...values, email:e.target.value})}/>
            </div>
            <div className='mb-3'>
              <label htmlFor="password" className='mb-1'><strong>Password:</strong></label>
              <input type="password" id="password" placeholder='Enter Password' required autoComplete='false'
              className='form-control' onChange={(e)=>setValues({...values, password:e.target.value})}
              />
            </div>

            <div className='mb-3'>
              <label htmlFor="password-retype" className='mb-1'><strong>Retype password:</strong></label>
              <input type="password" id="password-retype" placeholder='Retype Your Password' required autoComplete='false'
              className='form-control' onChange={(e)=>setValues({...values, retyped_password:e.target.value})}
              />
            </div>
            
            <div className='mb-3'>
              <input type="checkbox" name="tick" id="tick" className='me-2' required
              />
              <label htmlFor="tick">You agree with our terms & conditions</label>
            </div>

            <button className='btn btn-primary w-100 mb-3'>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup