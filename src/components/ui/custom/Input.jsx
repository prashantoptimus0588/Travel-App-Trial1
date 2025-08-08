import React from 'react'

const NumberInput = ({ type="text",value, onChange, placeholder = "Enter a number", className = "" }) => {
  const handleInputChange = (e) => {
    const newValue = e.target.value
    // Only allow digits (or empty string)
    if (/^\d*$/.test(newValue)) {
      onChange(newValue)
    }
  }

  return (
    <input
      type={type} // We use text to allow regex filtering
      value={value}
      onChange={handleInputChange}
      placeholder={placeholder}
      className={`border px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    />
  )
}

export default NumberInput
