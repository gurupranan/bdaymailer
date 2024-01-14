import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, signInWithCredential } from 'firebase/auth';
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
const provider = new GoogleAuthProvider();

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

      alert("Account created successfully");

      navigate("/");
      // Redirect or perform other actions upon successful user creation
    })
    .catch(function (error) {
      console.log(error);
      alert("User Already exist");
    });
}


function signUpG(event, navigate){
  event.preventDefault();
//console.log("genter");
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    const newUser = getAdditionalUserInfo(result).isNewUser;



    const db = getDatabase();
    const email = auth.currentUser.email;
    const uid = auth.currentUser.uid;
    
    if(newUser){set(ref(db, 'users/' + uid), {
      uid: uid,
      email: email
    });

    
    navigate("/");
    setTimeout(function() {
      alert("Account created successfully.");
    }, 1);
  

  }
    else{
      navigate("/");


      setTimeout(function() {
    alert("User Already exists. Please click 'Sign In With Google' to continue");
  }, 1);
      
    }
    //console.log(auth.currentUser.email);
    
  //console.log("gpass");
  }).catch((error) => {
    // Handle Errors here.
    
    
    console.log(error);
})
}


const SignUp = () => {
  const navigate = useNavigate();


  function oneTapAutoLogin(res){
    console.log("testetetsjjd", res)
  }

  useEffect(() => {
    const script = document.createElement('script');
    const div = document.getElementById('g_id_onload');
    div['data-callback'] = oneTapAutoLogin;


  
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    window.oneTapAutoLogin = (response) => {
      const idToken = response.credential;
      const credential = GoogleAuthProvider.credential(idToken);
  
  
      signInWithCredential(auth, credential).then((result)=>{


//console.log("usersdvhjvsdf", JSON.stringify(result));
        const newUser = getAdditionalUserInfo(result).isNewUser;
        const db = getDatabase();
        const email = auth.currentUser.email;
        const uid = auth.currentUser.uid;
        console.log("test",email, uid, newUser);
        if(newUser){set(ref(db, 'users/' + uid), {
          uid: uid,
          email: email
        });

        alert("Account created successfully")
      }

        
        navigate("/add_record")}).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The credential that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    };

    // Set the callback after the script is loaded
    script.onload = () => {
      const div = document.getElementById('g_id_onload');
      div['data-callback'] = 'oneTapAutoLogin';
    };
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
      delete window.oneTapAutoLogin;
    }
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>

      {/* Left Section (60%) */}
      <div style={{ width: '60vw', textAlign: 'center' }}>
        <h1> Wish your friends and family <br />Happy Birthday!</h1>
      </div>

      {/* Right Section (40%) */}
      <div style={{ marginRight:"5vw",  textAlign: 'center', border: '1px solid black', padding: '5vh', paddingTop: '2vh', paddingBottom: '8vh', background: '#f8f8f8' , borderRadius: '4px'}}>
        <h2>Sign Up</h2>
        <br />
        <form>

          <input type="email" id="newEmail" name="email" placeholder="Enter your email" style={{ width: '21vw', boxSizing: 'border-box', marginBottom: '10px', padding: '5px', borderRadius: '4px', border: '1px solid black' }} />
          <br />
          <input type="password" id="newPassword" name="password" placeholder="Enter your password" style={{ width: '21vw', boxSizing: 'border-box', marginBottom: '10px', padding: '5px', borderRadius: '4px', border: '1px solid black' }} />
          <br />
          <br />
          <button id="sign-up" type="reset" onClick={(event)=>signUp(event, navigate)} style={{ width: '21vw', cursor: 'pointer', boxSizing: 'border-box', marginBottom: '10px', padding: '5px', background: '#d9d9d9', borderRadius: '4px', border: '1px solid black' }}>Sign Up</button>
          
          <br />
          <br />

          {/* <button type="reset" onClick={(event)=>signInG(event, navigate)} style={{ width: '21vw', cursor: 'pointer', boxSizing: 'border-box', marginBottom: '10px', padding: '5px', background: '#d9d9d9' }}>Sign In With Google</button> */}
          
          {/*

useGoogleOneTapLogin({
    onError: error => console.log(error),
    onSuccess: response => console.log(response),
    googleAccountConfigs: {
      client_id: "767480013407-c0d70387n7l6k19k86osam043kh5dall.apps.googleusercontent.com"
    },
  })}
           <GoogleOneTapLogin onError={(error) => console.log(error)} onSuccess={(response) => console.log(response)} googleAccountConfigs={{ client_id: "767480013407-c0d70387n7l6k19k86osam043kh5dall.apps.googleusercontent.com" }} /> */}
</form>
<div id="g_id_onload"
     data-client_id="767480013407-c0d70387n7l6k19k86osam043kh5dall.apps.googleusercontent.com"
     data-context="use"
     data-ux_mode="popup"
     data-callback="oneTapAutoLogin"
     data-nonce=""
     data-itp_support="true">
</div>
<div style={{ display: 'flex', justifyContent: 'center' }}>
<div className="g_id_signin"
     data-type="standard"
     data-shape="pill"
     data-theme="filled_white"
     data-text="continue_with"
     data-size="large"
     data-logo_alignment="left">
</div>
</div>

<br />
<br />

        Don't have an account? <Link to = "/" >Sign In</Link>
      </div>
    </div>
  );}

export default SignUp;
