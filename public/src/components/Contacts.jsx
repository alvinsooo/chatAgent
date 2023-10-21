import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function Contacts({ contacts, changeChat }) {

  // for getting and updating the current user's info
  const [currentUserName, setCurrentUserName] = useState(undefined);
  
  // for getting and updating the current selected contact
  const [currentSelected, setCurrentSelected] = useState(undefined);

  // Get the current user's info from the local storage
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      return;
    }
    const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    setCurrentUserName(data.username);
    

  }, []);

  // Change the current chat
  const changeCurrentChat = (index, contact) => {
    //update the current selected contact
    setCurrentSelected(index);
    // change the chat to the selected contact
    changeChat(contact);
  };

  return (
    <>
      {currentUserName && (
        <Container>
          {/* display the list of contact */}
          <div className="contacts">
            {/* adding each contact the the UI */}
            {contacts.map((contact, index) => {
              return (

                <div
                  key={contact._id}
                  className={`contact ${
                    // add active class to the selected contact
                    index === currentSelected ? "active" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  {/* display the username  */}
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          {/* display the current user info */}
          <div className="current-user">
            {/* current user's name */}
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
display: grid;
grid-template-rows: 85% 15%;
overflow: hidden;
background-color: #4F4A45;
border-radius: 2rem 0 0 2rem;

.contacts {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  gap: 0.8rem;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .contact {
    background-color: #ffffff34;
    min-height: 5rem;
    cursor: pointer;
    width: 90%;
    border-radius: 0.2rem;
    padding: 0.4rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    transition: 0.5s ease-in-out;
    .username {
      h3 {
        color: #F6F1EE;
      }
    }
  }
  .active {
    background-color: #45474B;
  }
}

.current-user {
  background-color: #4F4A45;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  h2 {
    color: #F6F1EE;
  }
  .username {
  }
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    gap: 0.5rem;
    .username {
      h2 {
        
        font-size: 1rem;
      }
    }
  }
}
`;
