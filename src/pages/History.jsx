
import React, { useState, useEffect } from "react";
import { UserProfile } from "@/api/entities";
import { Transaction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function HistoryPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, statusFilter, categoryFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const profiles = await UserProfile.list().catch(() => []);
      const currentProfile = profiles[0] || null;
      setCurrentUser(currentProfile);

      const allTransactions = await Transaction.list("-created_date").catch(() => []);
      const userTransactions = allTransactions.filter(tx => 
        tx.sender_username === currentProfile?.username || 
        tx.receiver_username === currentProfile?.username
      );
      setTransactions(userTransactions);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.sender_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.receiver_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.metadata?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(tx => tx.metadata?.category === categoryFilter);
    }

    setFilteredTransactions(filtered);
  };

  const getTransactionType = (transaction) => {
    return transaction.receiver_username === currentUser?.username ? 'received' : 'sent';
  };

  const getOtherUser = (transaction) => {
    return transaction.receiver_username === currentUser?.username 
      ? transaction.sender_username 
      : transaction.receiver_username;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Transaction History</h1>
        <p className="text-gray-600">Track all your payments and receipts</p>
      </div>

      {/* Filters */}
      <Card className="glass-morphism border-0 premium-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="pay_later">Pay Later</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="tuition">Tuition</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setCategoryFilter("all");
            }} variant="outline">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="glass-morphism border-0 premium-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-green-600" />
            Transactions ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => {
                const type = getTransactionType(transaction);
                const otherUser = getOtherUser(transaction);
                
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        type === 'received' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {type === 'received' ? 
                          <ArrowDownLeft className="w-6 h-6 text-green-600" /> : 
                          <ArrowUpRight className="w-6 h-6 text-blue-600" />
                        }
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {type === 'received' ? 'From' : 'To'} @{otherUser}
                          </span>
                          <Badge variant="outline" className={`text-xs ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            transaction.status === 'pay_later' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status?.replace('_', ' ') || 'unknown'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(transaction.created_date), "MMM d, yyyy 'at' h:mm a")}
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
                      <div className={`font-semibold text-lg ${type === 'received' ? 'text-green-600' : 'text-blue-600'}`}>
                        {type === 'received' ? '+' : '-'}${(transaction.amount || 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Fee: ${(transaction.fee || 0).toFixed(3)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
