import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, push, onValue, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage"
import { ref as rf } from "firebase/storage"
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import axios from "axios";

import backImg from '../../src/popper1.png';


//allsignup directory create in firestore --yet implement 

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
var db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);
const fireStore = getFirestore(app);


var nav = false;
var flag;
const Interface = () => {
const navigate = useNavigate();
const [persons, setPersons] = useState([]); //comp state data value as empty array
const [hist, setHist] = useState([]);
const [upcomingBday, setUpcomingBday] = useState([]);


    try{
      var uId = auth.currentUser.uid;
      
    }
    catch(error){
      alert("Please signin to continue...")
      nav = true;
    }
    const dbRef = ref(db, 'users/' + uId);
    
    const fetchData = async () => {

      onValue(dbRef, async (snapshot) => {
        const data = [];
        const histData = [];
        const upcomingBday = [];
        var sno = 0;
        var hisNo = 0;
        var upNo = 0;

        const docRef = doc(fireStore, "users", uId);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){        
          const  allDob = docSnap.data()

          for (const userId of Object.keys(allDob)){
            const userDetails = allDob[userId];
            if (typeof userDetails === 'object' && 'name' in userDetails && 'birth' in userDetails) {
              const currentDate = new Date();
              const dateString = userDetails.birth.slice(4,6)+userDetails.birth.slice(0,3)+getDateNow().slice(6,10)
              const dateToCheck = new Date(dateString);
              const timeDifference = dateToCheck - currentDate;
              const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  console.log(currentDate, dateString,dateToCheck, timeDifference, daysDifference, )
              if(daysDifference >= 0 && daysDifference <= 7){
              upNo++
              upcomingBday.push({ ...userDetails, sno: upNo });
              }
            } 
          }}

        // if (docSnap.exists()) {
        //   console.log("Document data:", arr);
        // } else {
        //   // docSnap.data() will be undefined in this case
        //   console.log("No such document!");
        // }

        
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
        setUpcomingBday(upcomingBday);
      });
    };
    

  useEffect(() => {fetchData()}, [db, fireStore]);
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
                  const userCollectionRef = collection(fireStore, "users");
                  const err = await updateDoc(doc(userCollectionRef, uid), {
                    [userId]: {
                      name: name,
                      birth: dob,
                    }
                  }).catch(async (e)=>{
                    if(e.code.startsWith('not-found')){
                      const userCollectionRef = collection(fireStore, "users");
                      await setDoc(doc(userCollectionRef, uid), {
                        [userId]: {
                          name: name,
                          birth: dob,
                        }
                      });
                      fetchData();
                    }
                    
                    console.log("start"+e+"end");
                  })
                  
                  console.log("entered added", err)

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
                    flag = null;
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
        alert("Entered data is invalid");
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

const containerStyle = {
  backgroundImage: `url(${backImg})`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0% 0%'// Set the height as per your design
  // You can add more styles as needed
};

  return (
<div style={containerStyle}>
    <div style={{height: '90vh', display: 'flex', flexDirection: 'column', margin: '5vh'}}>
      <div style={{flex: '0.25', display: 'flex', flexDirection: 'row'}}>
        <div style={{flex: '0.20',     display: 'flex',    flexDirection: 'column',    alignItems: 'left'}}>
          <form>
          <input style={{marginBottom:'2vh', marginTop:'0.4vh', width:'25vw', height: '4.5vh', borderRadius: '4px',  border: '1px solid black',}} type="text" id="name" name="name" placeholder="Enter name *" />
     
          <input style={{marginBottom:'2vh', width:'25vw',height: '4.5vh' , borderRadius: '4px', border: '1px solid black', }} type="email" id="mail" name="email" placeholder="Enter Email *" />
     
          <input style={{marginBottom:'2vh', width:'25vw',height: '4.5vh', borderRadius: '4px' , border: '1px solid black', }} type="text" id="dob" name="date" placeholder="Enter Date of Birth *" onFocus={(e) => e.target.type = 'date'} />
         
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
    backgroundColor: 'white',background: '#F0FFFF', border: '1px solid black',
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
      cursor: 'pointer',background: '#F0FFFF',
    }}
    id="fileInput"
    onChange={(e) => handleFileUpload(e.target.files)}
  />
  <span id="uploadedFileNameLabel">Upload Image</span>&nbsp;&nbsp;&#x1F4F7;&#x2B06;
