import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, push, onValue, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage"
import { ref as rf } from "firebase/storage"
import axios from "axios";





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
const ZOHO_API_KEY = "408d40335d752832ae57fcaad657a334"

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);



var nav = false;
var flag;
const Interface = () => {
const navigate = useNavigate();
const [persons, setPersons] = useState([]); //comp state data value as empty array
const [hist, setHist] = useState([]);


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
        const histData = [];
        var sno = 0;
        var hisNo = 0
        snapshot.forEach((childSnapshot) => {
          sno = sno + 1;
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          
          if (typeof childData === 'object' && 'name' in childData && 'email' in childData && 'birth' in childData) {
            data.push({ ...childData, id: childKey, sno: sno });
          } 
          if (typeof childData === 'object' && 'name' in childData && 'email' in childData && 'birth' in childData && 'lastupdated' in childData) {
            if(childData.lastupdated == getDateNow()){
            hisNo++;
            histData.push({ name: childData.name, lastupdated: childData.lastupdated, id: childKey, sno: hisNo});
          }
          } 

        });
  
    
        setPersons(data);
        setHist(histData);
      });
    };
    

  useEffect(() => {fetchData()}, [db]);
  useEffect(() => {if(nav){navigate("/");}})  




	function getDateNow() {
		const currentDate = new Date();
		const day = String(currentDate.getDate()).padStart(2, '0');
		const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
		const year = currentDate.getFullYear();
		const formattedDate = `${day}-${month}-${year}`;
	  
		return formattedDate;
	  }

  async function storeImage(uid, userId, blbPic){
    //console.log("entered img str // before storage ref");
    //console.log(JSON.stringify(uid) + "/////"+ JSON.stringify(userId)+ "/////"+JSON.stringify(blbPic))
    const srRef = rf(storage, `users/${uid}/${userId}`);
    //console.log("after storage ref // bfr upload bytes");
    await uploadBytes(srRef, blbPic).then((s)=>{
    //console.log(s);
  }).catch((e)=>{
    //console.log("bfr err") 
    console.log(e);
    //console.log("afr err")      
  })
    //console.log("exit img str");
};

  async function writeUserData(event){
    //console.log("entered user data")
    //event.preventDefault();
    const name = document.getElementById("name").value;
    const mail = document.getElementById("mail").value;
    var dob = document.getElementById("dob").value;
    var imgUrl;
    var blbPic;
    const pic = document.getElementById('fileInput').files[0];
    if(pic){
        blbPic = new Blob([pic], { type: pic.type });
    }

    //resettextfld start
    var uploadedFileNameLabel = document.getElementById('uploadedFileNameLabel');
    uploadedFileNameLabel.innerText = 'Upload Image';
    var dobInput = document.getElementById('dob'); 
    var instMailerLink;
    dobInput.value = ''; 
    dobInput.type = 'text'; 
    //resettextfld end


    dob = dob.split("-");
    dob = `${dob[2]}-${dob[1]}-${dob[0]}`;
    //dob to dd-mm-yyyy



    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

    if (name && mail && dob) {
      if(emailRegex.test(mail) && dobRegex.test(dob)){
                  console.log("entered data val")
                const uid = auth.currentUser.uid;
                const senderEmail = auth.currentUser.email;
                const userId = push(ref(db, 'users/'+ uid)).key;
                await set(ref(db, 'users/'+ uid + '/' + userId), {
                  name: name,
                  email: mail,
                  birth: dob,
                }).then(async ()=>{
                  console.log("entered added")

                  if(pic){
                    await storeImage(uid, userId, blbPic).catch((e) => {
                      console.log(e, "strimg")
                    });
                    console.log("entered getdownload url");
                    await getDownloadURL(rf(storage, 'users/'+ uid + '/' + userId)).then(async (url)=>{
                      imgUrl = encodeURIComponent(url); //%2F isse fix
                      console.log(imgUrl);
                      console.log("entered prms scs")
                      console.log("start" + JSON.stringify(url) + "end")
                      await update(ref(db, 'users/'+ uid + '/' + userId), {
                            url: url
                          })
                      
                      flag = "picpass";
            
                    }).catch((e)=>{
                      console.log("bfr err") 
                      console.log(e);
                      console.log("afr err")
                            
                    })
                  }
                  alert("Data added");
                  const dateNow = getDateNow();
                  
            if(dob.slice(0,5) == dateNow.slice(0,5)){
              
              const age = dateNow.slice(6, 10) - dob.slice(6,10);
              console.log("ageeeee",age);
                  if(flag == "picpass"){
                    instMailerLink = "https://project-rainfall-60026140571.development.catalystserverless.in/server/basicInsMailer/execute?ZCFKEY="+ZOHO_API_KEY+"&name=" + name + "&email=" + mail + "&age=" + age + "&url=" + imgUrl + "&reply=" + senderEmail;
                  }
                  else{
                    instMailerLink = "https://project-rainfall-60026140571.development.catalystserverless.in/server/basicInsMailer/execute?ZCFKEY="+ZOHO_API_KEY+"&name=" + name + "&email=" + mail + "&age=" + age  + "&reply=" + senderEmail;
                  }

                  let config = {
                    method: 'get',
                    url: instMailerLink
                  };
                  
                  axios.request(config)
                  .then(async (response) => {
                    const instMailState = JSON.parse(response.data.output);
                    console.log(instMailState, "mail state");
                    if(instMailState.status == "success"){
                      await update(ref(db, 'users/'+ uid + '/' + userId), {
                        lastupdated: instMailState.lastUpdated
                      })
                    }


                    console.log(JSON.parse(response.data.output));
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                }
                  

                  })
      }
      else{
        alert("Entered data in invalid");
      }
    }
    else{
            alert("Please fill all the mandatory fields (*)");
    }
  };



//************starts event trigger 
//         const url = 'https://api.catalyst.zoho.in/baas/v1/project/4348000000005015/event-bus/4348000000013019/produce?ZCFKEY=408d40335d752832ae57fcaad657a334';
// // Sample form data
// var formData = {
//   "data": "test",
//   "rule_identifier": "newchild"
// };
// // if(pic){
// //   formData = {
// //     data: {
// //       name: name,
// //       email: mail,
// //       birth: dob,
// //       url: url
// //     },
// //     rule_identifier: 'newchild'
// //   };
// // }
// // Making an HTTP POST request using fetch
// fetch(url, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: formData,
// })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Response from server:', data);
//     // Handle the response data as needed
//   })
//   .catch(error => {
//     console.error('Error:', error);
//     // Handle errors
//   });
//************ends event trigger *//////////////////////

const logOut = (event) => {
  signOut(auth).then(()=>{
    navigate("/");
    alert("Signed Out Successfully");
  }).catch((error) => {
    console.log(error);
  })
}

function handleFileUpload(files) {
  var uploadedFileNameLabel = document.getElementById('uploadedFileNameLabel');
  if (files.length > 0) {
    // Update the label text with the selected file name
    uploadedFileNameLabel.innerText = files[0].name;
  } else {
    // If no file selected, reset label text
    uploadedFileNameLabel.innerText = 'Upload Image(optional)';
  }
}



  return (
    <div style={{height: '90vh', display: 'flex', flexDirection: 'column', margin: '5vh'}}>
      <div style={{flex: '0.25', display: 'flex', flexDirection: 'row'}}>
        <div style={{flex: '0.20',     display: 'flex',    flexDirection: 'column',    alignItems: 'left'}}>
          <form>
          <input style={{marginBottom:'2vh', marginTop:'0.4vh', width:'25vw', height: '4.5vh', borderRadius: '4px' }} type="text" id="name" name="name" placeholder="Enter name *" />
     
          <input style={{marginBottom:'2vh', width:'25vw',height: '4.5vh' , borderRadius: '4px' }} type="email" id="mail" name="email" placeholder="Enter Email *" />
     
          <input style={{marginBottom:'2vh', width:'25vw',height: '4.5vh', borderRadius: '4px'  }} type="text" id="dob" name="date" placeholder="Enter Date of Birth *" onFocus={(e) => e.target.type = 'date'} />
         
          {/* <button itemType='image' style={{marginBottom:'1.7vh', width:'25.5vw',backgroundColor: 'white', height: '5vh' , borderRadius: '4px' }} type="reset" id="addRecord" >Upload Image&nbsp;&nbsp;&#x1F4F7;&#x2B06;</button>
        */}
  
          <label
  htmlFor="fileInput"
  style={{
    position: 'relative',
    overflow: 'auto',
    marginBottom: '2vh',
    width: '25.3vw',
    height: '4.5vh',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    cursor: 'pointer',
    border: '2px solid black', // Added border style
    color: 'grey'
  }}
>
  <input
    type="file"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer',
    }}
    id="fileInput"
    onChange={(e) => handleFileUpload(e.target.files)}
  />
  <span id="uploadedFileNameLabel">Upload Image</span>&nbsp;&nbsp;&#x1F4F7;&#x2B06;
</label>

          <button style={{marginBottom:'2vh',width:'25.5vw',backgroundColor: '#d9d9d9', height: '5vh' , borderRadius: '4px' }} type="reset" id="addRecord" onClick={(event) => writeUserData(event)}>Add Record</button>
         </form>

        </div>


        <div style={{flex: '0.80'}}>
          
          <div style={{ borderRadius: '4px',  background: '#d9d9d9', margin: '2vw', marginTop:'0vh', marginRight:'0vh' ,height: "35vh", overflow: "auto"}}>
          {/* Content for the right half of the top section */}
          <h2> &nbsp;&nbsp;&nbsp;&nbsp;History</h2>
          <table id="person" style={{textAlign: 'left', margin: '8vh',  marginTop:'-2vh', borderRadius: '4px'}}>
          {hist ? (
          <thead>
            <tr>
             <th style={{width: '20vw'}}>S. No.</th>
              <th style={{width: '20vw'}}>Name</th>
              <th style={{width: '20vw'}}>Wished On</th>
            </tr>
          </thead>) : null}
         
          <tbody>
            {hist.map((his) => (
              <tr key={his.id}>
              <td>{his.sno}</td>
              <td>{his.name}</td>
              <td>{his.lastupdated}</td>
              </tr>
              ))}
  
          </tbody>
          </table>
        </div>
        </div>
      </div>

      <div style={{flex: '0.05'}}>

</div>
      <div style={{flex: '0.65'}}>
        {/* Content for the bottom section */}
        <div style={{ borderRadius:'4px', textAlign: 'center',  marginTop: '-3vh',backgroundColor: '#d9d9d9', height: "40vh", overflow: "auto" }}>
        <table id="person" style={{textAlign: 'left', margin: '1vh', borderRadius: '4px'}}>
          
        <thead>
          {persons ? (
            <tr>
              <th style={{width: '10vw'}}>S. No.</th>
              <th style={{width: '20vw'}}>Name</th>
              <th style={{width: '35vw'}}>Email</th>
              <th style={{width: '20vw'}}>DOB</th>
              <th style={{width: '15vw'}}>Image</th>
            </tr>
          ) : null}
          </thead>
          <tbody>
    {persons.map((person) => (
      <tr key={person.id}>
        <td>{person.sno}</td>
        <td>{person.name}</td>
        <td>{person.email}</td>
        <td>{person.birth}</td>
        <td>{person.url ? (<a href={person.url}>Download</a>) : "No Image" }</td>
      </tr>
    ))}
  
</tbody>

        </table>
      </div>
      </div>
     
      <button style={{ borderRadius:'4px', width:'25vw', position: 'fixed', bottom: '3vh', right: '5vh', backgroundColor: '#d9d9d9', height: '40px' }} type="submit" onClick={(event) => logOut(event, navigate)} id="logout">Log Out</button>
      
    </div>
    
  );
};

export default Interface;