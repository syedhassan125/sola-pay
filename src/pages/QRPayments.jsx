import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QrCode, Camera, DollarSign, Share2, Copy, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ✅ Mock UserProfile object to simulate API
const UserProfile = {
  list: async () => {
    return [
      {
        id: 1,
        username: "demo_user",
        is_verified: true,
        country: "Pakistan",
        phone_number: "+92XXXXXXXXX",
        profession: "Developer",
        wallet_provider: "phantom",
        wallet_address: "FJd7F82Jx29JHds2Jf82hFJ83jf8DJf7",
        total_received: 120.5,
        total_sent: 80.75,
        transaction_count: 15,
        reputation_score: 92
      }
    ];
  }
};

export default function QRPayments() {
  const [currentUser, setCurrentUser] = useState(null);
  const [requestAmount, setRequestAmount] = useState("");
  const [qrData, setQrData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const profiles = await UserProfile.list();
      setCurrentUser(profiles[0]);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const generateQR = () => {
    if (!requestAmount || !currentUser) return;

    const paymentData = {
      recipient: currentUser.username,
      amount: parseFloat(requestAmount),
      wallet: currentUser.wallet_address,
      timestamp: Date.now()
    };

    setQrData(paymentData);
  };

  const copyToClipboard = () => {
    const paymentUrl = `solapay://pay?to=${currentUser?.username}&amount=${requestAmount}`;
    navigator.clipboard.writeText(paymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">QR Payments</h1>
        <p className="text-gray-600">Request payments or scan to pay instantly</p>
      </div>

      <Tabs defaultValue="request" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request">Request Payment</TabsTrigger>
          <TabsTrigger value="scan">Scan to Pay</TabsTrigger>
        </TabsList>

        <TabsContent value="request">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-morphism border-0 premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Create Payment Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Request Amount (USDC)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <Button
                  onClick={generateQR}
                  disabled={!requestAmount || !currentUser}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  Generate QR Code
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-0 premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-purple-600" />
                  Payment QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {qrData ? (
                  <div className="space-y-4">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">${qrData.amount}</p>
                      <p className="text-gray-600">to @{qrData.recipient}</p>
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy Payment Link"}
                    </Button>
                  </div>
                ) : (
                  <div className="py-12">
                    <QrCode className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Enter amount to generate QR code</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scan">
          <Card className="glass-morphism border-0 premium-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Scan QR Code to Pay
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Camera className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <h3 className="font-semibold mb-2">QR Scanner</h3>
              <p className="text-gray-600 mb-6">Point your camera at a SolaPay QR code</p>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                Open Camera Scanner
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

