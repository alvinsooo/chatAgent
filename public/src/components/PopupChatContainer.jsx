import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PopupChatInput from "./PopupChatInput";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, getChatbotRespondRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";

export default function PopupChatContainer({ currentChat, socket, setShowPopup }) {

  // scrolling reference for the chat messages
  const scrollRef = useRef();

  // for getting and updating the arrival message
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // for getting and updating the message history 
  const [messages, setMessages] = useState([]);

  // Prompth error to user 
  const toastOption = {
    position: "top-center",
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  // Get the message history from the database
  useEffect(async () => {
    const currentUserInfo = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: currentUserInfo._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  // Get the current user's info from the local storage
  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);


  const msgSend = async (msg) => {
    const toastID = toast.loading( "Processing your input. Please Wait.....", toastOption);

    // get the info of the current user
    let data = undefined;
    while (!data) {
        data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    }

    // update the other user's chat
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    
    // Store the message into the database
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    //add the current massage send by the user into the message history
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });


    // getting the response from the bot
    if (currentChat.userType === "Bot") {
        
        let apiMessages =  msgs.map((msgObj)=>{
            let role = "";
            if (msgObj.fromSelf){
                role = "user";
            }
            else{
                role = "assistant";
            }
            return {role:role, content:msgObj.message}

        });

        let response = undefined;
        response =  await axios.post(getChatbotRespondRoute,{ 
          from: currentChat._id,
          to: data._id,
          messageList: apiMessages,});


        while(!response){
        }
        if (response.data.status === true){
            
            msgs.push({ fromSelf: false, message: response.data.message });

        }
    }
    toast.dismiss(toastID);
    setMessages(msgs);
  };

  // Update the message history when the user recieve a message
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);
  
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  // scroll the chage to the bottom when the user send or recieve a message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
    <ToastContainer />
    <Container>
      {/* Display the receiver user info */}
      <div className="chat-header">
        <div className="user-details">
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>

        {/* Logout Button*/}
        <div className="button-container">
        <button onClick={()=>{setShowPopup(false)}}>X</button>

        </div>
      </div>

      {/* Display the message history */}
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
              //give the message a class name based on the sender or reciever
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                {/* Content of the message */}
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* For current user to enter the message */}
      <PopupChatInput msgSend={msgSend} />
    </Container>
    </>
    
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
    height: 100%;
    width: 100%;
  gap: 0.1rem;
  overflow: hidden;

  .chat-header {
    border-radius: 1rem 1rem 0  0 ;
    background-color: #4F4A45;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    gap: 1rem;      
    .button-container{
        margin-left: auto;
        button{
            background-color: #ED7D31;
            color: #F6F1EE;
            padding: 0.5rem 1rem;
            border: none;
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
    }
    .user-details {
      display: flex;
      gap: 1rem;
      padding-left: 45%;
      .username {
        h3 {
          color: #F6F1EE;
          text-transform: uppercase;

        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #ED7D31;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #4F4A45;
      }
    }
  }
`;
