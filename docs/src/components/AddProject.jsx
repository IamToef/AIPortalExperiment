import axios from 'axios';
import React, {useState ,useEffect} from 'react';
import {useLocation, useParams, useNavigate} from "react-router-dom";
import {url} from "../App.jsx";
import "../index.css"

const AddProject = () => {
  let {state} = useLocation();
  let userId = useParams().customer_id;
  let [projectTypes, setProjectTypes] = useState([]);
  let [project, setProject] = useState({
    name: '',
    type_id: '1'
  });
  const navigate = useNavigate();

  useEffect(()=>{
    const getProjectTypes = async () =>{
      let result = await axios.get(`${url}/auth/project`);
      if(result.data.status) {
        setProjectTypes(result.data.result);
      } else {
        alert(result.data.error);
      }
    }
    getProjectTypes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let user_result = await axios.get(`${url}/customer/${userId}`);
    if (user_result.data.status) {
      let result = await axios.post(`${url}/customer/${userId}/projects`, {
        'projName': project.name,
        'username': user_result.data.result[0].username,
        'type_id': project.type_id
      });
      if(result.data.status) {
        navigate(-1);
      } else {
        alert(result.data.error);
      }
    }
  }

  return (
    <div>
      <div className="bg-dark text-white p-2">
        <i className="bi bi-robot fs-2"></i>  
        <span className="fs-2 ms-2">MinTek</span>
      </div>  
      <div className='d-flex justify-content-center w-100'>
        <div className='w-75 py-4'>
          <h2>Let's create your project</h2>
          <div className='text-secondary'>{state.username}</div>
          <form className='mt-4 form-label' onSubmit={handleSubmit}>
            <div>
              <label htmlFor="projectName" className='mb-1'>Project Name</label>
              <input type='text' id='projectName' placeholder='Enter Name For Project' className='form-control border rounded'
              onChange={e=>setProject({...project, name:e.target.value})}>
              </input>
            </div>
            <div>
              <label htmlFor='projectType' className='form-label'>Project Type</label>
              <select name='projectType' id='projectType' className='form-select' onChange={e=>setProject({...project, type_id:e.target.value})}>
                {projectTypes.map(project=><option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </div>
            <div className='d-flex justify-content-center my-4'>
              <button className='btn btn-dark w-25 mx-4'>Create Project</button>
              <button className='btn btn-light w-25'>Cancel</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default AddProject;