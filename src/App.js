
import Interface from './comp/Interface';
import SignIn from './comp/SignIn';
import SignUp from './comp/SignUp';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React from 'react';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact Component={SignIn} />
        <Route path='/add_record' Component={Interface} />
        <Route path='/signup' Component={SignUp} />
      </Routes>
    </Router>
  
  );
}

export default App;
