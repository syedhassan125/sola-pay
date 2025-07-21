import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, History } from "lucide-react";
import { format } from "date-fns";

const statusIcons = {
  completed: <CheckCircle className="w-4 h-4 text-green-500" />,
  pending: <Clock className="w-4 h-4 text-yellow-500" />,
  failed: <XCircle className="w-4 h-4 text-red-500" />,
  pay_later: <Clock className="w-4 h-4 text-purple-500" />
};

const statusColors = {
  completed: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  pay_later: "bg-purple-100 text-purple-800 border-purple-200"
};

const categoryColors = {
  freelance: "bg-blue-100 text-blue-800",
  rent: "bg-green-100 text-green-800",
  tuition: "bg-purple-100 text-purple-800",
  family: "bg-pink-100 text-pink-800",
  business: "bg-indigo-100 text-indigo-800",
  other: "bg-gray-100 text-gray-800"
};

export default function RecentTransactions({ transactions, isLoading, userProfile }) {
  if (isLoading) {
    return (
      <Card className="glass-morphism border-0 premium-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism border-0 premium-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Recent Activity
          </CardTitle>
          <Link to={createPageUrl("History")}>
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-600 mb-4">Start by sending your first payment</p>
            <Link to={createPageUrl("Send")}>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                Send Money
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const isReceived = transaction.receiver_username === userProfile?.username;
              const otherUser = isReceived ? transaction.sender_username : transaction.receiver_username;
              
              return (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isReceived ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {isReceived ? 
                        <ArrowDownLeft className="w-5 h-5 text-green-600" /> : 
                        <ArrowUpRight className="w-5 h-5 text-blue-600" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {isReceived ? 'From' : 'To'} @{otherUser}
                        </span>
                        {statusIcons[transaction.status]}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {format(new Date(transaction.created_date), "MMM d, h:mm a")}
                        </span>
                        {transaction.metadata?.category && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${categoryColors[transaction.metadata.category]}`}
                          >
                            {transaction.metadata.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold ${isReceived ? 'text-green-600' : 'text-blue-600'}`}>
                      {isReceived ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                    <Badge variant="outline" className={`text-xs ${statusColors[transaction.status]}`}>
                      {transaction.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}