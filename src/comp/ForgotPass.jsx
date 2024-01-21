import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import backImg from '../../src/top.png';
import backImg1 from '../../src/think.png';


const ForgotPass = () => {
    
    const auth = getAuth();
    const navigate = useNavigate();

    function passReset(event, navigate){
        const emailR = document.getElementById("emailr").value;
        event.preventDefault();
        
    sendPasswordResetEmail(auth, emailR)
      .then(() => {
        alert("Password reset email will be sent if the account exists");
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Password reset is failed. Please try again!");
        console.log(errorCode, errorMessage);
        // ..
      });
    }
    const containerStyle = {
      backgroundImage: `url(${backImg})`,
      backgroundSize: ' 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top right'// Set the height as per your design
      // You can add more styles as needed
    };
    const containerStyle1 = {
      backgroundImage: `url(${backImg1})`,
      backgroundSize: '20%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '90% 99%'// Set the height as per your design
      // You can add more styles as needed
    };
      return (
        <div style={containerStyle}>
    <div style={containerStyle1}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
  <div style={{ border: '5px solid cyan', borderRadius: '10px', padding: '20px', textAlign: 'center', maxWidth: '400px', width: '100%', background: '#F0FFFF'  }}>
    <form id="forgotPasswordForm">
      <h2 style={{ color: '#333' }}>Forgot your password?</h2>
      <input
        type="email"
        name="emailr"
        id="emailr"
        placeholder="Enter your email"
        style={{ width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }}
      />
      <br />
      <button type="submit" onClick={(event) => passReset(event, navigate)} style={{ border: '3px solid cyan', width: '100%', padding: '10px', margin: '10px 0', background: '#00FFFF', borderRadius: '5px' , cursor: 'pointer'}}>Confirm</button>
      <Link to = "/" >&#129144;&nbsp;Go Back</Link>
    </form>
  </div>
</div>
</div>
</div>





    ); 
    
};

export default ForgotPass;