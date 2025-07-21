
import React, { useState, useEffect } from "react";
import { UserProfile } from "@/api/entities";
import { Transaction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, DollarSign, TrendingUp, Globe, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalVolume: 0,
    totalTransactions: 0,
    averageTransaction: 0,
    recentUsers: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const users = await UserProfile.list();
      const transactions = await Transaction.list();

      const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      const averageTransaction = transactions.length ? totalVolume / transactions.length : 0;
      const activeUsers = users.filter(user => user.transaction_count > 0).length;

      setAnalytics({
        totalUsers: users.length,
        activeUsers,
        totalVolume,
        totalTransactions: transactions.length,
        averageTransaction,
        recentUsers: users.slice(0, 5)
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-8">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track platform metrics and user activity</p>
        </div>
        <Badge className="bg-amber-100 text-amber-800">
          Admin Access
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-morphism border-0 premium-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-blue-600" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analytics.totalUsers}
            </div>
            <p className="text-sm text-gray-600">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-0 premium-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-green-600" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analytics.activeUsers}
            </div>
            <p className="text-sm text-gray-600">
              {((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-0 premium-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
              Total Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              ${analytics.totalVolume.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">USDC processed</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-0 premium-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Avg Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              ${analytics.averageTransaction.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card className="glass-morphism border-0 premium-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Recent Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">@{user.username}</span>
                      {user.is_verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{user.country}</span>
                      <span>{user.profession}</span>
                      <span>{user.transaction_count} transactions</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    ${(user.total_received || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">received</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-morphism border-0 premium-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Pakistan", "Bangladesh", "Nigeria", "UAE"].map((country) => {
                const userCount = analytics.recentUsers.filter(u => u.country === country).length;
                const percentage = analytics.totalUsers ? (userCount / analytics.totalUsers * 100) : 0;
                
                return (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-gray-700">{country}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-0 premium-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Transaction Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["freelance", "family", "rent", "business"].map((category) => {
                // This would be calculated from actual transaction data
                const percentage = Math.random() * 40 + 10; // Simulated for demo
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
