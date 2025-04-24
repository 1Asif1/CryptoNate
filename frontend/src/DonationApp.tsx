import { useState, useEffect, memo } from "react";
import { History,ShieldUser,SendHorizontal, Forward, DollarSign, Key, User, KeyRound } from 'lucide-react';
import React from "react";
import axios from "axios";
import StatusBar from "./statusbar";

// Replace these with actual components if you're using shadcn-ui or another UI library
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card } from "./components/ui/card";
import { CardContent } from "./components/ui/cardContent";

interface RegisterNonprofitResponse {
  name: string;
  public: string;
  Secret: string;
}

interface DonationResponse {
  success: boolean;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
}

export default function DonationApp() {
  const [nonprofitName, setNonprofitName] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [donorSecret, setDonorSecret] = useState("");
  const [sourceSecret, setSourceSecret] = useState("");
  const [destinationPublic, setDestinationPublic] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | 'none'>('none');
  const [message, setMessage] = useState<string>('');
  const [visible, setVisible] = useState(false);

  const showStatus = (type: 'success' | 'error' | 'info', msg: string) => {
    setStatus(type);
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 5000); // auto-hide
  };


  const registerNonprofit = async () => {
    try {
      const res = await axios.post<RegisterNonprofitResponse>("http://127.0.0.1:5000/register-nonprofit", {
        name: nonprofitName,
      });
      setPublicKey(res.data.public);
      setDonorSecret(res.data.Secret);
      showStatus('success','Nonprofit registered successfully!');
    } catch (err) {
      showStatus('error',"Failed to register nonprofit.");
    }
  };

  const sendDonation = async () => {
    const parsedAmount = parseFloat(amount);
    if (!sourceSecret || !destinationPublic || isNaN(parsedAmount)) {
      showStatus('info',"Please provide valid inputs.");
      return;
    }

    try {
      const res = await axios.post<DonationResponse>("http://127.0.0.1:5000/donate", {
        donor_secret: sourceSecret,
        destination_public: destinationPublic,
        amount: parsedAmount,
      });

      if (res.data.success) {
        showStatus('success',"Donation successful.");
        fetchTransactions();
      } else {
        showStatus('error',"Donation failed.");
      }
    } catch (err) {
      showStatus('error',"Donation Failed.");
    }
  };

  const fetchTransactions = async () => {
    if (!publicKey) return;
    try {
      const res = await axios.get<{ transactions: Transaction[] }>(
        `http://127.0.0.1:5000/transactions/${publicKey}`
      );
      setTransactions(res.data.transactions);
    } catch {
      showStatus('error',"Could not fetch transactions.");
    }
  };

  return (
    <div className=" text-black">
      {/* Message */}
      <StatusBar status={status} message={message} visible={visible} onClose={() => setVisible(false)} />
      <div className=" grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Register Nonprofit */}
        <Card className="bg-white text-black shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold"><ShieldUser className="h-8 w-8" /> Register Nonprofit</h2>
            <Input
              placeholder="Enter your organization name"
              value={nonprofitName}
              onChange={(e) => setNonprofitName(e.target.value)}
            />
            <Button onClick={registerNonprofit} className="w-full">Register</Button>
            {publicKey && (
              <div className="bg-gray-100 p-4 rounded text-sm space-y-3">
                <p><strong><KeyRound className="h-5 w-5"/> Your Keys</strong></p>
                <p><strong>Public Key:</strong><br /><code className="block break-words">{publicKey}</code></p>
                <p><strong>Secret Key:</strong><br /><code className="block break-words">{donorSecret}</code></p>
                <p className="text-red-500 text-xs">Keep this private and secure!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Send Donation */}
        <Card className="bg-white text-black shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold"><Forward className="h-8 w-8"/> Send Donation</h2>
            <p className="text-lg/3 flex items-center"><User className="h-5 w-5"/>Enter your secret key</p>
            <Input
              placeholder="your secret key"
              value={sourceSecret}
              onChange={(e) => setSourceSecret(e.target.value)}
            />
            <p className="text-lg/3 flex items-center"><Key className="h-5 w-5"/>Enter recipient's public key</p>
            <Input
              placeholder="recipient's public key"
              value={destinationPublic}
              onChange={(e) => setDestinationPublic(e.target.value)}
            />
            <p className="text-lg/3 flex items-center "><DollarSign className="h-5 w-5"/>Enter amount to donate</p>
            <Input
              placeholder="XML"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button onClick={sendDonation} className="w-full">Donate</Button>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <div className="max-w-4xl mx-auto mt-10">
        <Card className="bg-white text-black shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><History className="h-8 w-8" /> Transactions</h2>
              <Button  onClick={fetchTransactions}> Refresh</Button>
            </div>
            <ul className="space-y-3 text-sm">
              {transactions.length > 0 ? (
                transactions.map((tx, i) => (
                  <li key={i} className="bg-gray-100 p-3 rounded">
                    <p><strong>→</strong> {tx.amount} XLM</p>
                    <p className="truncate">Txn ID: {tx.id}</p>
                    <p className="text-gray-600 text-xs">{new Date(tx.timestamp).toLocaleString()}</p>
                  </li>
                ))
              ) : (
                <li>No transactions yet.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
}
