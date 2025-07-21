import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Shield, TrendingUp } from "lucide-react";

export default function WelcomeSection({ userProfile, isLoading }) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  if (isLoading) {
    return (
      <Card className="glass-morphism border-0 premium-shadow">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism border-0 premium-shadow overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full transform translate-x-8 -translate-y-8" />
      <CardContent className="p-8 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {greeting}, {userProfile?.username || "there"}! 👋
            </h1>
            <p className="text-gray-600 mb-4">
              Ready to send money across borders with minimal fees?
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                {userProfile?.is_verified ? 'Verified' : 'Pending Verification'}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Wallet className="w-3 h-3 mr-1" />
                {userProfile?.wallet_provider || 'Phantom'} Connected
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                Score: {userProfile?.reputation_score || 100}
              </Badge>
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
  );
}