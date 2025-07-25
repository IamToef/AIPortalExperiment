import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import AddProject from './components/AddProject';
import ProjectPanel from './components/ProjectPanel';
import Classes from './components/Classes';
import Upload from './components/Upload';
import Analyze from './components/Analyze';

const url=  'http://10.86.6.59:3000';
// const url= 'https://mintek.top'
// const url = 'https://aidemo.qc.bonbonshop.vn';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/:customer_id" element={<Projects />}></Route>
        <Route path="/:customer_id/create" element={<AddProject/>}></Route>
        <Route path="/:customer_id/:projId" element={<ProjectPanel />}>
          <Route index element={<Navigate to="classes" replace/>} />
          <Route path="classes" element={<Classes/>}></Route>
          <Route path="upload" element={<Upload/>}></Route>
          <Route path="analyze" element={<Analyze/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
export {url};