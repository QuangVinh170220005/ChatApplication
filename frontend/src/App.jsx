import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import CallPage from './pages/CallPage.jsx';
import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser';
import Layout from './components/Layout';
import { useThemeStore } from './store/useThemeStore.js';


export const App = () => {

  const {isLoading, authUser} = useAuthUser()

  const {theme} = useThemeStore()

  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  if(isLoading) return <PageLoader />

  return (
    <div className="h-screen" data-theme = {theme}>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar = "true">
            <HomePage/>
          </Layout>
        ) : (<Navigate to={isAuthenticated ? "/login" : "/onboarding"}/>) }/>

        <Route path="/signup" 
        element={ 
          !isAuthenticated ? <SignUpPage/> : <Navigate to={ isOnboarded ? "/" : "/onboarding"}/> 
          }/>
        
        <Route path="/login" 
        element={ 
          !isAuthenticated ? <LoginPage/> : <Navigate to={ isOnboarded ? "/" : "/onboarding"}/> 
            }/>
        
        <Route path="/chat/:id" element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }/>
        
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        
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
