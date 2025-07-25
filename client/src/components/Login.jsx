import React, {useState, useEffect} from 'react'
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import {url} from "../App.jsx";

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(()=>{
    async function verify() {
      let result = await axios.get(`${url}/verify`);
      if(result.data.status) {
        if(result.data.role ==="admin") {
          navigate("/auth/dashboard")
        } else {
          navigate(`/${result.data.customer_id}`, {state: {username: result.data.username}});
        }
      }
    }
    verify();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("HEREH")
    axios.post(`${url}/customer/customer_login`, values)
    .then(result =>{
      if(result.data.status) {
        navigate(`/${result.data.customer_id}`, {state:{username:result.data.username}});
      } else {
        setError(result.data.error);
      }
    })
    .catch(error=>console.log("error"))
  }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 bg-secondary'>
      <div className='col-3 h-35 rounded border'>
        <div className='text-white bg-dark rounded border text-center'>
          <h2>Login Page</h2>
        </div>
        <div className='p-3 bg-white'>  
          <div className='text-warning'>
            {error && error}
          </div>
          <form onSubmit={handleSubmit}>
            <div className='mb-2'>
              <label htmlFor="email"><strong>Email:</strong></label>
              <input type="email" id="email" placeholder='Enter Email' required autoComplete='false'
              className="form-control" onChange={(e)=>setValues({...values, email:e.target.value})}/>
            </div>
            <div className='mb-4'>
              <label htmlFor="password"><strong>Password:</strong></label>
              <input type="password" id="password" placeholder='Enter Password' required autoComplete='false'
              className='form-control' onChange={(e)=>setValues({...values, password:e.target.value})}
              />
            </div>
            <button className='btn btn-primary w-100 mb-4'>
              Login
            </button>
            <div>
              Do not have an account? <Link to='/signup'>Register</Link> here!
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login