/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Badge } from '@/styles/components/ui/badge';
// import { Progress } from '@/styles/components/ui/progress';
import { 
  Zap, 
  Bookmark, 
  Mail, 
  User, 
  Briefcase, 
  Target, 
  BarChart3, 
  Calendar,
  MessageSquare,
  FileText,
  Building,
  CheckCircle2,
  Clock,
  ArrowUp,
  Eye,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';

import dashboardData from './data.json';

type QuickActionVariant = 'primary' | 'secondary' | 'outline';
type ActivityStatus = 'success' | 'upcoming' | 'unread' | 'info';
type ActivityType = 'application' | 'message' | 'interview' | 'profile';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  link: string;
  count: number;
  variant: 'primary' | 'secondary' | 'outline';
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

interface PerformanceMetric {
  date: string;
  applied: number;
  interviews: number;
  offers: number;
}

interface SkillMetric {
  skill: string;
  matchRate: number;
  demand: number;
}

function isValidQuickActionVariant(variant: string): variant is QuickActionVariant {
  return ['primary', 'secondary', 'outline'].includes(variant);
}

function isValidActivityStatus(status: string): status is ActivityStatus {
  return ['success', 'upcoming', 'unread', 'info'].includes(status);
}

function isValidActivityType(type: string): type is ActivityType {
  return ['application', 'message', 'interview', 'profile'].includes(type);
}

// Data validation functions
const validateQuickActions = (data: any[]): QuickAction[] => {
  return data.map(action => ({
    ...action,
    variant: isValidQuickActionVariant(action.variant) ? action.variant : 'secondary'
  }));
};

const validateRecentActivity = (data: any[]): RecentActivity[] => {
  return data.map(activity => ({
    ...activity,
    type: isValidActivityType(activity.type) ? activity.type : 'application',
    status: isValidActivityStatus(activity.status) ? activity.status : 'info'
  }));
};

export default function DashboardPage() {
  const [stats] = useState(dashboardData.dashboardStats.summary);
  const [recentActivity] = useState<RecentActivity[]>(() => 
    validateRecentActivity(dashboardData.dashboardStats.recentActivity)
  );
  const [quickActions] = useState<QuickAction[]>(() => 
    validateQuickActions(dashboardData.dashboardStats.quickActions)
  );
  const [performanceMetrics] = useState<PerformanceMetric[]>(dashboardData.dashboardStats.performanceMetrics.applicationsOverTime);
  const [skillMetrics] = useState<SkillMetric[]>(dashboardData.dashboardStats.performanceMetrics.skillMatchDistribution);

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Zap: <Zap className="h-5 w-5" />,
      Bookmark: <Bookmark className="h-5 w-5" />,
      Mail: <Mail className="h-5 w-5" />,
      User: <User className="h-5 w-5" />,
      Briefcase: <Briefcase className="h-5 w-5" />,
      Target: <Target className="h-5 w-5" />,
    };
    return icons[iconName] || <Activity className="h-5 w-5" />;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { label: 'Completed', variant: 'default' as const },
      upcoming: { label: 'Upcoming', variant: 'secondary' as const },
      unread: { label: 'Unread', variant: 'destructive' as const },
      info: { label: 'Info', variant: 'outline' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.info;
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  const getActivityIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      application: <FileText className="h-4 w-4 text-blue-600" />,
      message: <MessageSquare className="h-4 w-4 text-green-600" />,
      interview: <Calendar className="h-4 w-4 text-purple-600" />,
      profile: <Eye className="h-4 w-4 text-orange-600" />,
    };
    return icons[type] || <Activity className="h-4 w-4" />;
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Welcome Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Welcome back, John!</h1>
              <p className="text-muted-foreground">
                Here&apos;s your job search overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Quick Stats Overview */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Applications */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalApplications}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span>+2 this week</span>
                  </div>
                </CardContent>
              </Card>

              {/* Interview Rate */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.interviewRate}%</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowUp className="h-3 w-3 text-green-600" />
                    <span>+5% from last month</span>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Views */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Completeness</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.profileCompleteness}%</div>
                  {/* <Progress value={stats.profileCompleteness} className="h-2 mt-2" /> */}
                </CardContent>
              </Card>

              {/* Response Rate */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.responseRate}%</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 text-blue-600" />
                    <span>Avg. response: 2 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Important tasks that need your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.link}>
                      <Card className={`hover:shadow-md transition-shadow cursor-pointer ${
                        action.variant === 'primary' ? 'border-blue-300 bg-blue-50' : ''
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              action.variant === 'primary' ? 'bg-blue-100 text-blue-600' :
                              action.variant === 'secondary' ? 'bg-green-100 text-green-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {getIcon(action.icon)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{action.title}</h3>
                              <p className="text-xs text-muted-foreground">{action.description}</p>
                            </div>
                            {action.count > 0 && (
                              <Badge variant={action.variant === 'primary' ? 'default' : 'secondary'}>
                                {action.count}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Recent Activity & Performance */}
              <div className="lg:col-span-2 space-y-6">
                {/* Application Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Application Performance
                    </CardTitle>
                    <CardDescription>
                      Your job application metrics over the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{stats.totalApplications}</div>
                          <div className="text-sm text-muted-foreground">Applied</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round(stats.totalApplications * (stats.interviewRate / 100))}
                          </div>
                          <div className="text-sm text-muted-foreground">Interviews</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(stats.totalApplications * (stats.offerRate / 100))}
                          </div>
                          <div className="text-sm text-muted-foreground">Offers</div>
                        </div>
                      </div>
                      
                      {/* Simple bar chart */}
                      <div className="space-y-2">
                        {performanceMetrics.slice(-4).map((metric, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="text-sm w-20">
                              {new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="flex-1 flex gap-1">
                              <div 
                                className="bg-blue-600 rounded-l h-6"
                                style={{ width: `${(metric.applied / 5) * 100}%` }}
                                title={`Applied: ${metric.applied}`}
                              ></div>
                              <div 
                                className="bg-purple-600 h-6"
                                style={{ width: `${(metric.interviews / 5) * 100}%` }}
                                title={`Interviews: ${metric.interviews}`}
                              ></div>
                              <div 
                                className="bg-green-600 rounded-r h-6"
                                style={{ width: `${(metric.offers / 5) * 100}%` }}
                                title={`Offers: ${metric.offers}`}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skill Match Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Skill Match Analysis
                    </CardTitle>
                    <CardDescription>
                      How your skills match current market demands
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {skillMetrics.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.skill}</span>
                            <span className="text-muted-foreground">
                              {skill.matchRate}% match • {skill.demand}% demand
                            </span>
                          </div>
                          <div className="flex gap-1 h-2">
                            <div 
                              className="bg-green-600 rounded-l"
                              style={{ width: `${skill.matchRate}%` }}
                            ></div>
                            <div 
                              className="bg-blue-600 rounded-r"
                              style={{ width: `${skill.demand}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Recent Activity & Upcoming */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Latest updates from your job search
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">{activity.title}</h4>
                              {getStatusBadge(activity.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleDateString()} • 
                              {' '}{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Interviews */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Interviews
                    </CardTitle>
                    <CardDescription>
                      Next scheduled interviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="p-2 rounded-lg bg-purple-100">
                          <Building className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">TechCorp Inc.</h4>
                          <p className="text-sm text-muted-foreground">Senior Frontend Developer</p>
                          <p className="text-xs text-muted-foreground">
                            Jan 25, 2024 • 2:00 PM EST
                          </p>
                        </div>
                        <Badge variant="secondary">Video Call</Badge>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="p-2 rounded-lg bg-green-100">
                          <Building className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">DesignStudio</h4>
                          <p className="text-sm text-muted-foreground">Product Designer</p>
                          <p className="text-xs text-muted-foreground">
                            Jan 28, 2024 • 10:00 AM EST
                          </p>
                        </div>
                        <Badge variant="outline">Phone Screen</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Strength */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Profile Strength
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Resume Profiles</span>
                        <span>3/5 complete</span>
                      </div>
                      {/* <Progress value={60} className="h-2" /> */}
                      
                      <div className="flex justify-between text-sm">
                        <span>Skills & Experience</span>
                        <span>85% complete</span>
                      </div>
                      {/* <Progress value={85} className="h-2" /> */}
                      
                      <div className="flex justify-between text-sm">
                        <span>Portfolio</span>
                        <span>40% complete</span>
                      </div>
                      {/* <Progress value={40} className="h-2" /> */}
                      
                      <Button variant="outline" className="w-full mt-2" asChild>
                        <Link href="/dashboard/profile">
                          Complete Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Bottom Section - Quick Links */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Navigation</CardTitle>
                <CardDescription>
                  Jump directly to any section of your job search dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Link href="/dashboard/jobs">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-semibold">Job Recommendations</h3>
                        <p className="text-sm text-muted-foreground">Find your next opportunity</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/dashboard/saved-jobs">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Bookmark className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h3 className="font-semibold">Saved Jobs</h3>
                        <p className="text-sm text-muted-foreground">Research & compare</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/dashboard/applications">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Briefcase className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <h3 className="font-semibold">Applications</h3>
                        <p className="text-sm text-muted-foreground">Track your progress</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/dashboard/messages">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Mail className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <h3 className="font-semibold">Messages</h3>
                        <p className="text-sm text-muted-foreground">Communicate with recruiters</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}