'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Input } from '@/styles/components/ui/input';
// import { Textarea } from '@/styles/components/ui/textarea';
import { Label } from '@/styles/components/ui/label';
import { Badge } from '@/styles/components/ui/badge';
// import { Progress } from '@/styles/components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  Edit,
  Save,
  Upload,
  Shield,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// Mock data - in real app, this would come from your database
const initialAccountData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Experienced frontend developer with 5+ years in React and TypeScript. Passionate about building scalable web applications.",
  },
  credibility: {
    score: 87,
    level: "Excellent",
    trend: "up",
    change: 5,
    factors: [
      { name: "Profile Completeness", score: 95, impact: "high" },
      { name: "Response Rate", score: 92, impact: "high" },
      { name: "Recruiter Ratings", score: 85, impact: "medium" },
      { name: "Application Quality", score: 88, impact: "high" },
      { name: "Verification Status", score: 100, impact: "medium" }
    ],
    ratings: [
      { recruiter: "TechCorp HR", rating: 5, comment: "Excellent candidate, very professional", date: "2024-01-15" },
      { recruiter: "DesignStudio", rating: 4, comment: "Good communication skills", date: "2024-01-10" },
      { recruiter: "StartupGrid", rating: 5, comment: "Very responsive and prepared", date: "2024-01-05" }
    ]
  },
  verification: {
    email: true,
    phone: true,
    identity: false,
    workHistory: true
  }
};

export default function AccountPage() {
  const [accountData, setAccountData] = useState(initialAccountData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(accountData.personalInfo);

  const handleSave = () => {
    setAccountData(prev => ({
      ...prev,
      personalInfo: editedData
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(accountData.personalInfo);
    setIsEditing(false);
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactBadge = (impact: string) => {
    const config = {
      high: { label: 'High Impact', variant: 'default' as const },
      medium: { label: 'Medium Impact', variant: 'secondary' as const },
      low: { label: 'Low Impact', variant: 'outline' as const }
    };
    return config[impact as keyof typeof config] || config.medium;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-muted-foreground">
            Manage your personal information and credibility score
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                This information helps recruiters learn more about you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={editedData.firstName}
                    onChange={(e) => setEditedData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editedData.lastName}
                    onChange={(e) => setEditedData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedData.email}
                  onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editedData.phone}
                    onChange={(e) => setEditedData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editedData.location}
                    onChange={(e) => setEditedData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                {/* <Textarea
                  id="bio"
                  value={editedData.bio}
                  onChange={(e) => setEditedData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell recruiters about your professional background and skills..."
                /> */}
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Status
              </CardTitle>
              <CardDescription>
                Verified accounts get higher credibility scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {accountData.verification.email ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">Email Address</div>
                      <div className="text-sm text-muted-foreground">{accountData.personalInfo.email}</div>
                    </div>
                  </div>
                  <Badge variant={accountData.verification.email ? "default" : "secondary"}>
                    {accountData.verification.email ? "Verified" : "Not Verified"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {accountData.verification.phone ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">Phone Number</div>
                      <div className="text-sm text-muted-foreground">{accountData.personalInfo.phone}</div>
                    </div>
                  </div>
                  <Badge variant={accountData.verification.phone ? "default" : "secondary"}>
                    {accountData.verification.phone ? "Verified" : "Not Verified"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {accountData.verification.identity ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">Identity Verification</div>
                      <div className="text-sm text-muted-foreground">Government ID required</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {accountData.verification.identity ? "Verified" : "Verify Now"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {accountData.verification.workHistory ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">Work History</div>
                      <div className="text-sm text-muted-foreground">Previous employment verification</div>
                    </div>
                  </div>
                  <Badge variant={accountData.verification.workHistory ? "default" : "secondary"}>
                    {accountData.verification.workHistory ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Credibility Score */}
        <div className="space-y-6">
          {/* Credibility Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Credibility Score
              </CardTitle>
              <CardDescription>
                Based on recruiter ratings and platform activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className={`text-6xl font-bold ${getCredibilityColor(accountData.credibility.score)}`}>
                  {accountData.credibility.score}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {accountData.credibility.trend === 'up' ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    accountData.credibility.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {accountData.credibility.trend === 'up' ? '+' : ''}{accountData.credibility.change} points
                  </span>
                  <span className="text-muted-foreground">this month</span>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {accountData.credibility.level} Standing
                </Badge>
                
                {/* <Progress value={accountData.credibility.score} className="h-2" /> */}
                
                <div className="text-sm text-muted-foreground">
                  Top 15% of job seekers on WorkNest
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Score Factors</CardTitle>
              <CardDescription>What impacts your credibility score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {accountData.credibility.factors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{factor.name}</span>
                    <span className="font-medium">{factor.score}%</span>
                  </div>
                  {/* <Progress value={factor.score} className="h-1" /> */}
                  <div className="flex justify-between">
                    <Badge variant={getImpactBadge(factor.impact).variant}>
                      {getImpactBadge(factor.impact).label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {factor.impact === 'high' ? 'High impact' : 
                       factor.impact === 'medium' ? 'Medium impact' : 'Low impact'}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Ratings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Recent Ratings
              </CardTitle>
              <CardDescription>Feedback from recruiters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {accountData.credibility.ratings.map((rating, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{rating.recruiter}</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < rating.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rating.comment}</p>
                  <div className="text-xs text-muted-foreground">
                    {new Date(rating.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Export Data
        </Button>
        <Button variant="outline">
          Download Profile PDF
        </Button>
        <Button>
          Save All Changes
        </Button>
      </div>
    </div>
  );
}