import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, push, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


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
const db = getDatabase(app);
const auth = getAuth(app);

var nav = false;
const Interface = () => {

  const navigate = useNavigate();
  const [persons, setPersons] = useState([]); //comp state data value as empty array
  
  // if(!auth.currentUser){
  //   //alert("Please signin to continue...")
  //   navigate("/");
  // }
  


  //useEffect(() => { 

    try{
      var uId = auth.currentUser.uid;
      
    }
    catch(error){
      alert("Please signin to continue...")
      nav = true;
    }
    const dbRef = ref(db, 'users/' + uId);
    const fetchData = () => {
      onValue(dbRef, (snapshot) => {
        const data = [];
        var sno = 0;
        snapshot.forEach((childSnapshot) => {
          sno = sno + 1;
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          
          if (typeof childData === 'object' && 'name' in childData && 'email' in childData && 'birth' in childData) {
            data.push({ ...childData, id: childKey, sno: sno });
          } 
        });
    
        console.log("Data from Firebase:", data); // Add this line to log data
    
        setPersons(data);
      });
    };
    

  useEffect(() => {fetchData()}, [db]);
  useEffect(() => {if(nav){navigate("/");}})  

    // return () => {
    //   console.log("retruncln");
    // };
  //}, [db]);//dependency array

  const writeUserData = (event) => {
    //event.preventDefault();

    const name = document.getElementById("name").value;
    const mail = document.getElementById("mail").value;
    const dob = document.getElementById("dob").value;

    if (name && mail && dob) {
      const uid = auth.currentUser.uid;
      const senderEmail = auth.currentUser.email;
      const userId = push(ref(db, 'listusers/'+ uid)).key;
      set(ref(db, 'users/'+ uid + '/' + userId), {
        name: name,
        email: mail,
        birth: dob
      });
      set(ref(db, 'mailerlist/'+ '/' + userId), {
        name: name,
        email: mail,
        birth: dob,
        senderemail: senderEmail
      });

console.log(senderEmail, "senderemailda");
      alert("Data added");
    }
  };
const tableStyle = {
  height: 320,
  overflow: "auto",
} 







const logOut = (event) => {
  signOut(auth).then(()=>{
    navigate("/");
    alert("Signed Out Successfully");
  }).catch((error) => {
    console.log(error);
  })
}




  return (
    <div style={{ marginTop: '50px', marginRight: '80px' }}>
      <div style={{ textAlign: 'right', justifyContent: 'center' }}>
        <form>
          <input style={{ width: '31%', height: '40px' }} type="text" id="name" name="name" placeholder="Enter your name" />&nbsp;&nbsp;&nbsp;
          <input style={{ width: '31%', height: '40px' }} type="email" id="mail" name="email" placeholder="Enter your email" />&nbsp;&nbsp;&nbsp;
          <input style={{ width: '31%', height: '40px' }} type="text" id="dob" name="date" placeholder="Enter date of birth (dd-mm-yyyy)" />
          <br />
          <br />
          <button style={{ width: '31.25%', backgroundColor: '#d9d9d9', height: '40px' }} type="reset" id="addRecord" onClick={(event) => writeUserData(event)}>Add Record</button>
        </form>
      </div>
      <br />

      <div className= {"table"} style={{ textAlign: 'center', marginLeft: '70px', backgroundColor: '#d9d9d9', ...tableStyle }}>
        <table id="person" style={{ width: '100%', textAlign: 'left', margin: '10px' }}>
          <thead>
            <tr>
             <th>S. No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
    {persons.map((person) => (
      <tr key={person.id}>
        <td>{person.sno}</td>
        <td>{person.name}</td>
        <td>{person.email}</td>
        <td>{person.birth}</td>
      </tr>
    ))}
  
</tbody>

        </table>
      </div>

      <div style={{ textAlign: 'right', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', height: '20%' }}>
      <button style={{ position: 'fixed', bottom: '10px', right: '40px', width: '31%', backgroundColor: '#d9d9d9', height: '40px' }} type="submit" onClick={(event) => logOut(event, navigate)} id="logout">Log Out</button>
      </div>
    </div>
  );
};

export default Interface;