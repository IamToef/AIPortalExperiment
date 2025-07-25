import React, {useState, useEffect} from 'react';
import {Link, useLocation, useParams} from 'react-router-dom';
import ProjectItem from './ProjectItem';
import { url } from '../App';
import axios from 'axios';

const Projects = () => {
  const location = useLocation();
  const username = location.state.username;
  const customer_id = useParams().customer_id;
  const [projects, setProjects] = useState([]);

  useEffect(()=>{
    const getProjects = async ()=>{
      const response = await axios.get(`${url}/customer/${customer_id}/projects`);
      if (response.data.status) {
        setProjects(response.data.result);
      } else {
        alert(response.data.error);
      }
    }
    getProjects();
  }, []);

  return (
    <div>
      <div className="row bg-dark text-white fs-2 p-2">
        <div className='col text-white'>
          <i className='bi bi-robot'></i>
          <span className='ms-4'>MinTek</span>
        </div>
        <div className='col d-flex justify-content-end'>
          <div className="dropdown me-2">
            <button className="btn btn-dark dropdown-toggle h-100 fs-4" type="button" id="productMenu" data-bs-toggle="dropdown">
              {username}
            </button>
            <ul className="dropdown-menu fs-4" aria-labelledby="productMenu">
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><a className="dropdown-item" href="#">Signout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row d-flex justify-content-between p-2">
        <div className='col-2 text-center fs-2'>Projects</div>
        <div className='col-3 btn btn-dark d-flex align-items-center justify-content-center me-4 fs-4'>
          <i className='bi bi-cloud-plus me-4'></i>
          <Link to='create' state={{username: location.state.username}} className='text-decoration-none text-white'>Create New Project</Link>
        </div>
      </div>
      <hr/>
      <div className="row d-flex flex-wrap px-4">
        {projects.map(proj=><ProjectItem key={proj.id} projId={proj.id} projName={proj.name} typeId={proj.type_id}/>)}
      </div>
    </div>
  )
}

export default Projects