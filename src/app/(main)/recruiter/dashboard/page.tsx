/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Badge } from '@/styles/components/ui/badge';
// import { Progress } from '@/styles/components/ui/progress';
import { 
  Briefcase,
  Users,
  Calendar,
  MessageSquare,
  UserCheck,
  BarChart3,
  TrendingUp,
  Award,
  Mail,
  Video,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock4
} from 'lucide-react';
import Link from 'next/link';

import recruiterData from './data.json';

interface QuickStat {
  activeJobs: number;
  totalApplications: number;
  upcomingInterviews: number;
  pendingOffers: number;
  hiresThisMonth: number;
  openPositions: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  priority: string;
  actionRequired: boolean;
}

interface Interview {
  id: string;
  candidate: string;
  job: string;
  date: string;
  type: string;
  interviewers: string[];
  status: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  link: string;
  count: number;
  variant: string;
}

export default function RecruiterDashboard() {
  const [dashboardData] = useState(recruiterData.dashboard);
  const [teamMembers] = useState(recruiterData.team.members);
  const [pipelineData] = useState(recruiterData.pipeline);

  const quickStats: QuickStat = dashboardData.quickStats;
  const recentActivity: RecentActivity[] = dashboardData.recentActivity;
  const upcomingInterviews: Interview[] = dashboardData.upcomingInterviews;
  const performanceMetrics = dashboardData.performanceMetrics;
  const quickActions: QuickAction[] = dashboardData.quickActions;

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Briefcase: <Briefcase className="h-5 w-5" />,
      Users: <Users className="h-5 w-5" />,
      Calendar: <Calendar className="h-5 w-5" />,
      UserCheck: <UserCheck className="h-5 w-5" />,
      MessageSquare: <MessageSquare className="h-5 w-5" />,
      BarChart3: <BarChart3 className="h-5 w-5" />,
    };
    return icons[iconName] || <Plus className="h-5 w-5" />;
  };

  const getActivityIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      application: <Users className="h-4 w-4 text-blue-600" />,
      interview: <Calendar className="h-4 w-4 text-purple-600" />,
      offer: <Award className="h-4 w-4 text-green-600" />,
      message: <MessageSquare className="h-4 w-4 text-orange-600" />,
    };
    return icons[type] || <AlertCircle className="h-4 w-4" />;
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      high: { label: 'High', variant: 'destructive' as const },
      medium: { label: 'Medium', variant: 'default' as const },
      low: { label: 'Low', variant: 'secondary' as const },
    };
    return config[priority as keyof typeof config] || config.medium;
  };

  const getInterviewStatus = (status: string) => {
    const config = {
      confirmed: { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle2 },
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock4 },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: AlertCircle },
    };
    return config[status as keyof typeof config] || config.pending;
  };

  // Calculate pipeline distribution
  const pipelineDistribution = pipelineData.stages.map((stage: any) => {
    const count = pipelineData.candidates.filter((c: any) => c.currentStage === stage.id).length;
    return { ...stage, count };
  });

  // Team workload summary
  const teamWorkload = teamMembers.map(member => ({
    ...member,
    workloadPercentage: Math.min((member.workload.activeCandidates / 15) * 100, 100)
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Welcome Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Welcome back, {teamMembers[0]?.name || 'Recruiter'}!
                </h1>
                <p className="text-muted-foreground">
                  Here&apos;s your recruitment overview for {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Job Posting
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quickStats.activeJobs}</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quickStats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground">+12 today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quickStats.upcomingInterviews}</div>
                  <p className="text-xs text-muted-foreground">Next 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quickStats.pendingOffers}</div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Hires</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quickStats.hiresThisMonth}</div>
                  <p className="text-xs text-muted-foreground">On track for target</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quickStats.openPositions}</div>
                  <p className="text-xs text-muted-foreground">To be filled</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Priority tasks that need your attention
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
              {/* Left Column - Activity & Interviews */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Latest updates from your recruitment pipeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => {
                        const priorityConfig = getPriorityBadge(activity.priority);
                        
                        return (
                          <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="p-2 rounded-lg bg-muted">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm">{activity.title}</h4>
                                <div className="flex items-center gap-2">
                                  {activity.actionRequired && (
                                    <Badge variant="destructive" className="text-xs">
                                      Action Required
                                    </Badge>
                                  )}
                                  <Badge variant={priorityConfig.variant} className="text-xs">
                                    {priorityConfig.label}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.timestamp).toLocaleDateString()} • 
                                {' '}{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Pipeline Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Pipeline Overview
                    </CardTitle>
                    <CardDescription>
                      Candidate distribution across hiring stages
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pipelineDistribution.map((stage) => (
                        <div key={stage.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full bg-${stage.color}-500`}></div>
                            <span className="text-sm font-medium capitalize">{stage.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full bg-${stage.color}-500`}
                                style={{ 
                                  width: `${(stage.count / pipelineData.candidates.length) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-8">{stage.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Interviews & Performance */}
              <div className="space-y-6">
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
                      {upcomingInterviews.map((interview) => {
                        const statusConfig = getInterviewStatus(interview.status);
                        const Icon = statusConfig.icon;
                        
                        return (
                          <div key={interview.id} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-sm">{interview.candidate}</h4>
                                <p className="text-xs text-muted-foreground">{interview.job}</p>
                              </div>
                              <Badge variant={statusConfig.variant} className="flex items-center gap-1 text-xs">
                                <Icon className="h-3 w-3" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(interview.date).toLocaleDateString()} at{' '}
                                {new Date(interview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {interview.interviewers.join(', ')}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Video className="h-3 w-3 mr-1" />
                                Join
                              </Button>
                              <Button variant="outline" size="sm">
                                <Mail className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                    <CardDescription>
                      Key recruitment performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Time to Hire</span>
                        <span className="font-semibold">{performanceMetrics.timeToHire} days</span>
                      </div>
                      {/* <Progress value={100 - (performanceMetrics.timeToHire / 60 * 100)} className="h-2" /> */}

                      <div className="flex justify-between text-sm">
                        <span>Offer Acceptance</span>
                        <span className="font-semibold text-green-600">{performanceMetrics.offerAcceptanceRate}%</span>
                      </div>
                      {/* <Progress value={performanceMetrics.offerAcceptanceRate} className="h-2" /> */}

                      <div className="flex justify-between text-sm">
                        <span>Candidate Satisfaction</span>
                        <span className="font-semibold text-blue-600">{performanceMetrics.candidateSatisfaction}/5</span>
                      </div>
                      {/* <Progress value={performanceMetrics.candidateSatisfaction * 20} className="h-2" /> */}

                      <div className="flex justify-between text-sm">
                        <span>Diversity Score</span>
                        <span className="font-semibold text-purple-600">{performanceMetrics.diversityScore}%</span>
                      </div>
                      {/* <Progress value={performanceMetrics.diversityScore} className="h-2" /> */}
                    </div>
                  </CardContent>
                </Card>

                {/* Team Workload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Team Workload
                    </CardTitle>
                    <CardDescription>
                      Current team capacity and assignments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamWorkload.slice(0, 3).map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm">{member.name.split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  member.workloadPercentage >= 80 ? 'bg-red-500' :
                                  member.workloadPercentage >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${member.workloadPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground w-8">
                              {member.workload.activeCandidates}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-3" asChild>
                      <Link href="/recruiter/team">
                        View Full Team
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Navigation</CardTitle>
                <CardDescription>
                  Jump directly to any section of your recruitment dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                  <Link href="/recruiter/jobs">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Briefcase className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-semibold text-sm">Job Postings</h3>
                        <p className="text-xs text-muted-foreground">Manage openings</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/recruiter/applications">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h3 className="font-semibold text-sm">Applications</h3>
                        <p className="text-xs text-muted-foreground">Review candidates</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/recruiter/pipeline">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <h3 className="font-semibold text-sm">Pipeline</h3>
                        <p className="text-xs text-muted-foreground">Track progress</p>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/recruiter/messages">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <h3 className="font-semibold text-sm">Messages</h3>
                        <p className="text-xs text-muted-foreground">Communicate</p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/recruiter/team">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <UserCheck className="h-8 w-8 mx-auto mb-2 text-red-600" />
                        <h3 className="font-semibold text-sm">Team</h3>
                        <p className="text-xs text-muted-foreground">Collaborate</p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/recruiter/analytics">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                        <h3 className="font-semibold text-sm">Analytics</h3>
                        <p className="text-xs text-muted-foreground">View reports</p>
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

// Activity icon component
function Activity({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}