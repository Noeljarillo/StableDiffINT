// src/components/TokenKeyManager.js
import React, { useState, useEffect } from 'react';


// Replace 'http://localhost:5000' with the base URL of your API server
const api_base_url = 'http://localhost:5000/api/';

const TokenKeyManager = ({ account }) => {
  const [remainingPrompts, setRemainingPrompts] = useState(0);

  useEffect(() => {
    if (account) {
      fetchTokenKeyBalance(account);
    }
  }, [account]);

  const fetchTokenKeyBalance = async (address) => {
    try {
      const response = await fetch(`${api_base_url}/keys/balance?address=${address}`);
      const data = await response.json();
      setRemainingPrompts(data.balance);
    } catch (error) {
      console.error('Error fetching token key balance:', error);
    }
  };

  const purchasePrompts = async () => {
    try {
      if (!account) {
        alert('Please connect your wallet first.');
        return;
      }

      const response = await fetch(`${api_base_url}keys/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: account }),
      });

      const data = await response.json();
      setRemainingPrompts(data.balance);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const consumeTokenKey = async () => {
    try {
      const response = await fetch(`${api_base_url}keys/consume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: account }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setRemainingPrompts(data.balance);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  return (
    <div>
      <p>Remaining prompts: {remainingPrompts}</p>
      <button
        onClick={purchasePrompts}
        className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Buy 10 more prompts
      </button>
      {account && (
        <button
          onClick={consumeTokenKey}
          className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 ml-4"
        >
          Consume a prompt
        </button>
      )}
    </div>
  );
};

export default TokenKeyManager;
