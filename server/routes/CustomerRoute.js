import express from 'express';
import {con} from '../index.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import multer from 'multer';
import path from "path";
import dotenv from "dotenv";
import fs from 'fs';

dotenv.config()
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, `${process.env.TMP_LOC}`);
  },
  filename: (req, file, cb)=>{
    cb(null, file.originalname);
  }
});
const upload = multer({storage:storage});

router.get('/:id', (req, res)=>{
  const id = req.params.id;
  const sql = `SELECT * FROM customer WHERE id=?`;
  con.query(sql, [id], (err, result)=>{
    if(err) return res.json({status:false, error:"Customer id not exist"});
    return res.json({status:true, result:result})
  })
})

router.get('/:id/projects', (req, res)=>{
  const userId = req.params.id;
  const sql = `SELECT * FROM projects WHERE user_id=(?)`;
  con.query(sql, [userId], (err, result)=>{
    if(err) return res.json({status:false, error:`Query projects of customer ${userId} fails`});
    return res.json({status:true, result:result});
  });
});

router.get('/:userId/projects/:projId', (req, res)=>{
  const userId = req.params.userId;
  const projId = req.params.projId;
  const sql = `SELECT * FROM projects WHERE user_id=(?) AND id=(?)`;
  con.query(sql, [userId, projId], (err, result)=>{
    if(err) return res.json({status:false, error:`Query project ${projId} of customer ${userId} fails`});
    return res.json({status:true, result:result});
  });
});

router.get('/:userId/projects/:projId/classes', (req, res)=>{
  const projId = req.params.projId;
  const sql = `SELECT color, name AS className FROM classes WHERE project_id=?`;
  
  con.query(sql, [projId], (err, result)=>{
    if(result) {
      return res.json({status:true, result:result});
    }
    // no classes info -> do nothing
    else {
      return res.json({status:true});
    }
  })
})

router.get('/:userId/projects/:projId/images', (req, res)=>{
  const projId = req.params.projId;
  const sql = `SELECT * FROM images WHERE project_id=(?)`;
  con.query(sql, [projId], (err, result)=>{
    if(err) return res.json({status:false, error:`Query images of project ${projId} fails`});
    return res.json({status:true, result:result});
  })
});

router.get('/:userId/projects/:projId/results', (req, res)=>{
  const projId = req.params.projId;
  const sql = `SELECT (result) FROM images WHERE project_id=? AND result IS NOT NULL`;
  con.query(sql, [projId], (err, result)=>{
    if (err) return res.json({status:false, error:`Query results of project ${projId} fails`});
    if (result.length==0) return res.json({status:false, error:`No result available`})
    return res.json({status:true, result:result})
  })
});

router.post('/customer_login', (req, res)=>{
  const sql = `SELECT * FROM customer WHERE email=?`;
  con.query(sql, [req.body.email], (err, result)=>{
    if(err) {
      return res.json({status:false, error:"Query customer error"});
    }
    if(result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response)=>{
        if(err) {
          return res.json({status:false, error:"Error while comparing bcrypted passwords"});
        }
        if(response) {
          const token = jwt.sign(
            {role:"customer", email: result[0].email, customer_id:result[0].id, username:result[0].username},
            process.env.SECRET_KEY,
            {expiresIn: "1d"}
          );
          res.cookie('token', token);
          return res.json({status:true, customer_id:result[0].id, username:result[0].username});
        } else {
          return res.json({status:false, error:"Wrong password"})
        }
      })
    } else {
      return res.json({status:false, error:"Wrong email or password"});
    }
  })
});

router.post('/:userId/projects', (req, res)=>{
  const sql = "INSERT INTO projects (name, user_id, type_id) VALUES (?)";
  con.query(sql, [[req.body.projName, req.params.userId, req.body.type_id]], (err, result)=>{
    if(err) {
      console.log('err', err)
       return res.json({status:false, error:"Insert db error"});
    }
    // create empty folder
    const folderName = `./public/customers/${req.body.username}/${req.body.projName}`;
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
    fs.mkdirSync(`${folderName}/images`)
    fs.mkdirSync(`${folderName}/results`)
    return res.json({status:true});
  });
})

