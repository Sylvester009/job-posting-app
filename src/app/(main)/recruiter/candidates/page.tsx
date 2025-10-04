/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Badge } from '@/styles/components/ui/badge';
import { Input } from '@/styles/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/styles/components/ui/tabs';
import { 
  Search, 
  Users,
  User,
  Clock,
  Plus,
  Download,
  Share2,
  Eye,
  Mail,
  Phone,
  Video,
  Star,
  AlertCircle,
  XCircle
} from 'lucide-react';

import recruiterData from '../dashboard/data.json';

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
  description: string;
}

interface Candidate {
  id: string;
  applicantId: string;
  jobId: string;
  currentStage: string;
  assignedTo: string | null;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  lastActivity: string;
  nextAction: string;
  notes: Array<{
    author: string;
    content: string;
    timestamp: string;
    type: string;
  }>;
  metrics: {
    daysInStage: number;
    totalDaysInProcess: number;
    interviewScore: number | null;
    responseTime: string;
  };
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  workload: {
    activeCandidates: number;
    upcomingInterviews: number;
    pendingOffers: number;
  };
}

export default function PipelinePage() {
  const [pipelineStages] = useState<PipelineStage[]>(recruiterData.pipeline.stages as PipelineStage[]);
  const [candidates, setCandidates] = useState<Candidate[]>(recruiterData.pipeline.candidates as Candidate[]);
  const [teamMembers] = useState<TeamMember[]>(recruiterData.pipeline.teamMembers as TeamMember[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Get applicant data for candidates
  const getApplicantData = (applicantId: string) => {
    return recruiterData.applicants.find(app => app.applicant.id === applicantId)?.applicant;
  };

  // Filter candidates based on search and filters
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const applicant = getApplicantData(candidate.applicantId);
      if (!applicant) return false;

      const matchesSearch = searchTerm === '' || 
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.currentRole.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesJob = selectedJob === 'all' || candidate.jobId === selectedJob;
      const matchesPriority = selectedPriority === 'all' || candidate.priority === selectedPriority;
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => candidate.tags.includes(tag));

      return matchesSearch && matchesJob && matchesPriority && matchesTags;
    });
  }, [candidates, searchTerm, selectedJob, selectedPriority, selectedTags]);

  // Group candidates by stage
  const candidatesByStage = useMemo(() => {
    const grouped: { [key: string]: Candidate[] } = {};
    pipelineStages.forEach(stage => {
      grouped[stage.id] = filteredCandidates.filter(candidate => candidate.currentStage === stage.id);
    });
    return grouped;
  }, [filteredCandidates, pipelineStages]);

  // Handle drag start
  const handleDragStart = (candidate: Candidate) => {
    setDraggedCandidate(candidate);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedCandidate && draggedCandidate.currentStage !== stageId) {
      setCandidates(prev => prev.map(candidate =>
        candidate.id === draggedCandidate.id
          ? { ...candidate, currentStage: stageId, lastActivity: new Date().toISOString() }
          : candidate
      ));
    }
    setDraggedCandidate(null);
  };

  // Get team member by ID
  const getTeamMember = (memberId: string | null) => {
    if (!memberId) return null;
    return teamMembers.find(member => member.id === memberId);
  };

  // Get stage by ID
  const getStage = (stageId: string) => {
    return pipelineStages.find(stage => stage.id === stageId);
  };

  // Pipeline statistics
  const pipelineStats = useMemo(() => {
    const total = candidates.length;
    const active = candidates.filter(c => !['hired', 'rejected'].includes(c.currentStage)).length;
    const stuck = candidates.filter(c => c.metrics.daysInStage > 14 && !['hired', 'rejected'].includes(c.currentStage)).length;
    const avgTimeToHire = candidates
      .filter(c => c.currentStage === 'hired')
      .reduce((acc, c) => acc + c.metrics.totalDaysInProcess, 0) / 
      Math.max(candidates.filter(c => c.currentStage === 'hired').length, 1);

    return { total, active, stuck, avgTimeToHire: Math.round(avgTimeToHire) };
  }, [candidates]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Candidate Pipeline</h1>
                <p className="text-muted-foreground">
                  Manage and track candidates through the hiring process
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Board
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pipelineStats.total}</div>
                  <p className="text-xs text-muted-foreground">Across all stages</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Pipeline</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pipelineStats.active}</div>
                  <p className="text-xs text-muted-foreground">In process</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stuck Candidates</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{pipelineStats.stuck}</div>
                  <p className="text-xs text-muted-foreground">14 days in stage</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pipelineStats.avgTimeToHire}</div>
                  <p className="text-xs text-muted-foreground">Days</p>
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
                        placeholder="Search candidates by name or role..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={viewMode === 'kanban' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setViewMode('kanban')}
                      >
                        Kanban
                      </Button>
                      <Button 
                        variant={viewMode === 'list' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        List
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Job</label>
                      <select
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        className="p-2 border rounded-md text-sm"
                      >
                        <option value="all">All Jobs</option>
                        <option value="job1">Senior Frontend Developer</option>
                        <option value="job2">Product Designer</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="p-2 border rounded-md text-sm"
                      >
                        <option value="all">All Priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Tags</label>
                      <select
                        value={selectedTags[0] || ''}
                        onChange={(e) => setSelectedTags(e.target.value ? [e.target.value] : [])}
                        className="p-2 border rounded-md text-sm"
                      >
                        <option value="">All Tags</option>
                        {recruiterData.pipeline.filters.tags.map(tag => (
                          <option key={tag} value={tag}>
                            {tag.split('-').join(' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline View */}
          <div className="px-4 lg:px-6">
            {viewMode === 'kanban' ? (
              <KanbanView
                stages={pipelineStages}
                candidatesByStage={candidatesByStage}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                getApplicantData={getApplicantData}
                getTeamMember={getTeamMember}
                getStage={getStage}
                onSelectCandidate={setSelectedCandidate}
              />
            ) : (
              <ListView
                candidates={filteredCandidates}
                getApplicantData={getApplicantData}
                getTeamMember={getTeamMember}
                getStage={getStage}
                onSelectCandidate={setSelectedCandidate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          applicant={getApplicantData(selectedCandidate.applicantId)}
          teamMembers={teamMembers}
          onClose={() => setSelectedCandidate(null)}
          onUpdate={(updatedCandidate) => {
            setCandidates(prev => prev.map(c =>
              c.id === updatedCandidate.id ? updatedCandidate : c
            ));
          }}
        />
      )}
    </div>
  );
}

function KanbanView({
  stages,
  candidatesByStage,
  onDragStart,
  onDragOver,
  onDrop,
  getApplicantData,
  getTeamMember,
  getStage,
  onSelectCandidate
}: {
  stages: PipelineStage[];
  candidatesByStage: { [key: string]: Candidate[] };
  onDragStart: (candidate: Candidate) => void;
  onDragOver: (e: React.DragEvent, stageId: string) => void;
  onDrop: (e: React.DragEvent, stageId: string) => void;
  getApplicantData: (applicantId: string) => any;
  getTeamMember: (memberId: string | null) => TeamMember | null;
  getStage: (stageId: string) => PipelineStage | undefined;
  onSelectCandidate: (candidate: Candidate) => void;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map(stage => (
        <div
          key={stage.id}
          className="flex-shrink-0 w-80"
          onDragOver={(e) => onDragOver(e, stage.id)}
          onDrop={(e) => onDrop(e, stage.id)}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{stage.name}</CardTitle>
                  <CardDescription>
                    {candidatesByStage[stage.id]?.length || 0} candidates
                  </CardDescription>
                </div>
                <Badge variant="outline">{stage.id}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {candidatesByStage[stage.id]?.map(candidate => {
                const applicant = getApplicantData(candidate.applicantId);
                if (!applicant) return null;

                return (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    applicant={applicant}
                    teamMember={getTeamMember(candidate.assignedTo)}
                    draggable
                    onDragStart={onDragStart}
                    onClick={onSelectCandidate}
                  />
                );
              })}
              {(!candidatesByStage[stage.id] || candidatesByStage[stage.id].length === 0) && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <p>No candidates in this stage</p>
                  <p className="text-sm">Drag candidates here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

function ListView({
  candidates,
  getApplicantData,
  getTeamMember,
  getStage,
  onSelectCandidate
}: {
  candidates: Candidate[];
  getApplicantData: (applicantId: string) => any;
  getTeamMember: (memberId: string | null) => TeamMember | null;
  getStage: (stageId: string) => PipelineStage | undefined;
  onSelectCandidate: (candidate: Candidate) => void;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Candidate</th>
                <th className="text-left p-4 font-semibold">Stage</th>
                <th className="text-left p-4 font-semibold">Assigned To</th>
                <th className="text-left p-4 font-semibold">Priority</th>
                <th className="text-left p-4 font-semibold">Last Activity</th>
                <th className="text-left p-4 font-semibold">Next Action</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(candidate => {
                const applicant = getApplicantData(candidate.applicantId);
                const stage = getStage(candidate.currentStage);
                const teamMember = getTeamMember(candidate.assignedTo);
                
                if (!applicant) return null;

                return (
                  <tr key={candidate.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{applicant.name}</div>
                          <div className="text-sm text-muted-foreground">{applicant.currentRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{stage?.name}</Badge>
                    </td>
                    <td className="p-4">
                      {teamMember ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                            {teamMember.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm">{teamMember.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <PriorityBadge priority={candidate.priority} />
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {new Date(candidate.lastActivity).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {candidate.nextAction}
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" onClick={() => onSelectCandidate(candidate)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function CandidateCard({
  candidate,
  applicant,
  teamMember,
  draggable = false,
  onDragStart,
  onClick
}: {
  candidate: Candidate;
  applicant: any;
  teamMember: TeamMember | null;
  draggable?: boolean;
  onDragStart?: (candidate: Candidate) => void;
  onClick?: (candidate: Candidate) => void;
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all ${
        candidate.metrics.daysInStage > 14 ? 'border-red-300 bg-red-50' : ''
      }`}
      draggable={draggable}
      onDragStart={() => onDragStart?.(candidate)}
      onClick={() => onClick?.(candidate)}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm">{applicant.name}</h3>
            <p className="text-xs text-muted-foreground">{applicant.currentRole}</p>
          </div>
          <PriorityBadge priority={candidate.priority} />
        </div>

        {/* Tags */}
        {candidate.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {candidate.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag.split('-').join(' ')}
              </Badge>
            ))}
            {candidate.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{candidate.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Next Action */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">Next Action</p>
          <p className="text-sm line-clamp-2">{candidate.nextAction}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {teamMember ? (
              <div className="flex items-center gap-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                  {teamMember.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-xs text-muted-foreground">{teamMember.name.split(' ')[0]}</span>
              </div>
            ) : (
              <Badge variant="outline" className="text-xs">Unassigned</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {candidate.metrics.daysInStage}d
          </div>
        </div>

        {/* Stuck Warning */}
        {candidate.metrics.daysInStage > 14 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" />
            Stuck for {candidate.metrics.daysInStage} days
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const getConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { label: 'High', variant: 'destructive' as const, icon: AlertCircle };
      case 'medium':
        return { label: 'Medium', variant: 'default' as const, icon: Star };
      case 'low':
        return { label: 'Low', variant: 'outline' as const, icon: Star };
      default:
        return { label: 'Low', variant: 'outline' as const, icon: Star };
    }
  };

  const config = getConfig(priority);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function CandidateDetailModal({
  candidate,
  applicant,
  teamMembers,
  onClose,
  onUpdate
}: {
  candidate: Candidate;
  applicant: any;
  teamMembers: TeamMember[];
  onClose: () => void;
  onUpdate: (candidate: Candidate) => void;
}) {
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState(candidate.assignedTo || '');
  const [priority, setPriority] = useState(candidate.priority);

  const handleSave = () => {
    const updatedCandidate = {
      ...candidate,
      assignedTo: assignedTo || null,
      priority: priority as 'high' | 'medium' | 'low',
      notes: [
        ...candidate.notes,
        ...(notes.trim() ? [{
          author: 'John Doe', // Current user
          content: notes,
          timestamp: new Date().toISOString(),
          type: 'note'
        }] : [])
      ]
    };
    onUpdate(updatedCandidate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Candidate Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Manage {applicant?.name}&apos;s progression through the hiring process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Candidate Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{applicant?.name}</h2>
                <p className="text-muted-foreground">{applicant?.currentRole}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {applicant?.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {applicant?.phone}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{candidate.metrics.totalDaysInProcess} days</div>
              <div className="text-sm text-muted-foreground">In process</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <Button>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call Candidate
            </Button>
            <Button variant="outline">
              <Video className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </div>

          {/* Assignment & Priority */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Assigned To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Unassigned</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full p-2 border rounded-md"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium mb-2 block">Add Note</label>
            {/* <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this candidate..."
              rows={3}
            /> */}
          </div>

          {/* Existing Notes */}
          {candidate.notes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Activity & Notes</h3>
              <div className="space-y-3">
                {candidate.notes.map((note, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{note.author}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}