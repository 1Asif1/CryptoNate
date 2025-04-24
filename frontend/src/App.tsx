import React from "react";
import DonationApp from "./DonationApp";

export default function App() {
  return (
    <>
    <div className="w-full min-h-screen  flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white backdrop-blur-lg shadow-2xl m-20 rounded-3xl border border-white p-8 sm:p-10 md:p-12">
      <img src="CryptoNate gold without bg.png" alt="CryptoNate img"  className="max-sm:h-2 w-20 "/>
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent">
          CryptoNate- Stellar Donation Portal
        </h1>
        <p className="text-center text-gray-700 font-medium mb-8">
          
          <span role="img" aria-label="star">🌟</span> A secure platform for nonprofit donations using Stellar blockchain <span role="img" aria-label="star">🌟</span>
        </p>

        <DonationApp />

        <footer className="mt-10 text-sm text-center text-gray-600">
          Built by <strong>EliteSquad</strong><br />
          <strong>Team Members: </strong>
    Asif Kamal,
    Amar Biradar,
    Gaurav Kumar Singh
          <br />
          track: <strong>Stellar</strong>
        </footer>
      </div>
      
    </div>
    <footer className="bg-gray-500/60 h-100 w-max">
    
  </footer>
  </>
  );
}