'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Badge } from '@/styles/components/ui/badge';
import { Input } from '@/styles/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/styles/components/ui/tabs';
import { 
  Search, 
  Users,
  Star,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  ThumbsUp,
  MessageSquare,
  FileText,
  Building,
  Award,
  TrendingUp,
  X
} from 'lucide-react';

import recruiterData from '../dashboard/data.json';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  photo: string;
  currentRole: string;
  experience: string;
  education: string;
}

interface Application {
  id: string;
  jobId: string;
  applicant: Applicant;
  application: {
    appliedDate: string;
    status: string;
    coverLetter: string;
    resume: string;
    source: string;
  };
  matchAnalysis: {
    overallScore: number;
    skillMatch: number;
    experienceMatch: number;
    cultureFit: number;
    requiredSkills: Array<{
      skill: string;
      match: string;
      years: number;
    }>;
    missingSkills: string[];
    strengths: string[];
    concerns: string[];
  };
  screening: {
    aiScore: number;
    flagged: boolean;
    notes: string;
    screeningQuestions: Array<{
      question: string;
      answer: string;
      score: number;
    }>;
  };
}

export default function ApplicationsPage() {
  const [applications] = useState<Application[]>(recruiterData.applicants as Application[]);
  const [selectedJob, setSelectedJob] = useState(recruiterData.jobPostings[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);

  // Sort applications by match score (highest first)
  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => 
      b.matchAnalysis.overallScore - a.matchAnalysis.overallScore
    );
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return sortedApplications.filter(app => {
      const matchesSearch = app.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.applicant.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.applicant.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.application.status === statusFilter;
      
      const matchesScore = scoreFilter === 'all' || 
        (scoreFilter === 'excellent' && app.matchAnalysis.overallScore >= 90) ||
        (scoreFilter === 'good' && app.matchAnalysis.overallScore >= 80 && app.matchAnalysis.overallScore < 90) ||
        (scoreFilter === 'fair' && app.matchAnalysis.overallScore >= 70 && app.matchAnalysis.overallScore < 80) ||
        (scoreFilter === 'poor' && app.matchAnalysis.overallScore < 70);

      return matchesSearch && matchesStatus && matchesScore;
    });
  }, [sortedApplications, searchTerm, statusFilter, scoreFilter]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      applied: { label: 'Applied', variant: 'secondary' as const },
      screening: { label: 'Screening', variant: 'default' as const },
      interview: { label: 'Interview', variant: 'default' as const },
      offer: { label: 'Offer', variant: 'default' as const },
      hired: { label: 'Hired', variant: 'outline' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.applied;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const updateApplicationStatus = (applicationId: string, newStatus: string) => {
    // In a real app, this would update the backend
    console.log(`Updating application ${applicationId} to ${newStatus}`);
  };

  const stats = {
    total: applications.length,
    excellent: applications.filter(app => app.matchAnalysis.overallScore >= 90).length,
    good: applications.filter(app => app.matchAnalysis.overallScore >= 80 && app.matchAnalysis.overallScore < 90).length,
    screening: applications.filter(app => app.application.status === 'screening').length,
    interview: applications.filter(app => app.application.status === 'interview').length
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
                <p className="text-muted-foreground">
                  Review and manage applicants for {selectedJob.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </div>

          {/* Job Selection & Stats */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedJob.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedJob.department} • {selectedJob.location} • {selectedJob.applications} applicants
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{selectedJob.matches}</div>
                    <div className="text-sm text-muted-foreground">Strong Matches</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">All applications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Excellent Matches</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.excellent}</div>
                  <p className="text-xs text-muted-foreground">90%+ match score</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Screening</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.screening}</div>
                  <p className="text-xs text-muted-foreground">Under review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interview Stage</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.interview}</div>
                  <p className="text-xs text-muted-foreground">Scheduled interviews</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search applicants by name, role, or location..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Application Status</label>
                      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                        <TabsList>
                          <TabsTrigger value="all">All Status</TabsTrigger>
                          <TabsTrigger value="applied">Applied</TabsTrigger>
                          <TabsTrigger value="screening">Screening</TabsTrigger>
                          <TabsTrigger value="interview">Interview</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Match Score</label>
                      <Tabs value={scoreFilter} onValueChange={setScoreFilter}>
                        <TabsList>
                          <TabsTrigger value="all">All Scores</TabsTrigger>
                          <TabsTrigger value="excellent">Excellent (90+)</TabsTrigger>
                          <TabsTrigger value="good">Good (80-89)</TabsTrigger>
                          <TabsTrigger value="fair">Fair (70-79)</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applications Grid */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4">
              {filteredApplications.map((application, index) => (
                <ApplicantCard
                  key={application.id}
                  application={application}
                  rank={index + 1}
                  onSelect={setSelectedApplicant}
                  onStatusUpdate={updateApplicationStatus}
                />
              ))}

              {filteredApplications.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No applicants found</h3>
                    <p className="text-muted-foreground text-center mt-2">
                      {searchTerm || statusFilter !== 'all' || scoreFilter !== 'all'
                        ? 'Try adjusting your search or filter criteria'
                        : 'No applications received yet for this job posting'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <ApplicantDetailModal
          application={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onStatusUpdate={updateApplicationStatus}
        />
      )}
    </div>
  );
}

