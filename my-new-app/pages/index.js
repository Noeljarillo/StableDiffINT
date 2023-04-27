// src/pages/Home.js
import React, { useState } from 'react';
import Web3 from 'web3';
import PromptInput from '../components/PromptInput';
import SubmitButton from '../components/SubmitButton';
import GeneratedImage from '../components/GeneratedImage';
import TokenKeyManager from '../components/TokenKeyManager';

const Home = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      alert('Please install MetaMask or another Web3-enabled wallet.');
    }
  };

  const submitPrompt = async (prompt) => {
    if (!web3) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];

      console.log('Submitting prompt:', prompt);
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, address }),
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else {
        console.error('Error generating image:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">AI Generated Art</h1>
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Connect Wallet
        </button>
        <PromptInput onChange={(e) => setPrompt(e.target.value)} />
        <SubmitButton onSubmit={() => submitPrompt(prompt)} />
        <GeneratedImage src={generatedImageUrl} />
        <TokenKeyManager account={account} />
      </div>
    </div>
  );
};

export default Home;
