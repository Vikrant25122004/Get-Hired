import { useState } from 'react'
import './App.css'
import Landing from './components/Landing'
import AuthPage from './components/Authpage'
import Profile from './components/Profile'
import ResumeScorerPage from './components/ResumeScorePage'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
    <Landing/>
       <Outlet/>

    </>
  )
}

export default App