function ApplicantCard({ 
  application, 
  rank, 
  onSelect, 
  onStatusUpdate 
}: { 
  application: Application;
  rank: number;
  onSelect: (app: Application) => void;
  onStatusUpdate: (appId: string, status: string) => void;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      applied: { label: 'Applied', variant: 'secondary' as const },
      screening: { label: 'Screening', variant: 'default' as const },
      interview: { label: 'Interview', variant: 'default' as const },
      offer: { label: 'Offer', variant: 'default' as const },
      hired: { label: 'Hired', variant: 'outline' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.applied;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(application)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Rank Badge */}
            <div className="flex flex-col items-center">
              <Badge variant={rank <= 3 ? "default" : "secondary"} className="mb-2">
                #{rank}
              </Badge>
              <div className={`text-sm font-bold px-2 py-1 rounded border ${getScoreColor(application.matchAnalysis.overallScore)}`}>
                {application.matchAnalysis.overallScore}%
              </div>
            </div>

            {/* Applicant Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{application.applicant.name}</h3>
                {getStatusBadge(application.application.status)}
                {application.screening.flagged && (
                  <Badge variant="destructive">Flagged</Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mb-2">{application.applicant.currentRole}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {application.applicant.location}
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {application.applicant.experience}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Applied {new Date(application.application.appliedDate).toLocaleDateString()}
                </div>
              </div>

              {/* Skills Match */}
              <div className="mb-3">
                <h4 className="text-sm font-semibold mb-1">Top Skills Match</h4>
                <div className="flex flex-wrap gap-1">
                  {application.matchAnalysis.requiredSkills.slice(0, 4).map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant={
                        skill.match === 'excellent' ? 'default' :
                        skill.match === 'good' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {skill.skill} ({skill.years}y)
                    </Badge>
                  ))}
                  {application.matchAnalysis.requiredSkills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{application.matchAnalysis.requiredSkills.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Strengths */}
              {application.matchAnalysis.strengths.length > 0 && (
                <div className="mb-2">
                  <h4 className="text-sm font-semibold mb-1">Strengths</h4>
                  <div className="flex flex-wrap gap-1">
                    {application.matchAnalysis.strengths.slice(0, 2).map((strength, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-green-50">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicantDetailModal({ 
  application, 
  onClose, 
  onStatusUpdate 
}: { 
  application: Application;
  onClose: () => void;
  onStatusUpdate: (appId: string, status: string) => void;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Applicant Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Comprehensive view of {application.applicant.name}&apos;s application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Applicant Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{application.applicant.name}</h2>
                <p className="text-muted-foreground">{application.applicant.currentRole}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {application.applicant.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {application.applicant.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {application.applicant.location}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(application.matchAnalysis.overallScore)}`}>
                {application.matchAnalysis.overallScore}%
              </div>
              <div className="text-sm text-muted-foreground">Match Score</div>
            </div>
          </div>

          {/* Match Analysis */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Skills Match</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{application.matchAnalysis.skillMatch}%</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${application.matchAnalysis.skillMatch}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Experience Match</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{application.matchAnalysis.experienceMatch}%</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${application.matchAnalysis.experienceMatch}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Culture Fit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{application.matchAnalysis.cultureFit}%</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${application.matchAnalysis.cultureFit}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {application.matchAnalysis.requiredSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge variant="outline" className="text-xs">
                        {skill.years} years
                      </Badge>
                    </div>
                    <Badge variant={
                      skill.match === 'excellent' ? 'default' :
                      skill.match === 'good' ? 'secondary' : 'outline'
                    }>
                      {skill.match}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Applicant
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
            <Button variant="outline">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Advance to Next Stage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}