/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Badge } from '@/styles/components/ui/badge';
import { Input } from '@/styles/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/styles/components/ui/tabs';
// import { Progress } from '@/styles/components/ui/progress';
import { 
  Search, 
  Users,
  User,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  MessageSquare,
  Settings,
  Edit,
  Share2,
  Plus,
  Briefcase,
  Award
} from 'lucide-react';

import recruiterData from '../dashboard/data.json';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  phone: string;
  department: string;
  hireDate: string;
  status: 'active' | 'away' | 'offline';
  workload: {
    activeCandidates: number;
    upcomingInterviews: number;
    pendingOffers: number;
    hiresThisMonth: number;
    completionRate: number;
  };
  skills: string[];
  currentAssignments: string[];
  calendar: {
    availableSlots: string[];
    busySlots: string[];
  };
}

export default function TeamPage() {
  const [teamMembers] = useState<TeamMember[]>(recruiterData.team.members as TeamMember[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [teamMembers, searchTerm, departmentFilter, statusFilter]);

  const teamStats = useMemo(() => {
    const totalMembers = teamMembers.length;
    const activeMembers = teamMembers.filter(m => m.status === 'active').length;
    const totalCandidates = teamMembers.reduce((sum, member) => sum + member.workload.activeCandidates, 0);
    const totalInterviews = teamMembers.reduce((sum, member) => sum + member.workload.upcomingInterviews, 0);
    const avgCompletionRate = teamMembers.reduce((sum, member) => sum + member.workload.completionRate, 0) / totalMembers;

    return {
      totalMembers,
      activeMembers,
      totalCandidates,
      totalInterviews,
      avgCompletionRate: Math.round(avgCompletionRate)
    };
  }, [teamMembers]);


  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Team Collaboration</h1>
                <p className="text-muted-foreground">
                  Manage your recruitment team and collaborate effectively
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Board
                </Button>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </div>
          </div>

          {/* Team Stats */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamStats.totalMembers}</div>
                  <p className="text-xs text-muted-foreground">{teamStats.activeMembers} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamStats.totalCandidates}</div>
                  <p className="text-xs text-muted-foreground">In pipeline</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Interviews</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamStats.totalInterviews}</div>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamStats.avgCompletionRate}%</div>
                  <p className="text-xs text-muted-foreground">Team average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recruiterData.team.teamPerformance.candidateSatisfaction}/5</div>
                  <p className="text-xs text-muted-foreground">Satisfaction</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Team Overview</TabsTrigger>
                <TabsTrigger value="workload">Workload</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
              </TabsList>

              {/* Team Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search team members by name, role, or department..."
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={departmentFilter}
                          onChange={(e) => setDepartmentFilter(e.target.value)}
                          className="p-2 border rounded-md text-sm"
                        >
                          <option value="all">All Departments</option>
                          {recruiterData.team.departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="p-2 border rounded-md text-sm"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="away">Away</option>
                          <option value="offline">Offline</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMembers.map((member) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      onSelect={setSelectedMember}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Workload Tab */}
              <TabsContent value="workload">
                <WorkloadView members={filteredMembers} />
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance">
                <PerformanceView members={filteredMembers} teamPerformance={recruiterData.team.teamPerformance} />
              </TabsContent>

              {/* Collaboration Tab */}
              <TabsContent value="collaboration">
                <CollaborationView 
                  templates={recruiterData.team.collaboration.sharedTemplates}
                  workflows={recruiterData.team.collaboration.approvalWorkflows}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Team Member Detail Modal */}
      {selectedMember && (
        <TeamMemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onUpdate={(updatedMember) => {
            // Handle member update
            console.log('Updated member:', updatedMember);
          }}
        />
      )}
    </div>
  );
}

