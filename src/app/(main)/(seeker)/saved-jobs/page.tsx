'use client';

import {useState, useMemo} from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/styles/components/ui/card';
import {Button} from '@/styles/components/ui/button';
import {Badge} from '@/styles/components/ui/badge';
import {Input} from '@/styles/components/ui/input';
// import { Textarea } from '@/styles/components/ui/textarea';
import {Label} from '@/styles/components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/styles/components/ui/tabs';
import {
  Search,
  Star,
  Bookmark,
  MapPin,
  DollarSign,
  Building,
  Edit,
  Trash2,
  FolderPlus,
  Clock,
  CheckCircle2,
  MoreVertical,
} from 'lucide-react';

import savedJobsData from '../data.json';

interface SavedJob {
  id: string;
  jobId: string;
  savedDate: string;
  lastViewed: string;
  notes: string;
  priority: 'high' | 'medium' | 'low';
  plannedApplyDate: string;
  customTags: string[];
  status: 'researching' | 'ready-to-apply' | 'applied';
  jobData: JobData;
}

interface JobData {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  applicationDeadline: string;
  matchRate: number;
  skillsRequired: string[];
  experienceRequired: string;
  description: string;
  companyInfo: CompanyInfo;
  urgency: string;
}

interface CompanyInfo {
  rating: number;
  size: string;
  industry: string;
  culture?: string[];
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(
    savedJobsData.savedJobs as SavedJob[],
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [compareMode, setCompareMode] = useState<string[]>([]);
  const [showComparePanel, setShowComparePanel] = useState(false);

  const filteredJobs = useMemo(() => {
    return savedJobs.filter(job => {
      const matchesSearch =
        job.jobData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobData.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.customTags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesPriority =
        selectedPriority === 'all' || job.priority === selectedPriority;
      const matchesStatus =
        selectedStatus === 'all' || job.status === selectedStatus;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [savedJobs, searchTerm, selectedPriority, selectedStatus]);

  const priorities = {
    high: {
      label: 'High Priority',
      color: 'text-red-600 bg-red-50 border-red-200',
    },
    medium: {
      label: 'Medium Priority',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    },
    low: {
      label: 'Low Priority',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
  };

  const statuses = {
    researching: {label: 'Researching', variant: 'secondary' as const},
    'ready-to-apply': {label: 'Ready to Apply', variant: 'default' as const},
    applied: {label: 'Applied', variant: 'outline' as const},
  };

  const toggleCompare = (jobId: string) => {
    setCompareMode(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId],
    );
  };

  const updateJobStatus = (jobId: string, newStatus: SavedJob['status']) => {
    setSavedJobs(prev =>
      prev.map(job => (job.id === jobId ? {...job, status: newStatus} : job)),
    );
  };

  const deleteSavedJob = (jobId: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    setCompareMode(prev => prev.filter(id => id !== jobId));
  };

  const stats = {
    total: savedJobs.length,
    highPriority: savedJobs.filter(job => job.priority === 'high').length,
    readyToApply: savedJobs.filter(job => job.status === 'ready-to-apply')
      .length,
    upcomingDeadlines: savedJobs.filter(job => {
      const deadline = new Date(job.jobData.applicationDeadline);
      const today = new Date();
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }).length,
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-6 w-6 text-green-600" />
                  <h1 className="text-2xl font-bold tracking-tight">
                    Saved Jobs
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Research, organize, and compare job opportunities before
                  applying
                </p>
              </div>
              <div className="flex items-center gap-2">
                {compareMode.length > 0 && (
                  <Button onClick={() => setShowComparePanel(true)}>
                    {/* <Compare className="h-4 w-4 mr-2" /> */}
                    Compare ({compareMode.length})
                  </Button>
                )}
                <Button variant="outline">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Saved
                  </CardTitle>
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Jobs saved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    High Priority
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.highPriority}</div>
                  <p className="text-xs text-muted-foreground">
                    Top opportunities
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ready to Apply
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.readyToApply}</div>
                  <p className="text-xs text-muted-foreground">
                    Prepared applications
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Deadlines
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.upcomingDeadlines}
                  </div>
                  <p className="text-xs text-muted-foreground">Within 7 days</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  {/* Search Bar */}
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search saved jobs, companies, or notes..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        Grid
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

                  {/* Filters */}
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <Label htmlFor="priority-filter" className="text-sm">
                        Priority
                      </Label>
                      <select
                        title="priority"
                        id="priority-filter"
                        value={selectedPriority}
                        onChange={e => setSelectedPriority(e.target.value)}
                        className="p-2 border rounded-md text-sm"
                      >
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="status-filter" className="text-sm">
                        Status
                      </Label>
                      <select
                        title="status"
                        id="status-filter"
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value)}
                        className="p-2 border rounded-md text-sm"
                      >
                        <option value="all">All Statuses</option>
                        <option value="researching">Researching</option>
                        <option value="ready-to-apply">Ready to Apply</option>
                        <option value="applied">Applied</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {filteredJobs.length} Saved Jobs
                </h3>
                <p className="text-sm text-muted-foreground">
                  {filteredJobs.filter(job => job.priority === 'high').length}{' '}
                  high priority •{' '}
                  {
                    filteredJobs.filter(job => job.status === 'ready-to-apply')
                      .length
                  }{' '}
                  ready to apply
                </p>
              </div>

