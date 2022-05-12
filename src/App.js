import logo from './logo.svg';
import './App.css';
import firebaseConfig from './firebase.config';
import { initializeApp } from 'firebase/app';
import  'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup} from "firebase/auth";
import { useState } from 'react';
import {  signOut } from "firebase/auth";
import {  createUserWithEmailAndPassword } from "firebase/auth";
import {  signInWithEmailAndPassword } from "firebase/auth";
import {  updateProfile } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { signInWithPopupr } from "firebase/auth";
const app = initializeApp(firebaseConfig);
function App() {
  const [user,setUser]=useState({

    isSignedIn:false,
    name:'',
    email:'',
    password:'',
    photo:'',
    error:'',
    success:false

  })
  const [newUser,setNewUser]=useState(false)
  
  const provider = new GoogleAuthProvider();
  const fbprovider = new FacebookAuthProvider();
  const handleSignIn=()=>{
       
    console.log('button clicked');
    const auth = getAuth();
signInWithPopup(auth, provider)
  .then((result) => {
    const {displayName,email,photoURL}=result.user;
    const signedInUser={

      isSignedIn:true,
      name:displayName,
      email:email,
      photo:photoURL
    }
    setUser(signedInUser);
   console.log(displayName);
  })


  }

  const handleFbSignIn = ()=>{
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        console.log('fb user after sign in',user);
    
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
    
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
    
        // ...
      });
  
  
  
  
  
  }
  const handleSignOut = ()=>{
          
    console.log('sign out clicked')
    const auth = getAuth();
    signOut(auth).then(() => {
      const signedOutUser={

        isSignedIn:false,
        name:'',
        email:'',
        photo:''
      }
      setUser(signedOutUser);
      
    }).catch((error) => {
      // An error happened.
    });
    

  }
  const handleSubmit =(e)=>{

      console.log(user.email,user.password)

      if( newUser && user.email&&user.password){
        const auth = getAuth();
createUserWithEmailAndPassword(auth, user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    // const user = userCredential.user;
    // console.log(user);
    const newUserInfo={...user};
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo);
    debugger;
    updateUserName(user.name);
    // ...
  })
  .catch((error) => { 
    const errorCode = error.code;
    const errorMessage = error.message;
    const newUserInfo={...user};
      newUserInfo.error=errorMessage;
      newUserInfo.success=false;
      setUser(newUserInfo);

    // ..
  });

      }

      if(!newUser && user.email && user.password){

        const auth = getAuth();
        signInWithEmailAndPassword(auth, user.email, user.password)
          .then((userCredential) => {
            // Signed in 
            const user= userCredential.user;
            console.log(user);
    const newUserInfo={...user};
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo);
    console.log("hi");
    console.log("sign in user info ",userCredential.user)
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const newUserInfo={...user};
      newUserInfo.error=errorMessage;
      newUserInfo.success=false;
      setUser(newUserInfo);
          });

      }
      e.preventDefault();

  }
const updateUserName= (name) =>{
  const auth = getAuth();
  updateProfile(auth.currentUser, {
    displayName: name 
    // Profile updated!
    // ...
  }).then(()=>{

console.log('User name updated')

  }).catch((error) => {
    // An error occurred
    // ...
    console.log(error);
  });

}
  const handleBlur= (e)=>{
  
    console.log(e.target.name,e.target.value);
    let isFormValid=true;
     if(e.target.name==='email'){

       isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      console.log(isFormValid)
     }
    if(e.target.name==='password'){ 
      
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFormValid=isPasswordValid && passwordHasNumber; 
      console.log(isPasswordValid&&passwordHasNumber) ;
    
    
    }
    if(isFormValid){

      const newUserInfo={...user};
      newUserInfo[e.target.name]=e.target.value;
      setUser(newUserInfo);

    }
    

  }
  return (
    <div className="App">
        
        {user.isSignedIn ?
       <button onClick={handleSignOut}>Sign Out</button> :
       <button onClick={handleSignIn}>Sign In</button>
        }
             <br />
            
          <button onClick={ handleFbSignIn}>Sign in Using Facebook</button>
        {

      user.isSignedIn &&
      
       <div>
             <h3> welcome {user.name} </h3>
             <p>Your email: {user.email}</p>
             <img src={user.photo} alt="" />
       </div>
        }
        <h1>Our own authentication</h1>
        
   
        <input type="checkbox" onChange={()=> setNewUser(!newUser) }  name='newUser' id=""/>
        <label  htmlFor='newUser'>  New user sign Up </label>
       <p style={{color:'red'}}>{user.error} </p>
       {
             user.success && <p style={{color:'green'}}>User { newUser? 'created' : 'Logged in'} </p>
             

       }


        <form onSubmit={handleSubmit}>
          
       { newUser && <input type="text" placeholder='Enter Name'  name='name' onBlur={handleBlur}/>} <br />
           <input type="text" placeholder='Enter email' required name='email' onBlur={handleBlur}/> <br />
           <input type="password" placeholder='Enter password' required name='password' onBlur={handleBlur}/> <br />
           <input type="submit" value={newUser? 'sign up' : 'sign in'} />






        </form>
    </div>
  );
}

export default App;
