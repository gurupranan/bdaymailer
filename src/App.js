
import Interface from './comp/Interface';
import SignIn from './comp/SignIn';
import SignUp from './comp/SignUp';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React from 'react';
import ForgotPass from './comp/ForgotPass';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact Component={SignIn} />
        <Route path='/add_record' Component={Interface} />
        <Route path='/signup' Component={SignUp} />
        <Route path='/forgotpass' Component={ForgotPass} />
      </Routes>
    </Router>
  
  );
}

export default App;
