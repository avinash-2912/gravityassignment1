import React from 'react'
import './App.scss'
import NavBar from './components/NavBar'
import HomePage from './components/HomePage'

const App = () => {
  return (
    <div>
      <div className='nav'>
      <NavBar/>
      </div>
      <div className='home'>
      <HomePage/>
      </div>
    </div>
  )
}

export default App