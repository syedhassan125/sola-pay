import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, User, DollarSign, CreditCard, Wallet, Tag } from "lucide-react";

export default function TransactionPreview({ formData, currentUser, onConfirm, isLoading }) {
  const fee = parseFloat(formData.amount) * 0.001;
  const total = parseFloat(formData.amount) + fee;

  return (
    <Card className="glass-morphism border-0 premium-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Review Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Summary */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
          <h3 className="font-semibold text-lg mb-4">Transaction Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">From</span>
              </div>
              <div className="font-medium">@{currentUser?.username}</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">To</span>
              </div>
              <div className="font-medium">@{formData.recipient?.username}</div>
            </div>
          </div>
        </div>

        {/* Amount Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold">Amount Breakdown</h3>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Send Amount:</span>
                             <span className="font-semibold text-xl">{parseFloat(formData.amount).toFixed(4)} SOL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Network Fee:</span>
                             <span className="text-green-600">{fee.toFixed(6)} SOL</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total from wallet:</span>
                                 <span className="font-bold text-lg">{total.toFixed(6)} SOL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <h3 className="font-semibold">Payment Method</h3>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {formData.paymentMethod === "wallet" ? (
              <>
                <Wallet className="w-5 h-5 text-blue-600" />
                <span>Wallet Balance</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Instant</Badge>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 text-purple-600" />
                <span>Pay Later Credit</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">30 days to pay</Badge>
              </>
            )}
          </div>
        </div>

        {/* Metadata */}
        {(formData.metadata.category || formData.metadata.description) && (
          <div className="space-y-2">
            <h3 className="font-semibold">Payment Details</h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              {formData.metadata.category && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Category:</span>
                  <Badge variant="outline">{formData.metadata.category}</Badge>
                </div>
              )}
              {formData.metadata.description && (
                <div>
                  <span className="text-sm text-gray-600">Description:</span>
                  <p className="text-sm mt-1">{formData.metadata.description}</p>
                </div>
              )}
              {formData.metadata.invoice_number && (
                <div>
                  <span className="text-sm text-gray-600">Reference:</span>
                  <p className="text-sm mt-1 font-mono">{formData.metadata.invoice_number}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Processing Time */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Processing Time</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            {formData.paymentMethod === "wallet" 
              ? "Transaction will complete within 5-10 seconds on Solana"
              : "Pay Later transaction will be processed instantly, payment due in 30 days"
            }
          </p>
        </div>

        {/* Confirmation Button */}
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Transaction...
            </div>
          ) : (
            `Confirm & Send $${parseFloat(formData.amount).toFixed(2)}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
}