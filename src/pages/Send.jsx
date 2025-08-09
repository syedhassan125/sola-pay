import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { api } from "@/lib/api";
import { toast } from "sonner";

import SendForm from "../components/send/SendForm";
import RecipientSearch from "../components/send/RecipientSearch";
import PaymentMethodSelector from "../components/send/PaymentMethodSelector";
import TransactionPreview from "../components/send/TransactionPreview";

export default function SendPage() {
  const [currentUser] = useState({
    id: 1,
    username: "you",
    wallet_address: "",
    total_sent: 200,
    transaction_count: 5,
    credit_used: 0,
  });
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient: null,
    recipientAddress: "",
    amount: "",
    paymentMethod: "wallet",
    metadata: {
      category: "",
      description: "",
      invoice_number: ""
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      const hasRecipient = !!formData.recipient || !!formData.recipientAddress;
      if (!hasRecipient) {
        setError("Please select a recipient or enter a wallet address");
        return;
      }
      if (formData.recipientAddress) {
        try { new PublicKey(formData.recipientAddress.trim()); }
        catch { setError("Invalid base58 Solana address"); return; }
      }
    }
    if (step === 2 && (!formData.amount || parseFloat(formData.amount) <= 0)) {
      setError("Please enter a valid amount");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const resolveRecipientAddress = () => {
    if (formData.recipientAddress) return formData.recipientAddress.trim();
    return "";
  };

  const handleSendMoney = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!publicKey) {
        throw new Error("Connect your wallet first");
      }

      const recipientAddressBase58 = resolveRecipientAddress();
      try { new PublicKey(recipientAddressBase58); } catch { throw new Error("Invalid base58 Solana address"); }

      const recipientPubkey = new PublicKey(recipientAddressBase58);
      const lamports = Math.round(parseFloat(formData.amount) * LAMPORTS_PER_SOL);
      if (!Number.isFinite(lamports) || lamports <= 0) {
        throw new Error("Invalid amount");
      }

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signature = await sendTransaction(tx, connection);

      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

      const network = "devnet";
      const fiatCurrency = import.meta.env.VITE_DEFAULT_FIAT || "GBP";

      try {
        await api.sendRecord({
          signature,
          from: publicKey.toBase58(),
          to: recipientAddressBase58,
          amountLamports: lamports,
          network,
          fiatCurrency,
        });
      } catch (e) {
        console.warn("Failed to record transaction:", e?.message || e);
      }

      const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
      toast.success(
        "Payment sent successfully",
        { description: `Signature: ${signature.slice(0,8)}...`, action: { label: "View", onClick: () => window.open(explorerUrl, "_blank") } }
      );

      setSuccess(true);
    } catch (error) {
      setError(error.message || "Failed to send payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      recipient: null,
      recipientAddress: "",
      amount: "",
      paymentMethod: "wallet",
      metadata: {
        category: "",
        description: "",
        invoice_number: ""
      }
    });
    setSuccess(false);
    setError(null);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-morphism border-0 premium-shadow">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Sent!</h2>
            <p className="text-gray-600 mb-6">
              Your payment of {formData.amount} SOL to @{formData.recipient?.username || formData.recipientAddress} has been 
              {formData.paymentMethod === "pay_later" ? " scheduled" : " completed successfully"}.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={resetForm} variant="outline">
                Send Another
              </Button>
              <Link to={createPageUrl("History")}>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  View History
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to={createPageUrl("Dashboard")}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">Send Money</h1>
          <p className="text-gray-600">Send SOL globally with minimal fees</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber <= step 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-12 h-1 ${
                  stepNumber < step ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <RecipientSearch 
            onRecipientSelect={(recipient) => setFormData({...formData, recipient, recipientAddress: formData.recipientAddress})}
            selectedRecipient={formData.recipient}
            recipientAddress={formData.recipientAddress}
            onRecipientAddressChange={(addr) => setFormData({...formData, recipientAddress: addr})}
          />
        )}

        {step === 2 && (
          <SendForm 
            formData={formData}
            setFormData={setFormData}
            currentUser={currentUser}
          />
        )}

        {step === 3 && (
          <PaymentMethodSelector
            formData={formData}
            setFormData={setFormData}
            currentUser={currentUser}
          />
        )}

        {step === 4 && (
          <TransactionPreview
            formData={formData}
            currentUser={currentUser}
            onConfirm={handleSendMoney}
            isLoading={isLoading}
          />
        )}

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1 || isLoading}
          >
            Back
          </Button>
          
          {step < 4 ? (
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSendMoney}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-600 to-emerald-600"
            >
              {isLoading ? "Processing..." : "Send Money"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}