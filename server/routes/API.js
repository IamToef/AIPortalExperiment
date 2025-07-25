import express from "express";
import axios from "axios";


const router = express.Router();

router.post('/get_result', async (req, res)=>{
  try {
    const response = await axios.post('http://127.0.0.1:8000/result', {
      paths:req.body.imagesPaths, 
      classes:req.body.classes
    });
    if(response?.data?.result && response.data.numeric){
      return res.json({status:true, result:response.data.result, numeric:response.data.numeric})
    }
    return res.json({status:false, error:"No result available"});
   
  } catch (error) {
    return res.json({status:false, error:"No result available"});
  }
 
})

export {router as apiRouter};