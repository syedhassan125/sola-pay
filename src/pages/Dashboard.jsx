
import React, { useState, useEffect } from "react";
import { UserProfile } from "@/api/entities";
import { Transaction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  QrCode, 
  TrendingUp,
  Wallet,
  CreditCard,
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [solBalance, setSolBalance] = useState(null);

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then((bal) => {
        setSolBalance(bal / LAMPORTS_PER_SOL);
      });
    }
  }, [publicKey, connection]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const profiles = await UserProfile.list();
      const currentProfile = profiles[0];
      setUserProfile(currentProfile);

      const transactions = await Transaction.list("-created_date", 5);
      setRecentTransactions(transactions);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Card className="glass-morphism border-0 premium-shadow overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full transform translate-x-8 -translate-y-8" />
        <CardContent className="p-8 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {userProfile?.username || "User"}! 👋
              </h1>
              <p className="text-gray-600 mb-4">
                Ready to send money across borders with minimal fees?
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {userProfile?.is_verified ? 'Verified' : 'Pending Verification'}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {userProfile?.wallet_provider || 'Phantom'} Connected
                </Badge>
                {solBalance !== null && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {solBalance.toFixed(4)} SOL
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Wallet className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-morphism border-0 premium-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">SOL Balance</CardTitle>
              <Wallet className="w-5 h-5 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                    {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : "Loading..."}
                  </div>
                  <p className="text-sm text-gray-600">
                    Available for sending • Devnet Balance
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDownLeft className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Received</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      ${userProfile?.total_received?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUpRight className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Sent</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      ${userProfile?.total_sent?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="glass-morphism border-0 premium-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Pay Later</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Available Credit</span>
                  <span className="font-semibold text-green-600">
                    ${((userProfile?.credit_limit || 500) - (userProfile?.credit_used || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: "80%" }}
                  />
                </div>
              </div>
              <Link to={createPageUrl("PayLater")}>
                <Button variant="outline" className="w-full hover:bg-purple-50">
                  Manage Credit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