              {compareMode.length > 0 && (
                <Badge variant="default" className="flex items-center gap-1">
                  {/* <Compare className="h-3 w-3" /> */}
                  Comparing {compareMode.length} jobs
                </Badge>
              )}
            </div>

            {/* Jobs Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map(savedJob => (
                  <SavedJobCard
                    key={savedJob.id}
                    savedJob={savedJob}
                    onUpdateStatus={updateJobStatus}
                    onDelete={deleteSavedJob}
                    isComparing={compareMode.includes(savedJob.id)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map(savedJob => (
                  <SavedJobListCard
                    key={savedJob.id}
                    savedJob={savedJob}
                    onUpdateStatus={updateJobStatus}
                    onDelete={deleteSavedJob}
                    isComparing={compareMode.includes(savedJob.id)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            )}

            {filteredJobs.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No saved jobs found</h3>
                  <p className="text-muted-foreground text-center mt-2">
                    {searchTerm ||
                    selectedPriority !== 'all' ||
                    selectedStatus !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start saving jobs from the recommendations page to research them here'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Compare Panel */}
      {showComparePanel && compareMode.length > 0 && (
        <ComparePanel
          savedJobs={savedJobs.filter(job => compareMode.includes(job.id))}
          onClose={() => {
            setShowComparePanel(false);
            setCompareMode([]);
          }}
        />
      )}
    </div>
  );
}

