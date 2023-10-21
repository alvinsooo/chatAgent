import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";


export default function Logout() {

  const navigate = useNavigate();

  //clear the local storage and redirect to login page
  const logout = () => {
        localStorage.clear(process.env.REACT_APP_LOCALHOST_RESPONTTIME_KEY);
        localStorage.clear(process.env.REACT_APP_LOCALHOST_KEY);
        navigate("/login");
  };

  return (
    <Button onClick={logout}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #ED7D31;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #F6F1EE;
  }
`;
