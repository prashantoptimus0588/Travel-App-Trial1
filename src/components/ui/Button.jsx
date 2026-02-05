// src/components/ui/Button.jsx
import React from 'react'

const Button = ({ children = "Click Me", onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white px-4 py-2 rounded hover:brightness-110 transition duration-300 ${className}`}
    >
      {children}
    </button>
  )
}

export { Button }