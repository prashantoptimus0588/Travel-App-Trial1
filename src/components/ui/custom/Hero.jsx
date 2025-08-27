import React from 'react'
import { Button } from '../Button'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
      <h1 className='font-extrabold text-[60px] text-center mt-16'>
        <span className='text-[#18bbe0]'>Discover Your next Adventure with AI:</span> Personalised Itenaries at Your Fingertips
      </h1>
      <p>Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.</p>
      <Link to={'/create-trip'}><Button>Get Started</Button></Link>
      <img src="/timeToTravel.png" alt="" className='-mt-[30] rounded-2xl'/>
    </div>
  )
}

export default Hero
