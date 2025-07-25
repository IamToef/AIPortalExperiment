import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { url } from '../App';
import axios from 'axios';

const Classes = () => {
  const userId = useParams().customer_id;
  const projectId = useParams().projId;
  const [newClass, setNewClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchClasses = async ()=>{
      let result = await(axios.get(`${url}/customer/${userId}/projects/${projectId}/classes`));
      if(result.data.status) {
        setClasses(result.data.result || []);
      } else {
        alert(result.data.error);
      }
    };
    fetchClasses();    
  }, []);

  const handleAddClass = () =>{
    if (newClass==='') {
      setError("Class name cannot be empty");
    }
    else if(classes.map(cl=>cl.className).includes(newClass)) {
      setError("Class name already exists");
    } else {
      let tmpClasses = [];
      setError('');
      let classArray = newClass.split(',').map(cl=>cl.replace('\r',''));
      classArray.forEach(cl=>{
        var tmp = Math.floor(Math.random()*16777215).toString(16)
        if (tmp.length==4) {
          tmp += "00";
        } else if (tmp.length==5) {
          tmp += "0"
        }
        var randomColor = "#"+tmp;
        tmpClasses.push({color:randomColor, className:cl})
      })
      setClasses([...classes, ...tmpClasses])
      setNewClass('');
    }
  };

  const handleUpload = (event)=>{
    const uploadTxt = event.target.files[0];
    var reader = new FileReader();
    reader.onload = ()=>{
      setNewClass(reader.result.replaceAll('\n', ','));
    };
    reader.readAsText(uploadTxt)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result_delete = await axios.delete(`${url}/customer/${userId}/projects/${projectId}/classes`);
    if (result_delete.data.status) {
      console.log("Delete classes successfully");
      const result_insert = await axios.post(`${url}/customer/${userId}/projects/${projectId}`, {'classes': classes});
      if(result_insert.data.status) {
        console.log("Insert classes successfully");
        navigate("../upload");
      } else {
        alert(result.data.error);
      }
    } else {
      alert(result.data.error);
    }
  }

  const handleDelete = (event)=>{

    console.log(event.target.id)
    setClasses(classes.filter(cl=> cl.className !== event.target.parentNode.id));
  };


  return (
    <div className="d-flex justify-content-center">
      <form className='col-10 vh-100 p-4' onSubmit={handleSubmit}>
        <div className='d-flex justify-content-end mb-4'>
          <button type='submit' className='btn btn-primary border rounded'>Save and Continue</button>
        </div>
        <div className='text-warning'>{error && error}</div>
        <div className='d-flex flex-column rounded border-start border-end p-4 h-90'>
          <h3>Classes</h3>
          <div className='text-secondary mb-1'>Add a comma separated list of class names</div>
          <input type='text' name='classes' placeholder='cat, dog,...' className='mb-2' value={newClass}
          onChange={(e)=>setNewClass(e.target.value)}/>
          <div className='d-flex justify-content-start py-2'>
            <button type="button" className='btn btn-primary rounded me-4' onClick={handleAddClass}>Add Classes</button>
            <input type="file" id="uploadTxtButton" hidden
            onChange={handleUpload}/>
            <label htmlFor="uploadTxtButton" className='btn btn-secondary rounded border'>Upload Classes Txt</label>
          </div>
          {
            classes.map((oneClass)=>{
              return (
                <div id={oneClass.className} key={oneClass.className} className='d-flex my-2 py-1 align-items-center border-bottom'>
                  <div className="rounded border" style={{width:"20px", height:"20px", backgroundColor:oneClass.color}}></div>
                  <div className='ms-2'>{oneClass.className}</div>
                  <div className='btn btn-sm btn-danger ms-auto' type="button"
                  onClick={handleDelete}>
                    <i className='bi bi-trash text-white'></i>
                  </div>
                </div>
              );
            })
          }
        </div>
      </form>
      

    </div>
  )
}

export default Classes