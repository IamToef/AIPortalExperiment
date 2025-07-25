import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import App, { url } from '../App';
import ImageSlider from './ImageSlider';
import { AppLoadding } from './AppLoadding';

const Analyze = () => {
  // [{idx:0, path:'xxx'}, {...}]

  const [loadding, setLoadding] = useState(false);
  const [results, setResults] = useState([]);
  const [numeric, setNumeric] = useState([]);
  const userId = useParams().customer_id;
  const projectId = useParams().projId;

  // useEffect(()=>{
  //   const fetchResult = async () =>{
  //     const fetchResult = await axios.get(`${url}/customer/${userId}/projects/${projectId}/results`)
  //     if(fetchResult.data.status ) {
  //       let tmp = fetchResult.data.result.map((res,i)=>({
  //         idx: i,
  //         path: `${url}/${res.result}`
  //       }));
  //       setResults(tmp);
  //     }
  //   }
  //   fetchResult();

  // }, [])

  const handleSubmit = async (event) => {
    try {
      setLoadding(true);
      event.preventDefault();

      // delete existing results
      const customerInfo = await axios.get(`${url}/customer/${userId}`);
      const projectInfo = await axios.get(`${url}/customer/${userId}/projects/${projectId}`);
      let values = {
        username: customerInfo.data.result[0].username,
        projName: projectInfo.data.result[0].name
      };
      const deleteResult = await axios.delete(`${url}/customer/${userId}/projects/${projectId}/results`, { data: values })
      if (deleteResult.status) {
        console.log("Delete result successfully")
      }

      const imagesResult = await axios.get(`${url}/customer/${userId}/projects/${projectId}/images`)
      const classes = await axios.get(`${url}/customer/${userId}/projects/${projectId}/classes`)
      let tmpImagesPaths = imagesResult.data.result.map(img => img.path);
      console.log(tmpImagesPaths);
      console.log(classes.data.result);
      const tmpResults = await axios.post(`${url}/api/get_result`, {
        imagesPaths: tmpImagesPaths,
        classes: classes.data.result
      });
      // // update result column in images db
      imagesResult.data.result.forEach(async (tmp, i) => {
        await axios.put(`${url}/customer/${userId}/projects/${projectId}/result/${tmp.id}`, {
          resultPath: tmpResults.data.result[i]
        });
      })

      // for resulting images
      let tmp = [];
      tmpResults.data.result.forEach((res, i) => {
        tmp.push({ idx: i, path: `${url}/${res}` })
      })
      setResults(tmp);
      setNumeric(tmpResults.data.numeric);
    } catch (error) {

    } finally {
      setLoadding(false)
    }

  }

  return (
    <div style={{ position: "relative" }}>
      <AppLoadding isLoading={loadding} >
        <div className="d-flex justify-content-center">
          <form className='col-12 vh-100 p-4' onSubmit={handleSubmit} >
            <div className='d-flex justify-content-end align-items-center mb-4'>
              <button type='submit' className={`btn btn-light border rounded `}>Analyze Images</button>
            </div>

            <div>
              {results && results.length > 0 ? <ImageSlider imgs={results} numeric={numeric} /> : <></>}
            </div>

          </form>
        </div>
      </AppLoadding>
    </div>
  )
}

export default Analyze