import { BrowserRouter , Routes, Route } from 'react-router-dom';
import './App.css';
import 'react-notifications/lib/notifications.css';
import Login from './Login';
import Register from './Register';
import Dashboard1 from './admin/Dashboard1';
import Dashboard2 from './user/Dashboard2';
import AddEditRegisterUser from './admin/AddEditRegisterUser';
import Subadmin from './admin/Subadmin';
import SubAdminAddEdit from './admin/SubAdminAddEdit';
import Categories from './admin/Categories/Categories';
import CategoryAddEdit from './admin/Categories/CategoryAddEdit';
import Cmspages from './admin/CmsPages/Cmspages';
import CmspageAddEdit from './admin/CmsPages/CmspageAddEdit';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={< Login/>}></Route>
          <Route path='/register' element={< Register/>}></Route>

          <Route path='/admindashboard1' element={< Dashboard1/>}></Route>
          <Route path='/registeruser' element={< AddEditRegisterUser/>}></Route>
          <Route path='/subadmins' element={< Subadmin/>}></Route>
          <Route path='/subadminaddedit' element={< SubAdminAddEdit/>}></Route>
          <Route path='/categories' element={< Categories/>}></Route>
          <Route path='/categoriesaddedit' element={< CategoryAddEdit/>}></Route>
          <Route path='/cmspages' element={< Cmspages/>}></Route>
          <Route path='/cmspageaddedit' element={< CmspageAddEdit/>}></Route>





          <Route path='/userdashboard2' element={< Dashboard2/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