router.post("/:userId/projects/:projId", (req,res)=>{
  const classes = req.body.classes
  if (classes.length === 0) {
    return res.json({status:true});
  }
  const projId = req.params.projId;
  const values = [];
  let sql = "INSERT INTO classes (name, project_id, color) VALUES ";
  classes.forEach((cl,idx)=>{
    sql += (idx<classes.length-1) ? "(?)," : "(?)";
    values.push([cl.className, projId, cl.color]);
  });
  con.query(sql, values, (err, result)=>{
    if(err) return res.json({status:false, error:"Query insert classes table failed"});
    return res.json({status:true});
  });
});

// Upload from frontend to tmp, then move to user's folder
router.post("/:userId/projects/:projId/upload_images", upload.array('images'), async (req, res)=>{
  let username = '';
  let projName = '';
  if(typeof(req.body.username)=='string') {
    username = req.body.username;
    projName = req.body.projName;
  } else {
    username = req.body.username[0];
    projName = req.body.projName[0];
  }
  
  fs.readdir(`${process.env.TMP_LOC}`, (err, files)=>{
    files.forEach(file=>{
      var extension = path.extname(file)
      if ( [".jpg", ".jpeg", ".png", ".webp"].includes(extension)) {
        fs.rename(`${process.env.TMP_LOC}/${file}`, `./public/customers/${username}/${projName}/images/${file}`, err2=>{
          if(err2) return res.json({status:false, error:"Error moving file"});
        })
      }
    })
  });
  return res.json({status:true, result:req.files});
});

// Insert images to db
router.post("/:userId/projects/:projId/images", (req, res)=>{
  let values = [];
  let sql = "INSERT INTO images (name, project_id, path) VALUES ";
  let files = req.body.data.files;
  files.forEach((file, idx)=>{
    sql += (idx<files.length-1) ? "(?)," : "(?)";
    values.push([file.originalname, req.params.projId, `customers/${req.body.data.username}/${req.body.data.projName}/images/${file.originalname}`]);
  })
  con.query(sql, values, (err, result)=>{
    if(err) {
      console.log('err', err)
      return res.json({status:false, error:"Cannot insert images to db"});
    }
    return res.json({status:true});
  });
});

router.put("/:userId/projects/:projId/result/:imgId", (req, res)=>{
  let resultPath = req.body.resultPath;
  const imgId = req.params.imgId;
  let sql = "UPDATE images SET result=? WHERE id=?";
  con.query(sql, [resultPath, imgId], (err, response)=>{
    if(err) return res.json({status:false, error:"Cannot insert result to db"});
    return res.json({status:true})
  })
});
  
router.delete('/:userId/projects/:projId/classes', (req,res)=>{
  const projID = req.params.projId;
  const sql = `DELETE FROM classes WHERE project_id=(?)`;
  con.query(sql, [projID], (err, result)=>{
    return res.json({status:true});
  })
});

router.delete('/:userId/projects/:projId/images', (req, res)=>{
  const projId = req.params.projId;
  let pathImgDir = `public/customers/${req.body.username}/${req.body.projName}/images`;
  // delete images of Project projId from userId's folder
  fs.rmSync(pathImgDir, { recursive: true, force: true });
  fs.mkdirSync(pathImgDir);
  // delete from SQL
  const sql = `DELETE FROM images WHERE project_id=(?)`;
  con.query(sql, [projId], (err, result)=>{
    return res.json({status:true})
  })
});

router.delete('/:userId/projects/:projId/results', (req, res)=>{
  let pathResultDir = `public/customers/${req.body.username}/${req.body.projName}/results`;
  fs.rmSync(pathResultDir, { recursive: true, force: true });
  fs.mkdirSync(pathResultDir);
  return res.json({status:true})
});


export {router as customerRouter};