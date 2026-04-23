import React from 'react'
import {SignUpform} from '../components/SignUpform.jsx'

function SignupPage() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center bg-background'>
      <div className='w-full  max-w-sm '>
        <h1 className='text-center text-2xl font-bold'>Sign Up</h1>
    
     
        <SignUpform />
      </div>
    </div>
  )
}

export default SignupPage