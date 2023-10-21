import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {

  // Change to other page
  const navigate = useNavigate();


  // for getting the latest input from the user 
  const [values, setValues] = useState({
    username: "",
    email: "",
    adminToken: "",
  });

    // Prompth error to user 
    const toastOption = {
      position: "top-center",
      autoClose: 3000,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
  };
  

  // Check if user is already logged in
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  // Update the values when user input
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Check if the input is valid
  const formValidation = () => {
    const {username, email, adminToken} = values;
    if (username === "" ) {
      toast.error("Username cannot be empty", toastOption);
      return false;
    }
    else if (email === "" ) {
        toast.error("Email cannot be empty", toastOption);
        return false;
    }
    else if (adminToken !== "" && adminToken !== process.env.REACT_APP_ADMIN_SEED ) { 
      console.log(adminToken);
      toast.error("Invalid Admin Token", toastOption);
      toast.error("Do not fill in the admin token if you are not an admin.", toastOption);
      return false;
     };
    return true;
  };

  // Submit the form and store th data into the database
  const submitForm = async (event) => {
    event.preventDefault();
    const {username, email,adminToken} = values;
    // Check if the input is valid
    if (formValidation()){
      let userType = "User";

      if (adminToken === process.env.REACT_APP_ADMIN_SEED) {
        userType = "Admin";
      }

      // Send the data to the backend for database storage
      const{data} =  await axios.post(registerRoute, {username, email, userType});
      
    
      // check if the data is successfully stored
      if (data.status === false) {
        toast.error(data.message, toastOption);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        if(data.user.userType === "Admin"){
          navigate("/");
        }
        else{
          navigate("/selectservice");

        }

      }
    }
  };

  return (
    <>
      <FormContainer>
      <form onSubmit={(event=>{submitForm(event)})}>
                {/* Username */}
                <input
                type="text"
                placeholder="Username"
                name='username'
                onChange={e=>{handleChange(e)}}
                />
                {/* Email */}
                <input
                type="email"
                placeholder="Email"
                name='email'
                onChange={e=>{handleChange(e)}}
                />
                {/* Admin Token */}
                <input
                type="text"
                placeholder="Admin Token (Optional)"
                name='adminToken'
                onChange={e=>{handleChange(e)}}
                />

                {/* Submit button */}
                <button type = "submit"> Create User</button>
                <span><Link to= "/login">Login</Link></span>
            </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}


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
        cursor: pointer;
        a{
            text-decoration: none;
            font-weight: bold;
            color: #F6F1EE;

        }
    }
  }
`;
