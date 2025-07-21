import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";

export default function BalanceCard({ userProfile, isLoading }) {
  const [showBalance, setShowBalance] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Simulated balance - in real app this would come from Solana wallet
  const balance = 1247.83;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (isLoading) {
    return (
      <Card className="glass-morphism border-0 premium-shadow">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism border-0 premium-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">USDC Balance</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
            className="h-8 w-8"
          >
            {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              {showBalance ? `$${balance.toFixed(2)}` : '••••••'}
            </div>
            <p className="text-sm text-gray-600">
              Available for sending • Low fees on Solana
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
  );
}