import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Tag, FileText } from "lucide-react";

const categories = [
  { value: "freelance", label: "Freelance Work" },
  { value: "rent", label: "Rent Payment" },
  { value: "tuition", label: "Tuition Fees" },
  { value: "family", label: "Family Support" },
  { value: "business", label: "Business Payment" },
  { value: "other", label: "Other" }
];

export default function SendForm({ formData, setFormData, currentUser }) {
  const handleAmountChange = (value) => {
    setFormData({
      ...formData,
      amount: value
    });
  };

  const handleMetadataChange = (field, value) => {
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        [field]: value
      }
    });
  };

  const estimatedFee = formData.amount ? (parseFloat(formData.amount) * 0.001).toFixed(3) : "0.000";
  const totalAmount = formData.amount ? (parseFloat(formData.amount) + parseFloat(estimatedFee)).toFixed(3) : "0.000";

  return (
    <Card className="glass-morphism border-0 premium-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (SOL)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <Label>Payment Category</Label>
          <Select
            value={formData.metadata.category}
            onValueChange={(value) => handleMetadataChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {category.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="What is this payment for?"
            value={formData.metadata.description}
            onChange={(e) => handleMetadataChange("description", e.target.value)}
            className="h-20"
          />
        </div>

        {/* Invoice Number */}
        <div className="space-y-2">
          <Label htmlFor="invoice">Invoice/Reference Number (Optional)</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="invoice"
              placeholder="INV-001, REF-123, etc."
              value={formData.metadata.invoice_number}
              onChange={(e) => handleMetadataChange("invoice_number", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Fee Breakdown */}
        {formData.amount && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h3 className="font-medium text-gray-900">Transaction Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                                 <span>{parseFloat(formData.amount).toFixed(4)} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network Fee:</span>
                                 <span className="text-green-600">{estimatedFee} SOL</span>
              </div>
              <div className="border-t pt-1 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                                     <span>{totalAmount} SOL</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}