import React from 'react'
import {Loginform} from '../components/Login-form'
function LoginPage() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center bg-background'>
      <div className='w-full  max-w-sm '>
        <Loginform />
     
      </div>
    </div>
  )
}

export default LoginPage