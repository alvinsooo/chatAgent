import React,{useEffect, useState, useRef} from 'react'
import PopupChatContainer from './PopupChatContainer';
import styled from "styled-components";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getServeiceRouter, host} from "../utils/APIRoutes";

export default function Popup({setShowPopup}) {

    // Change to other page
    const navigate = useNavigate();
    // real time messaging library
    const socket = useRef();
    // for getting and updating the current chat 
    const [currentService, setCurrentService] = useState(undefined);
    // for getting and updating the current user's info
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    


    // Check if user is already logged in
    useEffect(async () => {
    // Send the user to login page if local storage is empty
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
    else {
    
      setCurrentUser(await JSON.parse( localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))); 
    }
    }, []);
    // Add the user into the global socket map 
     // Get the agent or bot from the database
    useEffect(async () => {
        if (currentUser) {
            let data =  undefined

            while(!data){
                data = await axios.get(`${getServeiceRouter}/${currentUser.serviceType}`);
            }
            setCurrentService(data.data);
            setIsLoaded(true);
        } 
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
        socket.current = io(host);
        socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);
    return <>
    <Overlay onClick={()=>{setShowPopup(false)}} ></Overlay>
    <Container > 
        {isLoaded && <PopupChatContainer currentChat={currentService} socket={socket} setShowPopup = {setShowPopup}/>}
    </Container>
</>
}


const Overlay = styled.div`
    cursor: pointer;
    position: fixed;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, .7);
`

const Container = styled.div`
position: fixed;
top: 50%;
left: 50%;
height: 80vh;
width: 30vw;
border-radius: 1rem;
transform: translate(-50%, -50%);
background-color: #6C5F5B;

`