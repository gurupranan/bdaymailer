import React from "react";
import { getDatabase, ref, set, push, onValue, child} from 'firebase/database';
import { initializeApp } from 'firebase/app';
import $ from "jquery";


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
   const db = getDatabase();


   const dbRef = ref(db, "persons");
 
   onValue(dbRef, (snapshot) => {
    var header ="<tr><th>Name</th>       <th>Email</th>       <th>Date of Birth</th></tr>"
    $(header).appendTo("#person");
     snapshot.forEach((childSnapshot) => {
       const childKey = childSnapshot.key;
       const data = childSnapshot.val();

       
       var row = "<tr><td>" + data.name + "</td><td>"+ data.email + "</td><td>" + data.birth + "</td></tr>";

       $(row).appendTo("#person");
     });
   },{
    onlyOnce: true
  });

//   const starCountRef = ref(db, 'persons/');

//   onValue(starCountRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//     const data = snapshot.val();
//     console.log(data.mail);
    // var row = "<tr><td>" + data.birth + "</td><td>"+ data.email + "</td><td>" + data.name + "</td></tr>";
    // $(row).appendTo("#person");
//   }
  
//   );
// })

  



function writeUserData(event) {

    const userId = push(child(ref(db), "persons")).key;
  const name = document.getElementById("name").value;
  const mail = document.getElementById("mail").value;
  const dob = document.getElementById("dob").value;

  if (name && mail && dob) {
    set(ref(db, 'persons/' + userId), {
        name: name,
        email: mail,
        birth: dob
      })
      alert("Data added");
      console.log("set executed");
  }

//   if (name !== null && mail !== null && dob !== null) {
    
//   }
  
  
  console.log("db" + name, dob, mail);
}

const InterfaceH = () => {
  return (
    <div style={{ marginTop: '50px', marginRight: '80px' }}>

      <div style={{ textAlign: 'right', justifyContent: 'center' }}>
        <form>
        <input style={{ width: '31%' , height: '40px'}} type="text" id="name" name="name" placeholder="Enter your name" />&nbsp;&nbsp;&nbsp;
        <input style={{ width: '31%' , height: '40px'}} type="email" id="mail" name="email" placeholder="Enter your email" />&nbsp;&nbsp;&nbsp;
        <input style={{ width: '31%' , height: '40px'}} type="text" id="dob" name="date" placeholder="Enter date of birth (dd-mm-yyyy)" />
        <br />
        <br />
        <button style={{ width: '31.25%', backgroundColor: '#d9d9d9' , height: '40px'}} type="reset" id="addRecord" onClick={writeUserData}>Add Record</button>
        </form>
      </div>
      <br />

      <div style={{ textAlign: 'center', marginLeft: '70px', backgroundColor: '#d9d9d9' }}>
        {/* Content inside the grey section goes here */}
        <table id = "person" style={{ width: '100%', height: '50%', textAlign: 'left', margin: '70px'}}>
          <thead>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'right', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', height: '20%' }}>
        <button style={{ position: 'fixed', bottom: '10px', right: '40px', width: '31%', backgroundColor: '#d9d9d9' , height: '40px'}} type="submit" id="logout">Log Out</button>
      </div>
    </div>
  );
}

export default InterfaceH;
