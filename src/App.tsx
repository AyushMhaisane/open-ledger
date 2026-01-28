import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-background text-secondary p-10 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl border border-border">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-primary font-bold mb-1">
            System Status
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            OpenLedger is Active
          </h1>
          <p className="mt-2 text-slate-500">
            If you see this card with a slate background and indigo text, 
            your Tailwind v4 configuration is working perfectly.
          </p>
          <div className="mt-4">
            <button className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded transition-colors">
              Test Button
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


export default App;
