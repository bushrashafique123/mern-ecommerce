import React from "react"

const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[240px] gap-4 text-center">
      <div className="h-12 w-12 rounded-full border-4 border-yellow-200 border-t-yellow-500 animate-spin" />
      <p className="text-lg font-medium text-yellow-600">{label}</p>
    </div>
  )
}

export default Loader
