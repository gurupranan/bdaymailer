import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from 'firebase/database';

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
const auth = getAuth();

function validateEmail(newEmail) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/;

  return expression.test(newEmail);
}

function validatePassword(newPassword) {
  return newPassword.length >= 6;
}

function signUp(event, navigate) {
  event.preventDefault();
  const newEmail = document.getElementById("newEmail").value;
  const newPassword = document.getElementById("newPassword").value;

  if (validatePassword(newPassword) === false) {
    alert('Please make sure the password is at least 6 characters');
    return;
  }
//const test = user;
  if (!validateEmail(newEmail)) {
    alert('Please enter a valid email');
    return;
  }

  createUserWithEmailAndPassword(auth, newEmail, newPassword)
    .then(function (userCredential) {
      var user = userCredential.user;
      
    // console.log("in");
        const db = getDatabase();
        const email = auth.currentUser.email;
        const uid = auth.currentUser.uid;
        set(ref(db, 'users/' + uid), {
          uid: uid,
          email: email
        });
        
          //console.log(auth.currentUser);

      alert("User creation is successful");

      navigate("/");
      // Redirect or perform other actions upon successful user creation
    })
    .catch(function (error) {
      console.log(error);
      alert("User Already exist");
    });
}

const SignUp = () => {
  const navigate = useNavigate();
  return (
    <div style={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: '50%', textAlign: 'center' }}>
        <h1>Wish your friends and family <br />Happy Birthday!</h1>
      </div>
      <div style={{ width: '21%', height: '60%', textAlign: 'center', border: '1px solid #ccc', padding: '20px', background: '#fbf9f9' }}>
        <h2>Sign up</h2>
        <form>
          <input type="email" id="newEmail" name="email" placeholder="Enter your email" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '10px', padding: '5px' }} />
          <input type="password" id="newPassword" name="password" placeholder="Enter your password" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '10px', padding: '5px' }} />
          <button onClick={(event)=>signUp(event, navigate)} type="button" style={{ width: '100%', cursor: 'pointer', boxSizing: 'border-box', marginBottom: '10px', padding: '5px', background: '#d9d9d9' }}>Sign Up</button>
          <br />
          <br />
          <button type="submit" style={{ width: '100%', cursor: 'pointer', boxSizing: 'border-box', marginBottom: '10px', padding: '5px', background: '#d9d9d9' }}>Sign Up with Google</button>
        </form>
        <br />
        Already having an account?<Link to = "/" >Sign In</Link>
      </div>
    </div>
  );
}

export default SignUp;
