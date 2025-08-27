import React from 'react'
import { Button } from '../Button'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center bg-gradient-to-br from-blue-50 to-indigo-100 sm:px-8 md:px-16 lg:px-24 xl:px-32'>
      <h1 className='font-extrabold text-4xl leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl mt-8 mb-6'>
        <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips ✈️
      </h1>
      <p className='text-lg text-gray-700 max-w-3xl mx-auto mb-10 sm:text-xl md:text-2xl'>
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>
      <Link to={'/create-trip'}>
        <Button className='bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg'>
          Get Started
        </Button>
      </Link>
      <img 
        src="/timeToTravel.png" 
        alt="Time to Travel" 
        className='mt-12 w-full max-w-4xl rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.02] object-cover h-auto'
      />
    </div>
  )
}

export default Hero;
