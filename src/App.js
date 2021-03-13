import './App.css';
import firebase from "firebase/app";

import "firebase/auth";

import firebaseConfig from './fireBaseConfig';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig)
function App() {

  const [newUser,setNewUser] =useState(false);
  const [user,setUser] = useState({
    isSignIn:false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName,photoURL,email} = res.user;
      const signInUser ={
        isSignIn:true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signInUser)
      console.log(displayName,photoURL,email)
      console.log(res)
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }
  const handleSingOut = () =>{
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser = {
        isSignIn:false,
        name:'',
        photo:'',
        email: '',
        error: '',
        success: ''
      }
      setUser(signedOutUser)
    })
    .catch(err =>{

    })
  }

  const handleBlur = (e) =>{
    let  isFieldValid = true;
    
    if(e.target.name === "email"){
      const isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
      
    } 
    if(e.target.name === "password"){
      const isPassValid =e.target.value.length > 6;
      const passWordHasNumber = /\d{1}/.test(e.target.value);
      console.log(isPassValid && passWordHasNumber)
      isFieldValid =isPassValid && passWordHasNumber;
    }
    if(isFieldValid){
      const newUserInfo ={...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
    
  }

  const handleSubmit = (e) =>{

    if(newUser && user.email && user.password){   
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(res =>{
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success =true;
    setUser(newUserInfo)
    updateUserName(user.name)
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success =false;
    setUser(newUserInfo)
  });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success =true;
        setUser(newUserInfo)
        console.log('sign in user info' , res.user)
      })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success =false;
    setUser(newUserInfo)
  });
    }
    e.preventDefault();
  }

  const updateUserName = (name) => {
    const user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name,
  
}).then(function() {
 console.log('user name updated successfully')
}).catch(function(error) {
  console.log('user') 
});

  }

  return (
    <div className="App">
    {
      user.isSignIn ? <button onClick={handleSingOut}>Sign Out</button>:
      <button onClick={handleSignIn}>Sign In</button>
    }
      
      {
        user.isSignIn && <div>
         <p>welcome{user.name}</p>
          <p>Your email : {user.email}</p>
          <img src={user.photo} alt=""/>
      </div>
      }

      <h1>Firebase Authentication</h1>
      <input type="checkbox"  onChange={() =>{setNewUser(!newUser)}} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}  action="">
     {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your Name"/>}
      <br/>
      <input type="email" name="email" onBlur={handleBlur} placeholder="Your E-mail" required/>
      <br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required id=""/>
      <br/>
      <input type="button" value="Submit"/>
      </form>
      <p>{user.error}</p>
      {user.success &&  <p>User {newUser ? "created" : "Logged In" } successfully</p>}
    </div>
  );
}

export default App;
