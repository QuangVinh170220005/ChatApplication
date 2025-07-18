import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import CallPage from './pages/CallPage.jsx';
import { Toaster } from './../node_modules/react-hot-toast/src/components/toaster';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios.js';  


export const App = () => {

  const {data:authData, isLoading, error} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me")
      return res.data;
    }
  })
  const authUser = authData

  return (
    <div className="h-screen" data-theme = "night">
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/> }/>
        <Route path="/signup" element={ !authUser ? <SignUpPage/> : <Navigate to="/"/> }/>
        <Route path="/login" element={ !authUser ? <LoginPage/> : <Navigate to="/"/> }/>
        <Route path="/chat" element={ !authUser ? <ChatPage/> : <Navigate to="/login"/> }/>
        <Route 
          path="/notifications" 
          element={ !authUser ? <NotificationsPage/> : <Navigate to="/login"/> }
        />
        <Route path="/call" element={ !authUser ? <CallPage/> : <Navigate to="/login"/> }/>
        <Route path="/onboarding" element ={ !authUser ? <OnboardingPage/>  : <Navigate to="/login"/>} />
      </Routes>
      <Toaster/>
    </div>
  )
}
export default App
