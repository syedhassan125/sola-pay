import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

export default function PaymentMethodSelector({ formData, setFormData, currentUser }) {
  const availableCredit = (currentUser?.credit_limit || 0) - (currentUser?.credit_used || 0);
  const requestedAmount = parseFloat(formData.amount || 0);

  const paymentMethods = [
    {
      id: "wallet",
      title: "Wallet Balance",
      description: "Pay instantly from your connected wallet",
      icon: Wallet,
      color: "from-blue-500 to-indigo-600",
      available: true,
      instant: true
    },
    {
      id: "pay_later",
      title: "Pay Later",
      description: "Use your credit line, pay back within 30 days",
      icon: CreditCard,
      color: "from-purple-500 to-pink-600",
      available: availableCredit >= requestedAmount,
      instant: true,
      requiresCredit: true
    }
  ];

  return (
    <Card className="glass-morphism border-0 premium-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-600" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => method.available && setFormData({...formData, paymentMethod: method.id})}
            className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              formData.paymentMethod === method.id
                ? 'border-indigo-500 bg-indigo-50'
                : method.available
                ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center`}>
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{method.title}</h3>
                    {method.instant && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Instant
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  
                  {method.requiresCredit && (
                    <div className="mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        {method.available ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={method.available ? "text-green-600" : "text-red-600"}>
                          Available Credit: ${availableCredit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {formData.paymentMethod === method.id && (
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              )}
            </div>
          </div>
        ))}

        {/* Credit Info */}
        {currentUser?.credit_limit > 0 && (
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Pay Later Credit Line</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">Total Limit:</span>
                <span className="font-medium">${currentUser.credit_limit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Used:</span>
                <span className="font-medium">${(currentUser.credit_used || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Available:</span>
                <span className="font-medium text-green-600">${availableCredit.toFixed(2)}</span>
              </div>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentUser.credit_used || 0) / currentUser.credit_limit) * 100}%`
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}