import React, { useState } from "react";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function ChatInput({ msgSend }) {

  // for getting and updating the message input by the user 
  const [msg, setMsg] = useState("");

  // Change to other page
  const navigate = useNavigate();

 

  const sendChat = async (event) => {

  
    localStorage.getItem("username");
    event.preventDefault();

    // do not send empty message
    if (msg.length > 0) {
      msgSend(msg);
      
      // reset the message input variable
      setMsg("");
    }
  };

  return (
    <Container>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        {/* Message Input */}
        
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        {/* Send Button */}
        <button type="send">
          Send
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  align-items: center;
  background-color: #4F4A45;
  padding-top: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 0 0 2.5rem 0;

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #F6F1EE;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #F6F1EE;
      }
      &:focus {
        outline: none;
      }
    }
    button{
      background-color: #ED7D31;
      color: #F6F1EE;
      padding: 0.3rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 2rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0ms 0.1s ease-in-out;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

      &:hover{
          background-color: #F99417;
      }
  }
  
  }
`;