function TeamMemberCard({ member, onSelect }: { member: TeamMember; onSelect: (member: TeamMember) => void }) {
  const getWorkloadPercentage = (workload: TeamMember['workload']) => {
    const maxCandidates = 15; // Assuming 15 is max for "100%"
    return Math.min((workload.activeCandidates / maxCandidates) * 100, 100);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const, color: 'text-green-600 bg-green-50' },
      away: { label: 'Away', variant: 'secondary' as const, color: 'text-yellow-600 bg-yellow-50' },
      offline: { label: 'Offline', variant: 'outline' as const, color: 'text-gray-600 bg-gray-50' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };
  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return 'text-red-600';
    if (workload >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const workloadPercentage = getWorkloadPercentage(member.workload);
  const workloadColor = workloadPercentage >= 80 ? 'bg-red-500' : 
                       workloadPercentage >= 60 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(member)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
          {getStatusBadge(member.status)}
        </div>

        {/* Department & Contact */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-3 w-3" />
            {member.department}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            {member.email}
          </div>
        </div>

        {/* Workload Overview */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Workload</span>
            <span className={getWorkloadColor(workloadPercentage)}>
              {member.workload.activeCandidates} candidates
            </span>
          </div>
          {/* <Progress value={workloadPercentage} className="h-2" /> */}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-semibold">{member.workload.upcomingInterviews}</div>
              <div className="text-muted-foreground">Interviews</div>
            </div>
            <div>
              <div className="font-semibold">{member.workload.pendingOffers}</div>
              <div className="text-muted-foreground">Offers</div>
            </div>
            <div>
              <div className="font-semibold">{member.workload.hiresThisMonth}</div>
              <div className="text-muted-foreground">Hires</div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Top Skills</h4>
          <div className="flex flex-wrap gap-1">
            {member.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {member.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{member.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="h-3 w-3 mr-1" />
            Message
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkloadView({ members }: { members: TeamMember[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Workload Distribution</CardTitle>
        <CardDescription>
          Current workload and capacity across the recruitment team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {members.map((member) => {
            const workloadPercentage = Math.min((member.workload.activeCandidates / 15) * 100, 100);
            
            return (
              <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{member.workload.activeCandidates} active candidates</span>
                    <span className={workloadPercentage >= 80 ? 'text-red-600' : workloadPercentage >= 60 ? 'text-yellow-600' : 'text-green-600'}>
                      {Math.round(workloadPercentage)}%
                    </span>
                  </div>
                  {/* <Progress value={workloadPercentage} className="h-2" /> */}
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold">{member.workload.completionRate}%</div>
                  <div className="text-xs text-muted-foreground">Completion</div>
                </div>

                <Button variant="outline" size="sm">
                  Reassign
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function PerformanceView({ members, teamPerformance }: { members: TeamMember[]; teamPerformance: any }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Team Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>
            Overall recruitment team metrics and KPIs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{teamPerformance.totalHires}</div>
              <div className="text-sm text-muted-foreground">Total Hires</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{teamPerformance.offerAcceptanceRate}%</div>
              <div className="text-sm text-muted-foreground">Offer Acceptance</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{teamPerformance.averageTimeToHire}</div>
              <div className="text-sm text-muted-foreground">Avg. Days to Hire</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{teamPerformance.candidateSatisfaction}/5</div>
              <div className="text-sm text-muted-foreground">Satisfaction Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Performance</CardTitle>
          <CardDescription>
            Team member performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-semibold">{member.workload.hiresThisMonth}</div>
                      <div className="text-xs text-muted-foreground">Hires</div>
                    </div>
                    <div>
                      <div className="font-semibold">{member.workload.completionRate}%</div>
                      <div className="text-xs text-muted-foreground">Rate</div>
                    </div>
                    <Award className={`h-5 w-5 ${
                      member.workload.completionRate >= 90 ? 'text-yellow-500' :
                      member.workload.completionRate >= 80 ? 'text-gray-500' : 'text-transparent'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CollaborationView({ templates, workflows }: { templates: any[]; workflows: any[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Shared Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Shared Templates
          </CardTitle>
          <CardDescription>
            Team-shared feedback and assessment templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <h4 className="font-semibold">{template.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{template.category}</p>
                <div className="flex flex-wrap gap-1">
                  {template.fields.map((field: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create New Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approval Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Approval Workflows
          </CardTitle>
          <CardDescription>
            Standardized hiring approval processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="p-3 border rounded-lg">
                <h4 className="font-semibold mb-2">{workflow.name}</h4>
                <div className="space-y-1">
                  {workflow.steps.map((step: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create New Workflow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamMemberDetailModal({ 
  member, 
  onClose, 
}: { 
  member: TeamMember;
  onClose: () => void;
  onUpdate: (member: TeamMember) => void;
}) {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const, color: 'text-green-600 bg-green-50' },
      away: { label: 'Away', variant: 'secondary' as const, color: 'text-yellow-600 bg-yellow-50' },
      offline: { label: 'Offline', variant: 'outline' as const, color: 'text-gray-600 bg-gray-50' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Member Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <span className="sr-only">Close</span>
              ×
            </Button>
          </div>
          <CardDescription>
            Detailed view and management for {member.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{member.name}</h2>
                <p className="text-muted-foreground">{member.role} • {member.department}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {member.phone}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(member.status)}
              <div className="text-sm text-muted-foreground mt-1">
                Since {new Date(member.hireDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="workload">Workload</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Completion Rate</span>
                        <span className="font-semibold">{member.workload.completionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Hires This Month</span>
                        <span className="font-semibold">{member.workload.hiresThisMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Active Candidates</span>
                        <span className="font-semibold">{member.workload.activeCandidates}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{member.currentAssignments.length}</div>
                    <p className="text-sm text-muted-foreground">Active candidate assignments</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="workload">
              <WorkloadDetail member={member} />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsDetail member={member} />
            </TabsContent>

            <TabsContent value="calendar">
              <CalendarDetail member={member} />
            </TabsContent>
          </Tabs>

          <div className="flex gap-4">
            <Button className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WorkloadDetail({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.workload.upcomingInterviews}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.workload.pendingOffers}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Hires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.workload.hiresThisMonth}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SkillsDetail({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Skills & Expertise</h3>
      <div className="flex flex-wrap gap-2">
        {member.skills.map((skill, index) => (
          <Badge key={index} variant="default" className="text-sm">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function CalendarDetail({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Availability</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <span>Available Slots</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {member.calendar.availableSlots.length} slots
          </span>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-600" />
            <span>Busy Slots</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {member.calendar.busySlots.length} slots
          </span>
        </div>
      </div>
    </div>
  );
}