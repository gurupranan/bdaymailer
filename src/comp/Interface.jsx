import React from "react";
import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';

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

function writeUserData(event) {
  const db = getDatabase();
  const name = document.getElementById("name").value;
  const mail = document.getElementById("mail").value;
  const dob = document.getElementById("dob").value;

  if (name && mail && dob) {
    set(ref(db, 'persons/' + mail), {
        username: name,
        email: mail,
        birth: dob
      })
      console.log("set executed");
  }

//   if (name !== null && mail !== null && dob !== null) {
    
//   }
  
  
  console.log("db" + name, dob, mail);
}

const InterfaceH = () => {
  return (
    <div style={{ marginTop: '50px', marginRight: '40px' }}>

      <div style={{ textAlign: 'right', justifyContent: 'center' }}>
        <form>
        <input style={{ width: '31%' }} type="text" id="name" name="name" placeholder="Enter your name" />
        <input style={{ width: '31%' }} type="email" id="mail" name="email" placeholder="Enter your email" />
        <input style={{ width: '31%' }} type="date" id="dob" name="date" placeholder="Select date of birth" />
        <br />
        <br />
        <button style={{ width: '31.5%', backgroundColor: '#d9d9d9' }} type="reset" id="addRecord" onClick={writeUserData}>Add Record</button>
        </form>
      </div>
      <br />
      <br />

      <div style={{ textAlign: 'left', backgroundColor: '#d9d9d9' }}>
        {/* Content inside the grey section goes here */}
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
              <th>Header 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data 1</td>
              <td>Data 2</td>
              <td>Data 3</td>
            </tr>
            <tr>
              <td>Data 4</td>
              <td>Data 5</td>
              <td>Data 6</td>
            </tr>
            <tr>
              <td>Data 7</td>
              <td>Data 8</td>
              <td>Data 9</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'right', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', height: '20%' }}>
        <button style={{ position: 'fixed', bottom: '10px', right: '40px', width: '31%', backgroundColor: '#d9d9d9' }} type="submit" id="logout">Log Out</button>
      </div>
    </div>
  );
}

export default InterfaceH;
