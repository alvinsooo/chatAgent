import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";

export default function UserPortal() {

  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  // Check if user is already logged in
  useEffect(async() => {
  if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
   if(await JSON.parse(localStorage.getItem( process.env.REACT_APP_LOCALHOST_KEY)).serviceType === ""){
     navigate("/selectservice");
   }
   else if (await JSON.parse(localStorage.getItem( process.env.REACT_APP_LOCALHOST_KEY)).userType === "Admin"){
     navigate("/agentPanel");
   }
  }}, []);
  const logout = () => {
        localStorage.clear(process.env.REACT_APP_LOCALHOST_RESPONTTIME_KEY);
        localStorage.clear(process.env.REACT_APP_LOCALHOST_KEY);
        navigate("/login");
  };
  
  const displayPopup = () => {
    setShowPopup(true);
    console.log("displayPopup")
  }
  return (
    <>
      {showPopup && true ?<Popup style = {{"display": showPopup}} setShowPopup={setShowPopup}/> : <EmptyDiv/>  }

      <PortalContainer >
        <button onClick={()=>{displayPopup()}}>Start Session</button>
        <button onClick={()=>{logout()}}>Logout</button>
      </PortalContainer>
    </>
  )
}

const EmptyDiv = styled.div`
  height: 0;
  width: 0;
`


const PortalContainer = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #6C5F5B;

button{
  cursor: pointer;
  background-color: #ED7D31;
  color: #F6F1EE;
  width: 12%;
  height: 5%;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.5rem;
  font-size: 1rem;
  text-transform: uppercase;
  transition: 0ms 0.1s ease-in-out;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  &:hover{
      background-color: #F99417;
  }
}
form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #6C5F5B;
    border-radius: 2rem;
    padding: 3rem 5rem;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);



    input{
        background-color: #D9D9D9;
        padding: 1rem;
        border:0.1rem solid rgba(0, 0, 0, 0.29);
        border-radius: 0.5rem;
        width: 100%;
        font-size: 1rem;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        colour: #F6F1EE;

        &:focus{
            border: 0.15rem solid #000;
            outline: none;
        }

    }

   

    span{
        align-self:center;

        a{
            text-decoration: none;
            font-weight: bold;
            color: #F6F1EE;
        }
    }
  }

`

