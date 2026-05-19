import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import { Reg } from './components/Reg'
import { Auth } from './components/Auth'
import { Admin } from './components/Admin'
import { Requests } from './components/Requests'
import { FormReq } from './components/FormReq'

function App() {
  

  return (
    <>
    <Routes>
      <Route path='/reg' element={<Reg/>}/>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/adm' element={<Admin/>}/>
      <Route path='/req' element={<Requests/>}/>
      <Route path='/form-req' element={<FormReq/>}/>
    </Routes>
    </>
  )
}

export default App
