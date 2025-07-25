import express from "express";
import http from "http";
import https from "https";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import { adminRouter } from "./routes/AdminRoute.js";
import { customerRouter } from "./routes/CustomerRoute.js";
import { apiRouter } from "./routes/API.js"
import mysql from "mysql2";
import dotenv from "dotenv";
import Jwt from "jsonwebtoken";

dotenv.config();

let dir = process.env.TMP_LOC;
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
dir = './public/customers';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const app = express();

app.use(cors({
  //origin: "*",
  origin: ["http://localhost:5173","http://10.86.6.59:5173", "*"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  ssl : {
    // ca : fs.readFileSync(__dirname + '/ca-server.pem'),
    // key : fs.readFileSync(__dirname + '/client-key.pem'),
    // cert : fs.readFileSync(__dirname + '/client-cert.pem'),
    rejectUnauthorized: false
}
});
con.connect((err)=>{
  if(err) {
    console.log("Database connection error", err);
  } else {
    console.log("Database connected");
  }
});

app.use(express.json());
app.use(cookieParser());
app.use('/auth', adminRouter);
app.use('/customer', customerRouter);
app.use('/api', apiRouter);
app.use(express.static('public'));

// Check if user is authenticated or not
const verify_user = (req, res, next) => {
  const token = req.cookies.token;
  if(token) {
    Jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
      if(err) return res.json({status:false, error:"Wrong token"});
      req.customer_id = decoded.customer_id;
      req.role = decoded.role;
      req.username = decoded.username
      next();
    })
  } else {
    return res.json({status:false, error:"Not authenticated"});
  }
};

app.get('/verify', verify_user, (req, res)=>{
  return res.json({status:true, role:req.role, customer_id:req.customer_id, username:req.username})
})

if (process.env.ENV === 'home' || process.env.ENV==='cloud') {
  app.use(express.static("../client/dist"));
  const sslServer = https.createServer({
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
  }, app);
  sslServer.listen(3000, () =>
    console.log(`Example app listening on ${process.env.URL}`)
  );
} else if (process.env.ENV === 'local2') {
} else if(process.env.ENV === 'local') {
  app.listen(3000, ()=>console.log(`Example app listening on ${process.env.URL}`));
}

export {con};