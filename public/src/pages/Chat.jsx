import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import { io } from "socket.io-client";

export default function Chat() {
  
  // Change to other page
  const navigate = useNavigate();

  // real time messaging library
  const socket = useRef();

  // for getting and updating the contact list 
  const [contacts, setContacts] = useState([]);
  // for getting and updating the current chat 
  const [currentChat, setCurrentChat] = useState(undefined);
  // for getting and updating the current user's info
  const [currentUser, setCurrentUser] = useState(undefined);

  // Check if user is already logged in
  useEffect(async () => {
    // Send the user to login page if local storage is empty
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
    else {
      setCurrentUser( await JSON.parse( localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))); 
    }
  }, []);

  // Add the user into the global socket map 
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // Get the contact list from the database
  useEffect(async () => {
    if (currentUser) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } 
  }, [currentUser]);

  // Change the current chat
  const handleChatChange = (chat) => { setCurrentChat(chat);};

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {/* Check if the user select any people to chat with  */}
          {currentChat === undefined ?
          // If not, display the message
          <div className="chat"><h1>Select a chat to start messaging</h1></div> : 

          // If yes, display the chat container
          (<ChatContainer currentChat={currentChat} socket={socket} />)}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #ED7D31;
.container {
  border-radius: 2rem;
  height: 85vh;
  width: 85vw;
  background-color: #6C5F5B;
  display: grid;
  grid-template-columns: 25% 75%;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-columns: 35% 65%;
  }

  .chat {

    h1 {
      justify-content: center;
      align-items: center;
      margin-top: 30%;
      margin-left: 30%;
      color: #F6F1EE;
    }
  }
}
`;
