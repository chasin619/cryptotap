"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Transak } from "@transak/transak-sdk";

import ExpressCheckoutButton from "./components/ExpressCheckoutButton";

export default function App() {
  const [screen, setScreen] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [amount, setAmount] = useState("");
  const [service, setService] = useState("Pedicab Ride");
  const [transactions, setTransactions] = useState([]);

  const handleAmountClick = (val) => {
    const newAmount = amount + val;
    if (/^\d*\.?\d{0,2}$/.test(newAmount)) {
      setAmount(newAmount);
    }
  };

  const handleClear = () => setAmount("");

  useEffect(() => {
    if (screen === 6) {
      (async () => {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading transactions:", error.message);
        } else {
          setTransactions(data);
        }
      })();
    }
  }, [screen]);

  const insertTransaction = async () => {
    const { error } = await supabase.from("transactions").insert({
      amount: parseFloat(amount),
      service,
      status: "paid",
      crypto_tx: "simulated_hash_123",
    });

    if (error) {
      console.error("Insert error:", error.message);
    } else {
      setScreen(5);
    }
  };

  function openTransak(fiatAmount) {
    // Debug: check if env variable is loading
    console.log("Using Transak key:", process.env.NEXT_PUBLIC_TRANSAK_KEY);
  
    const transak = new Transak({
      apiKey: process.env.NEXT_PUBLIC_TRANSAK_KEY,
      environment: 'STAGING',
      defaultCryptoCurrency: 'USDC',
      walletAddress: '0x9C790a6144b691484cDe07919F7459c6d7D33e09',
      fiatAmount: parseFloat(fiatAmount),
      fiatCurrency: 'USD',
      network: 'polygon',
      disableWalletAddressForm: true,
      disableCryptoCurrencyChange: true,
      isFeeCalculationHidden: true,
      themeColor: '000000',
    });
  
    transak.init();
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CryptoTap</h1>
        <button
          onClick={() => setScreen(6)}
          className="text-blue-600 underline text-sm"
        >
          View History
        </button>
      </div>

      {screen === 1 && (
  <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
    <h2 className="text-xl font-bold mb-4 text-center">Enter Service & Amount</h2>

    <div className="text-center text-5xl font-bold mb-6 text-gray-800">
      ${amount || "0.00"}
    </div>

    <div className="grid grid-cols-3 gap-3 mb-6">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((val) => (
        <button
          key={val}
          onClick={() => handleAmountClick(val)}
          className="bg-gray-200 hover:bg-gray-300 text-2xl font-semibold py-4 rounded-xl"
        >
          {val}
        </button>
      ))}
      <button
        onClick={handleClear}
        className="col-span-3 bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded-xl font-bold"
      >
        Clear
      </button>
    </div>

    <select
      className="border p-3 rounded-xl w-full mb-4 text-gray-700"
      value={service}
      onChange={(e) => setService(e.target.value)}
    >
      <option>Pedicab Ride</option>
      <option>Delivery</option>
      <option>Other</option>
    </select>

    <button
      onClick={() => setScreen(2)}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl"
    >
      Continue
    </button>
  </div>
)}


{screen === 2 && (
  <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
    <h2 className="text-xl font-bold mb-4 text-center">Service Agreement</h2>
    <p className="text-sm text-gray-700 mb-6">
      You are making a final and non-refundable payment for the selected service.
      The payment will be converted to cryptocurrency for processing and is not subject
      to disputes or chargebacks once completed.
    </p>

    <label className="flex items-start space-x-3 mb-6 cursor-pointer">
      <input
        type="checkbox"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        className="w-5 h-5 mt-1 accent-green-600"
      />
      <span className="text-gray-800 text-sm leading-snug">
        I understand and agree to the terms of this transaction.
      </span>
    </label>

    <button
      onClick={() => agreed && setScreen(3)}
      disabled={!agreed}
      className={`w-full text-white font-bold py-3 px-4 rounded-xl ${
        agreed ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
      }`}
    >
      Proceed to Payment
    </button>
  </div>
)}


{screen === 3 && (
  <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
    <h2 className="text-xl font-bold mb-6">Choose Payment Method</h2>

    <button
      onClick={() => {
        insertTransaction(); // record to Supabase
        openTransak(parseFloat(amount)); // launch Transak
      }}
      className="w-full bg-black text-white font-semibold py-3 rounded-xl mb-4 hover:bg-gray-800 transition"
    >
      💳 Pay with Apple Pay / Card
    </button>

    <div className="text-sm text-gray-500 mb-4">— or —</div>

    <button
      onClick={() => setScreen("manualCard")}
      className="w-full bg-white border border-gray-400 text-gray-800 font-semibold py-3 rounded-xl mb-4 hover:bg-gray-100 transition"
    >
      Enter Card Manually
    </button>
  </div>
)}


{screen === "manualCard" && (
  <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
    <h2 className="text-xl font-bold mb-4">Manual Card Entry</h2>

    <div className="space-y-3">
      <input
        type="text"
        placeholder="Card Number"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="MM/YY"
          className="w-1/2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="CVC"
          className="w-1/2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <button
      onClick={() => setScreen(4)}
      className="mt-6 w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition"
    >
      Submit Payment
    </button>
  </div>
)}




{screen === 5 && (
  <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-left text-gray-800">
    <h2 className="text-xl font-bold mb-4">🧾 Receipt</h2>
    
    <div className="space-y-2 text-sm">
      <p><span className="font-semibold">Service:</span> {service}</p>
      <p><span className="font-semibold">Amount:</span> ${amount}</p>
      <p><span className="font-semibold">Status:</span> ✅ USDC Received</p>
      <p><span className="font-semibold">TX Hash:</span> <code className="text-blue-600">simulated_hash_123</code></p>
    </div>

    <button
      onClick={() => setScreen(6)}
      className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
    >
      View Transaction History
    </button>
  </div>
)}


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
