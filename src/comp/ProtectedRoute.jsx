import { getAuth } from 'firebase/auth';
import React from 'react';
import { Route, Navigate, Router } from 'react-router-dom';
import Interface from './Interface';
import { initializeApp } from 'firebase/app';


const ProtectedRoute = ({component: Component}) => {
  const firebaseConfig = {
    apiKey: "AIzaSyD27EFMpChpPEoTdwoN61TOzm9aU39K7f0",
    authDomain: "bday-mailer-62c96.firebaseapp.com",
    databaseURL: "https://bday-mailer-62c96-default-rtdb.firebaseio.com",
    projectId: "bday-mailer-62c96",
    storageBucket: "bday-mailer-62c96.appspot.com",
    messagingSenderId: "767480013407",
    appId: "1:767480013407:web:201a8d7b38a0f7c4c971ea",
    measurementId: "G-YSG0R407MB"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
    console.log("inisauthksx")
  const isAuthenticated = auth.currentUser;
  console.log("3inisauthksx")
return(
    <Route>
      {isAuthenticated ? <Component /> : <Navigate to="/" />}
    </Route>

  );
}

export default ProtectedRoute;