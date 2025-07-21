
import React, { useState, useEffect } from "react";
import { UserProfile } from "@/api/entities";
import { Transaction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Clock, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function PayLaterPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [payLaterTransactions, setPayLaterTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const profiles = await UserProfile.list();
      const currentProfile = profiles[0];
      setCurrentUser(currentProfile);

      const transactions = await Transaction.list("-created_date");
      const payLaterTxs = transactions.filter(tx => 
        tx.is_pay_later && tx.sender_username === currentProfile?.username
      );
      setPayLaterTransactions(payLaterTxs);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const availableCredit = (currentUser?.credit_limit || 0) - (currentUser?.credit_used || 0);
  const creditUtilization = currentUser?.credit_limit ? 
    ((currentUser.credit_used || 0) / currentUser.credit_limit) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Pay Later</h1>
        <p className="text-gray-600">Manage your credit line and upcoming payments</p>
      </div>

      {/* Credit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-morphism border-0 premium-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Available Credit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${availableCredit.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Ready to use</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-0 premium-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-red-600" />
              Used Credit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-2">
              ${(currentUser?.credit_used || 0).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-0 premium-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Credit Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {currentUser?.reputation_score || 100}
            </div>
            <p className="text-sm text-gray-600">Excellent rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Credit Utilization */}
      <Card className="glass-morphism border-0 premium-shadow">
        <CardHeader>
          <CardTitle>Credit Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Credit Limit</span>
              <span className="font-semibold">${(currentUser?.credit_limit || 0).toFixed(2)}</span>
            </div>
            <Progress value={creditUtilization} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Used: {creditUtilization.toFixed(1)}%</span>
              <span className="text-green-600">Available: {(100 - creditUtilization).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outstanding Payments */}
      <Card className="glass-morphism border-0 premium-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Outstanding Payments ({payLaterTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading payments...</div>
          ) : payLaterTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No outstanding payments</h3>
              <p className="text-gray-600">You're all caught up! Use Pay Later for your next transaction.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payLaterTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">To @{transaction.receiver_username}</span>
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          Pay Later
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {format(new Date(transaction.due_date), "MMM d, yyyy")}
                        </div>
                        {transaction.metadata?.category && (
                          <Badge variant="outline" className="text-xs">
                            {transaction.metadata.category}
                          </Badge>
                        )}
                      </div>
                      {transaction.metadata?.description && (
                        <p className="text-sm text-gray-500 mt-1">{transaction.metadata.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-lg text-purple-600">
                      ${transaction.amount.toFixed(2)}
                    </div>
                    <Button size="sm" className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600">
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
