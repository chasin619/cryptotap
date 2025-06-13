// Recreate CryptoTap app structure with working Supabase integration

"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function App() {
  const [screen, setScreen] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [amount, setAmount] = useState('');
  const [service, setService] = useState('Pedicab Ride');
  const [transactions, setTransactions] = useState([]);

  const handleAmountClick = (value) => {
    setAmount((prev) => {
      const newValue = prev + value;
      return /^\d+(\.\d{0,2})?$/.test(newValue) ? newValue : prev;
    });
  };

  const handleClear = () => setAmount('');

  useEffect(() => {
    if (screen === 6) {
      const fetchTransactions = async () => {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
        } else {
          setTransactions(data);
        }
      };
      fetchTransactions();
    }
  }, [screen]);

  useEffect(() => {
    console.log("Supabase client:", supabase); // This should NOT be undefined
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      {/* Navbar */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CryptoTap</h1>
        <button
          onClick={() => setScreen(6)}
          className="text-blue-600 underline text-sm"
        >
          View History
        </button>
      </div>

      {/* Screen 1: Enter Price */}
      {screen === 1 && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Enter Service & Price</h2>
          <div className="text-center text-4xl font-bold mb-4">
            ${amount || '0.00'}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((val) => (
              <button
                key={val}
                onClick={() => handleAmountClick(val)}
                className="bg-gray-200 text-lg py-3 rounded"
              >
                {val}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="col-span-3 bg-red-200 text-red-700 py-2 rounded"
            >
              Clear
            </button>
          </div>
          <select
            className="border p-2 w-full mb-4 rounded"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option>Pedicab Ride</option>
            <option>Delivery</option>
            <option>Other</option>
          </select>
          <button
            onClick={() => setScreen(2)}
            className="bg-blue-600 text-white py-2 px-4 rounded w-full"
          >
            Continue
          </button>
        </div>
      )}

      {/* Screen 2: Disclaimer */}
      {screen === 2 && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md">
          <h2 className="text-lg font-bold mb-2">Service Agreement</h2>
          <p className="text-sm mb-4">
            By proceeding, you agree to a final and non-refundable payment for this service. This charge will be converted into a cryptocurrency payment.
          </p>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-2"
            />
            I agree to the terms above
          </label>
          <button
            disabled={!agreed}
            onClick={() => setScreen(3)}
            className="bg-blue-600 text-white py-2 px-4 rounded w-full disabled:opacity-50"
          >
            Tap to Pay
          </button>
        </div>
      )}

      {/* Screen 3: Tap to Pay */}
      {screen === 3 && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Tap to Pay</h2>
          <p className="mb-4">Hold the customer's card or phone near your device.</p>
          <button
            onClick={() => setScreen(4)}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            Simulate Successful Payment
          </button>
        </div>
      )}

      {/* Screen 4: Crypto Processing */}
      {screen === 4 && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md text-center">
          <h2 className="text-lg font-bold mb-2">Processing Payment</h2>
          <p className="mb-4">Converting to crypto…</p>
          <button
            onClick={async () => {
              await supabase.from('transactions').insert({
                amount: parseFloat(amount),
                service,
                status: 'paid',
                crypto_tx: 'simulated_hash_123',
              });
              setScreen(5);
            }}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Confirm Crypto Received
          </button>
        </div>
      )}

      {/* Screen 5: Receipt */}
      {screen === 5 && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md text-left">
          <h2 className="text-lg font-bold mb-2">Receipt</h2>
          <p><strong>Service:</strong> {service}</p>
          <p><strong>Amount:</strong> ${amount}</p>
          <p><strong>Status:</strong> USDC Received</p>
          <p><strong>TX Hash:</strong> [simulated_hash_123]</p>
          <button
            onClick={() => setScreen(6)}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
          >
            View Transaction History
          </button>
        </div>
      )}

      {/* Screen 6: Transaction History */}
      {screen === 6 && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md">
          <h2 className="text-lg font-bold mb-4">Transaction History</h2>
          <ul className="text-sm">
            {transactions.map((tx) => (
              <li key={tx.id} className="mb-2">
                • {tx.service} — ${tx.amount} — {tx.status}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setScreen(1)}
            className="mt-4 bg-gray-300 py-2 px-4 rounded"
          >
            New Payment
          </button>
        </div>
      )}
    </div>
  );
}
