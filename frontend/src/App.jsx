import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import NotificationsPage from './pages/NotificationsPage';
import CallPage from './pages/CallPage';
import { Toaster } from './../node_modules/react-hot-toast/src/components/toaster';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios.js';  


export const App = () => {

  const {data, isLoading, error} = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axiosInstance.get("https://locahost:5001/api/auth/me")
      return res.data;
    }

  })

  return (
    <div className="h-screen" data-theme = "night">
      <Routes>
        <Route path="/" element={<HomePage/> }/>
        <Route path="/signup" element={<SignUpPage/> }/>
        <Route path="/login" element={<LoginPage/> }/>
        <Route path="/chat" element={<ChatPage/> }/>
        <Route path="/notifications" element={<NotificationsPage/> }/>
        <Route path="/call" element={<CallPage/> }/>
        <Route path="/onboarding" element ={<OnboardingPage/> } />

      </Routes>
      <Toaster/>
    </div>
  )
}
export default App
