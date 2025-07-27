import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Search, MapPin, Briefcase, CheckCircle } from "lucide-react";

export default function RecipientSearch({ onRecipientSelect, selectedRecipient }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentRecipients, setRecentRecipients] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockUsers = [
    {
      id: 2,
      username: "jane_doe",
      email: "jane@example.com",
      country: "USA",
      profession: "Engineer",
      is_verified: true,
    },
    {
      id: 3,
      username: "mohamed123",
      email: "mo@example.com",
      country: "Egypt",
      profession: "Designer",
      is_verified: false,
    },
    {
      id: 4,
      username: "sarahk",
      email: "sarah@site.com",
      country: "UK",
      profession: "Developer",
      is_verified: true,
    }
  ];

  useEffect(() => {
    setRecentRecipients(mockUsers.slice(0, 2));
  }, []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const searchUsers = () => {
    setIsSearching(true);
    const filtered = mockUsers.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filtered);
    setIsSearching(false);
  };

  const UserCard = ({ user, isSelected, onClick }) => (
    <div 
      onClick={() => onClick(user)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">@{user.username}</span>
              {user.is_verified && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {user.country && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{user.country}</span>
                </div>
              )}
              {user.profession && (
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  <span>{user.profession}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {isSelected && (
          <CheckCircle className="w-5 h-5 text-indigo-600" />
        )}
      </div>
    </div>
  );

  return (
    <Card className="glass-morphism border-0 premium-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          Select Recipient
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchTerm.length > 2 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Search Results</h3>
            {isSearching ? (
              <div className="text-center py-4 text-gray-500">Searching...</div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No users found</div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    isSelected={selectedRecipient?.id === user.id}
                    onClick={onRecipientSelect}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Recipients */}
        {searchTerm.length <= 2 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Recent Recipients</h3>
            {recentRecipients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No recent recipients</p>
                <p className="text-sm">Search for users to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRecipients.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    isSelected={selectedRecipient?.id === user.id}
                    onClick={onRecipientSelect}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Recipient Summary */}
        {selectedRecipient && (
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Recipient Selected</span>
            </div>
            <p className="text-green-700">
              You're sending money to <strong>@{selectedRecipient.username}</strong>
              {selectedRecipient.country && ` in ${selectedRecipient.country}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

