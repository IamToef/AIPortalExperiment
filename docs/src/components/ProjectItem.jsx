import React, {useState, useEffect} from 'react';
import { url } from '../App';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProjectItem = ({projId, projName, typeId}) => {
  const [projType, setProjType] = useState('');

  useEffect(()=>{
    axios.get(`${url}/auth/project/${typeId}`)
    .then(result=>{
      if(result.data.status) {
        setProjType(result.data.result[0].name);
      } else {
        alert(result.data.error);
      }
    })
  }, [])

  return (
    <div className='w-25 m-4 border rounded btn d-flex justify-content-center'>
      <div className='p-2 d-flex align-items-center justify-content-center'>
        <i className='bi bi-robot fs-1'></i>
      </div>
      
      <Link to={`${projId}`} className='col btn'>
        <div className='text-secondary'>{projType}</div>
        <h2>{projName}</h2>
      </Link>
    </div>
  )
}

export default ProjectItem