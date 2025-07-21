import React, { useState, useEffect } from "react";
import { UserProfile } from "@/api/entities";
import { Transaction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Send, User, DollarSign, CreditCard, Wallet, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import SendForm from "../components/send/SendForm";
import RecipientSearch from "../components/send/RecipientSearch";
import PaymentMethodSelector from "../components/send/PaymentMethodSelector";
import TransactionPreview from "../components/send/TransactionPreview";

export default function SendPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient: null,
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

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const profiles = await UserProfile.list();
      setCurrentUser(profiles[0]); // Simulated current user
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && !formData.recipient) {
      setError("Please select a recipient");
      return;
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

  const handleSendMoney = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create transaction record
      const transactionData = {
        sender_username: currentUser?.username,
        receiver_username: formData.recipient.username,
        sender_wallet: currentUser?.wallet_address,
        receiver_wallet: formData.recipient.wallet_address,
        amount: parseFloat(formData.amount),
        fee: parseFloat(formData.amount) * 0.001, // 0.1% fee
        status: formData.paymentMethod === "pay_later" ? "pay_later" : "completed",
        metadata: formData.metadata,
        is_pay_later: formData.paymentMethod === "pay_later",
        payment_method: formData.paymentMethod,
        transaction_id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      if (formData.paymentMethod === "pay_later") {
        transactionData.due_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days from now
      }

      await Transaction.create(transactionData);

      // Update user profiles (simplified)
      if (currentUser) {
        await UserProfile.update(currentUser.id, {
          total_sent: (currentUser.total_sent || 0) + parseFloat(formData.amount),
          transaction_count: (currentUser.transaction_count || 0) + 1,
          credit_used: formData.paymentMethod === "pay_later" ? 
            (currentUser.credit_used || 0) + parseFloat(formData.amount) : 
            currentUser.credit_used
        });
      }

      setSuccess(true);
    } catch (error) {
      setError("Failed to send payment. Please try again.");
      console.error("Error sending money:", error);
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      recipient: null,
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
              Your payment of ${formData.amount} to @{formData.recipient?.username} has been 
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
          <p className="text-gray-600">Send USDC globally with minimal fees</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Progress Indicator */}
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

      {/* Step Content */}
      <div className="space-y-6">
        {step === 1 && (
          <RecipientSearch 
            onRecipientSelect={(recipient) => setFormData({...formData, recipient})}
            selectedRecipient={formData.recipient}
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

        {/* Navigation Buttons */}
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