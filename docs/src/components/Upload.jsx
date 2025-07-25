import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../App';
import { AppLoadding } from './AppLoadding';

const Upload = () => {
  // to fetch to server
  const [images, setImages] = useState([]);
  const [loadding, setLoadding] = useState(false);
  // to display
  const [thumbnails, setThumbnails] = useState([]);
  const userId = useParams().customer_id;
  const projectId = useParams().projId;
  const navigate = useNavigate();

  const convertImgToFileType = async (path) => {
    const response = await fetch(path);
    const contentType = response.headers.get('content-type');
    const blob = await response.blob();
    const file = new File([blob], path, { contentType });
    return file;
  }

  useEffect(() => {
    // const fetchImages = async () => {
    //   const result = await axios.get(`${url}/customer/${userId}/projects/${projectId}/images`);
    //   console.log("result", result);
    //   if (result.data.status) {
    //     const tmpImagesPaths = result.data.result.map((oneImg) => oneImg.path);
    //     let tmpThumbnails = []
    //     let tmpImages = []
    //     tmpImagesPaths.forEach(async (oneImgPath, idx) => {
    //       tmpThumbnails.push({ id: idx, content: `${url}/${oneImgPath}` });
    //       tmpImages.push({ id: idx, content: await convertImgToFileType(`${url}/${oneImgPath}`) });
    //     });

    //     setImages(tmpImages)
    //   }
    // }
    // fetchImages();
  }, [])

  const handleChooseImages = (event) => {
    let imgList = []
    for (let i = 0; i < event.target.files.length; i++) {
      imgList.push({ id: i, content: event.target.files[i] })
    }
    setImages(imgList);
  };

  const handleRemoveImg = (image) => {
    setImages(images.filter(img => image.id != img.id));
  }

  const handleSubmit = async (event) => {
    try {
      setLoadding(true);
      event.preventDefault();
      const customerInfo = await axios.get(`${url}/customer/${userId}`);
      const projectInfo = await axios.get(`${url}/customer/${userId}/projects/${projectId}`);
      let values = {
        username: customerInfo.data.result[0].username,
        projName: projectInfo.data.result[0].name
      };
      // Delete old images from folder and db
      await axios.delete(`${url}/customer/${userId}/projects/${projectId}/images`, { data: values });
      // Upload new images
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i].content);
        formData.append("username", customerInfo.data.result[0].username);
        formData.append("projName", projectInfo.data.result[0].name)
      }
      const result_upload = await axios.post(`${url}/customer/${userId}/projects/${projectId}/upload_images`, formData);
      if (result_upload.data.status) {
        values = { ...values, files: result_upload.data.result }
        const result_insert_db = await axios.post(`${url}/customer/${userId}/projects/${projectId}/images`, {
          data:
            values
        });
        if (result_insert_db.data.status) {
          console.log(result_insert_db.data);
        } else {
          alert(result_insert_db.data.error)
        }
      } else {
        alert(result_upload.data.error);
      }
      navigate('../analyze');

    } catch (err) {
      console.log(err);
    } finally {
      setLoadding(false);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <AppLoadding isLoading={loadding} >
        <div className="d-flex justify-content-center">
          <form className='col-10 vh-100 p-4' onSubmit={handleSubmit} >
            <div className='d-flex justify-content-end mb-4'>
              <input type='file' id='chooseImagesButton' hidden onChange={handleChooseImages} multiple />
              <label htmlFor='chooseImagesButton' className='btn btn-primary border rounded me-4'>Choose Images</label>
              <button type='submit' className={`btn btn-light border rounded ${(thumbnails.length + images.length == 0) ? 'disabled' : ''}`}>Upload Images</button>
            </div>
            <div className='d-flex flex-wrap rounded border-start border-end p-4 h-90'>
              {
                images.map(image => {
                  return (
                    <div id={image.id} key={image.id} className='m-2' style={{ position: "relative" }}>
                      <img style={{ width: "100px", height: "100px" }} alt="" src={URL.createObjectURL(image.content)} className='border rounded' />
                      <div style={{ width: "15px", height: "15px", position: "absolute", top: "5px", right: "5px" }}
                        onClick={() => handleRemoveImg(image)} className='btn d-flex align-items-center justify-content-center bg-danger'>
                        <i className='bi bi-trash text-white' style={{ fontSize: "8px" }}></i>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </form>
        </div>
      </AppLoadding>
    </div>
  )
}

export default Upload