</label>

          <button style={{marginBottom:'2vh',width:'25.5vw',height: '5vh' , borderRadius: '4px',background: '#00FFFF', border: '1px solid black', }} type="reset" id="addRecord" onClick={(event) => writeUserData(event)}>Add Record</button>
         </form>

        </div>


        <div style={{flex: '0.40'}}>
          
          <div style={{ borderRadius: '10px',  background: '#F0FFFF', border: '1vh solid cyan', margin: '2vw', marginTop:'0vh', marginRight:'0vh' ,height: "33.5vh", overflow: "auto"}}>
          {/* Content for the right half of the top section */}
          <h2 style={{ position: "sticky", top: 2,  zIndex: 1, background:"#F0FFFF"}}> &nbsp;&nbsp;&nbsp;&nbsp;Upcoming birthdays</h2>
          <table id="person" style={{textAlign: 'left', margin: '8vh',  marginTop:'-2vh', borderRadius: '4px'}}>
          {hist ? (
          <thead style={{ position: "sticky", top: 34,  zIndex: 1, background:"#00FFFF"}}>
            <tr>
             <th style={{width: '5vw'}}>S. No.</th>
              <th style={{width: '17vw'}}>Name</th>
              <th style={{width: '8vw'}}>DOB</th>
            </tr>
          </thead>) : null}
         
          <tbody>
            {upcomingBday.map((up) => (
              <tr key={up.sno}>
              <td>{up.sno}</td>
              <td>{up.name}</td>
              <td>{up.birth}</td>
              </tr>
              ))}
  
          </tbody>
          </table>
        </div>
        </div>



        <div style={{flex: '0.40'}}>
          
          <div style={{ borderRadius: '4px',  background: '#F0FFFF', border: '1px solid black', margin: '2vw', marginTop:'0vh', marginRight:'0vh' ,height: "35vh", overflow: "auto"}}>
          {/* Content for the right half of the top section */}
          <h2 style={{ position: "sticky", top: 2,  zIndex: 1, background:"#F0FFFF"}}> &nbsp;&nbsp;&nbsp;&nbsp;History</h2>
          <table id="person" style={{textAlign: 'left', margin: '8vh',  marginTop:'-2vh', borderRadius: '4px'}}>
          {hist ? (
          <thead style={{ position: "sticky", top: 34,  zIndex: 1, background:"#00FFFF"}}>
            <tr>
             <th style={{width: '5vw'}}>S. No.</th>
              <th style={{width: '17vw'}}>Name</th>
              <th style={{width: '8vw'}}>Wished On</th>
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
        <div style={{ borderRadius:'4px', textAlign: 'center',  marginTop: '-3vh',background: '#F0FFFF', border: '1px solid black', height: "40vh", overflowY: "auto" }}>
        <table id="person" style={{textAlign: 'left', margin: '1vh', borderRadius: '4px'}}>
          
        <thead style={{border: '2px solid #000', position: "sticky", top: 0,  zIndex: 1, background:"#00FFFF"}}>
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
        <td>{person.url ? (<a href={person.url} target="_blank">Download</a>) : "No Image" }</td>
      </tr>
    ))}
  
</tbody>

        </table>
      </div>
      </div>
     
      <button style={{ borderRadius:'4px', width:'25vw', position: 'fixed', bottom: '3vh', right: '5vh', background: '#00FFFF', border: '1px solid black', height: '40px' }} type="submit" onClick={(event) => logOut(event, navigate)} id="logout">Log Out</button>
      
    </div>
    </div>
    
  );
};

export default Interface;