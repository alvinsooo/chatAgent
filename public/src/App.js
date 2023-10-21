import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InitialForm from "./pages/InitialForm";
import UserPortal from "./pages/UserPortal";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/selectservice" element={<InitialForm />} />
        <Route path="/agentPanel" element={<Chat />} />
        <Route path="/" element={<UserPortal />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