function SavedJobCard({
  savedJob,
  onUpdateStatus,
  onDelete,
  isComparing,
  onToggleCompare,
}: {
  savedJob: SavedJob;
  onUpdateStatus: (jobId: string, status: SavedJob['status']) => void;
  onDelete: (jobId: string) => void;
  isComparing: boolean;
  onToggleCompare: (jobId: string) => void;
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(savedJob.notes);

  const priorities = {
    high: {
      label: 'High Priority',
      color: 'text-red-600 bg-red-50 border-red-200',
    },
    medium: {
      label: 'Medium Priority',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    },
    low: {
      label: 'Low Priority',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
  };

  const statuses = {
    researching: {label: 'Researching', variant: 'secondary' as const},
    'ready-to-apply': {label: 'Ready to Apply', variant: 'default' as const},
    applied: {label: 'Applied', variant: 'outline' as const},
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(savedJob.jobData.applicationDeadline).getTime() -
      new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const saveNotes = () => {
    // In a real app, you'd update this in the database
    setIsEditing(false);
  };

  return (
    <Card
      className={`hover:shadow-md transition-all ${
        isComparing ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={priorities[savedJob.priority].color}>
              {priorities[savedJob.priority].label}
            </Badge>
            <Badge variant={statuses[savedJob.status].variant}>
              {statuses[savedJob.status].label}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleCompare(savedJob.id)}
          >
            {/* <Compare className={`h-4 w-4 ${isComparing ? 'text-blue-600' : ''}`} /> */}
          </Button>
        </div>

        {/* Job Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{savedJob.jobData.title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Building className="h-3 w-3" />
            <span>{savedJob.jobData.company}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{savedJob.jobData.location}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>{savedJob.jobData.salary}</span>
          </div>
        </div>

        {/* Match Rate */}
        <div className="my-3">
          <div className="flex justify-between items-center text-sm">
            <span>Match Rate</span>
            <span className="font-semibold">{savedJob.jobData.matchRate}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{width: `${savedJob.jobData.matchRate}%`}}
            ></div>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center justify-between text-sm mb-3">
          <span>Application Deadline:</span>
          <span
            className={
              daysUntilDeadline <= 7 ? 'text-red-600 font-semibold' : ''
            }
          >
            {new Date(
              savedJob.jobData.applicationDeadline,
            ).toLocaleDateString()}
            {daysUntilDeadline <= 7 && ` (${daysUntilDeadline} days)`}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {savedJob.customTags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {savedJob.customTags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{savedJob.customTags.length - 3}
            </Badge>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotes(!showNotes)}
            className="w-full justify-start"
          >
            <Edit className="h-3 w-3 mr-2" />
            {showNotes ? 'Hide Notes' : 'Show Notes'}
          </Button>

          {showNotes && (
            <div className="space-y-2">
              {isEditing ? (
                <div className="space-y-2">
                  {/* <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  /> */}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveNotes}>
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNotes(savedJob.notes);
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">{notes}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            className="flex-1"
            onClick={() =>
              onUpdateStatus(
                savedJob.id,
                savedJob.status === 'applied'
                  ? 'researching'
                  : savedJob.status === 'researching'
                  ? 'ready-to-apply'
                  : 'applied',
              )
            }
          >
            {savedJob.status === 'researching'
              ? 'Mark Ready'
              : savedJob.status === 'ready-to-apply'
              ? 'Mark Applied'
              : 'View Application'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(savedJob.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SavedJobListCard({
  savedJob,
  onUpdateStatus,
  onDelete,
  isComparing,
  onToggleCompare,
}: {
  savedJob: SavedJob;
  onUpdateStatus: (jobId: string, status: SavedJob['status']) => void;
  onDelete: (jobId: string) => void;
  isComparing: boolean;
  onToggleCompare: (jobId: string) => void;
}) {
  const daysUntilDeadline = Math.ceil(
    (new Date(savedJob.jobData.applicationDeadline).getTime() -
      new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <Card
      className={`hover:shadow-md transition-all ${
        isComparing ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Building className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{savedJob.jobData.title}</h3>
                <Badge
                  variant={
                    savedJob.priority === 'high' ? 'destructive' : 'secondary'
                  }
                >
                  {savedJob.priority}
                </Badge>
                <Badge variant="outline">{savedJob.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <span>{savedJob.jobData.company}</span>
                <span>{savedJob.jobData.location}</span>
                <span>{savedJob.jobData.salary}</span>
                <span>{savedJob.jobData.matchRate}% match</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {savedJob.customTags.slice(0, 4).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-semibold">
                Due:{' '}
                {new Date(
                  savedJob.jobData.applicationDeadline,
                ).toLocaleDateString()}
              </div>
              {daysUntilDeadline <= 7 && (
                <div className="text-xs text-red-600">
                  {daysUntilDeadline} days left
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleCompare(savedJob.id)}
            >
              {/* <Compare className={`h-4 w-4 ${isComparing ? 'text-blue-600' : ''}`} /> */}
            </Button>
            <Button
              size="sm"
              onClick={() =>
                onUpdateStatus(
                  savedJob.id,
                  savedJob.status === 'applied'
                    ? 'researching'
                    : savedJob.status === 'researching'
                    ? 'ready-to-apply'
                    : 'applied',
                )
              }
            >
              {savedJob.status === 'researching'
                ? 'Ready'
                : savedJob.status === 'ready-to-apply'
                ? 'Apply'
                : 'View'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparePanel({
  savedJobs,
  onClose,
}: {
  savedJobs: SavedJob[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {/* <Compare className="h-5 w-5" /> */}
            Compare Jobs ({savedJobs.length})
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </CardHeader>
        <CardContent className="overflow-auto">
          <div
            className="grid gap-4"
            style={{gridTemplateColumns: `repeat(${savedJobs.length}, 1fr)`}}
          >
            {/* Headers */}
            {savedJobs.map(job => (
              <div key={job.id} className="text-center">
                <h3 className="font-semibold">{job.jobData.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {job.jobData.company}
                </p>
              </div>
            ))}

            {/* Salary */}
            <div className="font-semibold">Salary</div>
            {savedJobs.map(job => (
              <div key={job.id}>{job.jobData.salary}</div>
            ))}

            {/* Location */}
            <div className="font-semibold">Location</div>
            {savedJobs.map(job => (
              <div key={job.id}>{job.jobData.location}</div>
            ))}

            {/* Match Rate */}
            <div className="font-semibold">Match Rate</div>
            {savedJobs.map(job => (
              <div key={job.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{job.jobData.matchRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{width: `${job.jobData.matchRate}%`}}
                  ></div>
                </div>
              </div>
            ))}

            {/* Deadline */}
            <div className="font-semibold">Application Deadline</div>
            {savedJobs.map(job => (
              <div key={job.id}>
                {new Date(job.jobData.applicationDeadline).toLocaleDateString()}
              </div>
            ))}

            {/* Company Rating */}
            <div className="font-semibold">Company Rating</div>
            {savedJobs.map(job => (
              <div key={job.id} className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span>{job.jobData.companyInfo.rating}/5</span>
              </div>
            ))}

            {/* Priority */}
            <div className="font-semibold">Your Priority</div>
            {savedJobs.map(job => (
              <div key={job.id}>
                <Badge
                  variant={
                    job.priority === 'high'
                      ? 'destructive'
                      : job.priority === 'medium'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {job.priority}
                </Badge>
              </div>
            ))}

            {/* Status */}
            <div className="font-semibold">Status</div>
            {savedJobs.map(job => (
              <div key={job.id}>
                <Badge variant="outline">{job.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
