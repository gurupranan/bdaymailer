import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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


function signIn(event){
  event.preventDefault();
const email=document.getElementById("email").value;
const pswd=document.getElementById("pswd").value;



signInWithEmailAndPassword(auth, email, pswd)
.then(function(userCredential){
  // Signed in 
  var user = userCredential.user;
  // ...
  console.log("thenin");
})

.catch((error) =>{
  alert("email or password is wrong");
});
console.log("thenout")

}








const Index = () => {
  return (
    <div style={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>

      {/* Left Section (60%) */}
      <div style={{ width: '50%', textAlign: 'center' }}>
        <h1> Wish your friends and family <br />Happy Birthday!</h1>
      </div>

      {/* Right Section (40%) */}
      <div style={{ width: '21%', height: '60%', textAlign: 'center', border: '1px solid #ccc', padding: '20px', background: '#fbf9f9' }}>
        <h2>Sign in</h2>
        <form>

          <input type="email" id="email" name="email" placeholder="Enter your email" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '10px', padding: '5px' }} />

          <input type="password" id="pswd" name="password" placeholder="Enter your password" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '10px', padding: '5px' }} />

          <button id="sign-in" type="button" onClick={signIn} style={{ width: '100%', cursor: 'pointer', boxSizing: 'border-box', marginBottom: '10px', padding: '5px', background: '#d9d9d9' }}>Sign In</button>

          <br />
          <br />

          <button type="submit" style={{ width: '100%', cursor: 'pointer', boxSizing: 'border-box', marginBottom: '10px', padding: '5px', background: '#d9d9d9' }}>Sign in with Google</button>

        </form>

        <br />
        <p>Don't have an account? <a href = "#" >Sign Up</a></p>
      </div>
    </div>
  );
}

export default Index;
