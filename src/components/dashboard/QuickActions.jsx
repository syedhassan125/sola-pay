import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Send, QrCode, History, Users, Zap, Globe } from "lucide-react";

const quickActions = [
  {
    title: "Send Money",
    description: "Send USDC globally",
    icon: Send,
    url: createPageUrl("Send"),
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 hover:bg-blue-100"
  },
  {
    title: "QR Payment",
    description: "Request or scan to pay",
    icon: QrCode,
    url: createPageUrl("QRPayments"),
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50 hover:bg-purple-100"
  },
  {
    title: "Transaction History",
    description: "View all payments",
    icon: History,
    url: createPageUrl("History"),
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 hover:bg-green-100"
  },
  {
    title: "Pay Later",
    description: "Use credit line",
    icon: Zap,
    url: createPageUrl("PayLater"),
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 hover:bg-amber-100"
  }
];

export default function QuickActions() {
  return (
    <Card className="glass-morphism border-0 premium-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.url}>
              <div className={`${action.bgColor} rounded-xl p-4 transition-all duration-200 hover:scale-105 cursor-pointer group`}>
                <div className="text-center space-y-3">
                  <div className={`w-12 h-12 mx-auto bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-gray-600">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}