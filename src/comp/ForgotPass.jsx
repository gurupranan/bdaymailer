import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";


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


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
  <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px', textAlign: 'center', maxWidth: '400px', width: '100%', background: '#fbf9f9'  }}>
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
      <button type="submit" onClick={(event) => passReset(event, navigate)} style={{ width: '100%', padding: '10px', margin: '10px 0', background: '#d9d9d9', borderRadius: '5px' }}>Confirm</button>
    </form>
  </div>
</div>





    ); 
    
};

export default ForgotPass;