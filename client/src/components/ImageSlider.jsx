import React, {useState} from "react";
import Table from "./Table";

function ImageSlider(props){
  const [sliderData, setSliderData] = useState(props.imgs[0]);
  const [numericData, setNumericData] = useState(props.numeric[0]);
  
  const handleClick=(i) => {
    const slider = props.imgs[i];
    setSliderData(slider);
    setNumericData(props.numeric[i])
  }

  return (
    <div className="d-flex flex-row">
      <div className="d-flex flex-column" style={{ overflowY:"scroll"}}>
        {
          props.imgs.map(
            (img, i)=>
            <div key={i} className={`me-2 mb-2 ${i==sliderData.idx?"clicked":""}`} onClick={()=>handleClick(i)}>
              <img key={img.idx} src={img.path} height="70" width="100"
              className={`border rounded`}/>
            </div>
          )
        }
      </div>
      <div className="d-flex col-8 justify-content-center align-items-center border rounded">
        <div className={`btn btn-light me-auto d-flex align-items-center ${sliderData.idx==0?"disabled":""}`} onClick={()=>{
          setSliderData(props.imgs[sliderData.idx-1]);
          setNumericData(props.numeric[sliderData.idx-1])
        }}
        >
          <i className="bi bi-caret-left"></i>
        </div>
        <img src={sliderData.path}  height="400px" style={{objectFit: "fill"}}/>
        
        <div className={`btn btn-dark ms-auto ${sliderData.idx==props.imgs.length-1?"disabled":""}`} onClick={()=>{
          setSliderData(props.imgs[sliderData.idx+1]);
          setNumericData(props.numeric[sliderData.idx+1])
          }}
        >
          <i className="bi bi-caret-right vh-100"></i>
        </div>
      </div>
      <Table numeric={numericData}/>
    </div>
  )
}

export default ImageSlider;
