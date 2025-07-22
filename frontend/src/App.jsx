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
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser';


export const App = () => {

  const {isLoading, authUser} = useAuthUser()

  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  if(isLoading) return <PageLoader />

  return (
    <div className="h-screen" data-theme = "night">
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (
          <HomePage/>
        ) : (<Navigate to={isAuthenticated ? "/login" : "/onboarding"}/>) }/>

        <Route path="/signup" 
        element={ 
          !isAuthenticated ? <SignUpPage/> : <Navigate to={ isOnboarded ? "/" : "/onboarding"}/> 
          }/>
        
        <Route path="/login" 
        element={ 
          !isAuthenticated ? <LoginPage/> : <Navigate to={ isOnboarded ? "/" : "/onboarding"}/> 
            }/>
        
        <Route path="/chat" element={ isAuthenticated ? <ChatPage/> : <Navigate to="/login"/> }/>
        
        <Route 
          path="/notifications" 
          element={ isAuthenticated ? <NotificationsPage/> : <Navigate to="/login"/> }  
        />
        
        <Route path="/call" element={ isAuthenticated ? <CallPage/> : <Navigate to="/login"/> }/>
        
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes> 
      <Toaster/>
    </div>
  )
}
export default App
