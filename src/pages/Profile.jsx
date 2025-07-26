<Card className="glass-morphism border-0 premium-shadow">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <User className="w-5 h-5 text-indigo-600" />
        Profile Information
      </CardTitle>
      <Button 
        onClick={() => setIsEditing(!isEditing)}
        variant={isEditing ? "outline" : "default"}
      >
        {isEditing ? "Cancel" : "Edit Profile"}
      </Button>
    </div>
  </CardHeader>

  <CardContent className="space-y-6">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
        <User className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">@{currentUser?.username}</h2>
        <div className="flex items-center gap-2 mt-1">
          {currentUser?.is_verified ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              Pending Verification
            </Badge>
          )}
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Score: {currentUser?.reputation_score || 100}
          </Badge>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        {isEditing ? (
          <Input
            id="country"
            value={formData.country || ""}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
        ) : (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{currentUser?.country || "Not specified"}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        {isEditing ? (
          <Input
            id="phone"
            value={formData.phone_number || ""}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          />
        ) : (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{currentUser?.phone_number || "Not specified"}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profession">Profession</Label>
        {isEditing ? (
          <Input
            id="profession"
            value={formData.profession || ""}
            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
          />
        ) : (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span>{currentUser?.profession || "Not specified"}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="wallet_provider">Wallet Provider</Label>
        {isEditing ? (
          <Select
            value={formData.wallet_provider || ""}
            onValueChange={(value) => setFormData({ ...formData, wallet_provider: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select wallet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phantom">Phantom</SelectItem>
              <SelectItem value="solflare">Solflare</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Wallet className="w-4 h-4 text-gray-500" />
            <span>{currentUser?.wallet_provider || "Not specified"}</span>
          </div>
        )}
      </div>
    </div>

    {isEditing && (
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-purple-600">
          Save Changes
        </Button>
      </div>
    )}
  </CardContent>
</Card>




