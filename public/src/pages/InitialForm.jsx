import React, {useState, useEffect} from 'react'
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { selectServiceTypeRoute } from "../utils/APIRoutes";

export default function InitialForm() {

 // Change to other page
 const navigate = useNavigate();
  
 // for getting the latest input from the user 
 const [value, setValue] = useState(undefined);

 // Prompth error to user 
 const toastOption = {
   position: "top-center",
   autoClose: 3000,
   pauseOnHover: true,
   draggable: true,
   theme: "colored",
 };



 // Check if user is already logged in
 useEffect(async() => {
   if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
    if(await JSON.parse(localStorage.getItem( process.env.REACT_APP_LOCALHOST_KEY)).serviceType !== ""){
      navigate("/");
    }
    else if (await JSON.parse(localStorage.getItem( process.env.REACT_APP_LOCALHOST_KEY)).userType === "Admin"){
      navigate("/agentPanel");
    }
   }}, []);

 // Update the values when user input
 const handleChange = (event) => {
    const { id } = event.target;
    setValue(id);
 };

 // Check if the input is valid
 const formValidation = () => {
  if (value === undefined) {
    toast.error("Please select a service type", toastOption);
    return false;
  }
  return true
 };

 // Submit the form and store th data into the database
 const submitForm = async (event) => {
  event.preventDefault();
  const username = await JSON.parse(localStorage.getItem( process.env.REACT_APP_LOCALHOST_KEY)).username;
  if (formValidation()) {
    const{data} =  await axios.post(selectServiceTypeRoute, {username, value});
    // check if the data is successfully stored
    if (data.status === false) {
      toast.error(data.message, toastOption);
    }
    if (data.status === true) {
      console.log(data.respond)
      localStorage.setItem(
        process.env.REACT_APP_LOCALHOST_KEY,
        JSON.stringify(data.respond)
      );
      navigate("/");
    }
  }
}


 

  return (
    <>
      <FormContainer>
        <form action=""onSubmit={(event) => submitForm(event)} >
            <label>
            <input 
            type="radio" 
            name="serviceType" 
            id='Bot' 
            value="Bot"
            onChange={(event) => handleChange(event)}/>
            Route Message to Chatbot
            </label>
            <label >
              <input 
              type="radio" 
              name="serviceType" 
              id='Admin' 
              value="Admin"
              onChange={(event) => handleChange(event)}/>
              Route Message to Live Agent.
            </label>           
          {/* Submit button */}
          <button type = "submit">Select</button>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};


const FormContainer = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #ED7D31;

form {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    background-color: #6C5F5B;
    border-radius: 2rem;
    padding: 3rem 5rem;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    

      label{
        color: #F6F1EE;
        font-size: 1.5rem;
        margin-left: 1rem;
        
        input{
          transform: scale(1.5);
          margin-bottom: 1rem;
          margin-right: 1rem;
        }
    }
  }


    button{
        background-color: #ED7D31;
        color: #F6F1EE;
        padding: 1rem 2rem;
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

    span{
        align-self:center;
    }
  }

`;
