/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Badge } from '@/styles/components/ui/badge';
import { Input } from '@/styles/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/styles/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Users,
  TrendingUp,
  Clock,
  Pause,
  Play,
  Copy,
  Trash2,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react';

import recruiterData from "../dashboard/data.json";
import { Label } from '@/styles/components/ui/label';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  salaryRange: string;
  experienceLevel: string;
  status: 'active' | 'paused' | 'draft' | 'closed';
  views: number;
  applications: number;
  matches: number;
  datePosted: string | null;
  applicationDeadline: string;
  description: string;
  requirements: string[];
  skills: string[];
  pipeline: {
    applied: number;
    screening: number;
    interview: number;
    offer: number;
    hired: number;
  };
}

export default function JobPostingsPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(recruiterData.jobPostings as JobPosting[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewJobForm, setShowNewJobForm] = useState(false);

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: jobPostings.length,
    active: jobPostings.filter(job => job.status === 'active').length,
    draft: jobPostings.filter(job => job.status === 'draft').length,
    totalApplications: jobPostings.reduce((sum, job) => sum + job.applications, 0),
    totalViews: jobPostings.reduce((sum, job) => sum + job.views, 0)
  };

  const toggleJobStatus = (jobId: string) => {
    setJobPostings(prev => prev.map(job => {
      if (job.id === jobId) {
        const newStatus = job.status === 'active' ? 'paused' : 'active';
        return { ...job, status: newStatus };
      }
      return job;
    }));
  };

  const duplicateJob = (job: JobPosting) => {
    const newJob = {
      ...job,
      id: `job${Date.now()}`,
      title: `${job.title} (Copy)`,
      status: 'draft' as const,
      views: 0,
      applications: 0,
      matches: 0,
      datePosted: null
    };
    setJobPostings(prev => [...prev, newJob]);
  };

  const deleteJob = (jobId: string) => {
    setJobPostings(prev => prev.filter(job => job.id !== jobId));
  };

  

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Job Postings</h1>
                <p className="text-muted-foreground">
                  Create and manage job openings for {recruiterData.companyInfo.name}
                </p>
              </div>
              <Button onClick={() => setShowNewJobForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Job Posting
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Job postings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <p className="text-xs text-muted-foreground">Currently recruiting</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Job Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <p className="text-xs text-muted-foreground">Total views</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs by title or department..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList>
                      <TabsTrigger value="all">All Jobs</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="draft">Drafts</TabsTrigger>
                      <TabsTrigger value="paused">Paused</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs List */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <JobPostingCard
                  key={job.id}
                  job={job}
                  onToggleStatus={toggleJobStatus}
                  onDuplicate={duplicateJob}
                  onDelete={deleteJob}
                />
              ))}
              
              {filteredJobs.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                      <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No job postings found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'Create your first job posting to start attracting talent'
                        }
                      </p>
                      <Button className="mt-4" onClick={() => setShowNewJobForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Job Posting
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Job Form Modal */}
      {showNewJobForm && (
        <NewJobForm
          onClose={() => setShowNewJobForm(false)}
          onSave={(newJob) => {
            setJobPostings(prev => [...prev, newJob]);
            setShowNewJobForm(false);
          }}
          companyInfo={recruiterData.companyInfo}
          departments={recruiterData?.departments}
          jobTypes={recruiterData?.jobTypes}
          experienceLevels={recruiterData?.experienceLevels}
          locations={recruiterData?.locations}
        />
      )}
    </div>
  );
}

function JobPostingCard({ 
  job, 
  onToggleStatus, 
  onDuplicate, 
  onDelete 
}: { 
  job: JobPosting;
  onToggleStatus: (jobId: string) => void;
  onDuplicate: (job: JobPosting) => void;
  onDelete: (jobId: string) => void;
}) {
  const [showPipeline, setShowPipeline] = useState(false);

  const applicationRate = job.views > 0 ? ((job.applications / job.views) * 100).toFixed(1) : '0';

  const getStatusBadge = (status: JobPosting['status']) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const, icon: Play },
      paused: { label: 'Paused', variant: 'secondary' as const, icon: Pause },
      draft: { label: 'Draft', variant: 'outline' as const, icon: Edit },
      closed: { label: 'Closed', variant: 'destructive' as const, icon: Clock }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Building className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  {getStatusBadge(job.status)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span>{job.department}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                  <span>•</span>
                  <span>{job.experienceLevel}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {job.salaryRange}
                  </div>
                  {job.datePosted && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Posted {new Date(job.datePosted).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(job.id)}
              >
                {job.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{job.views}</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{job.applications}</div>
              <div className="text-xs text-muted-foreground">Applications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{job.matches}</div>
              <div className="text-xs text-muted-foreground">Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{applicationRate}%</div>
              <div className="text-xs text-muted-foreground">Apply Rate</div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 5).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>

          {/* Actions & Pipeline */}
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowPipeline(!showPipeline)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showPipeline ? 'Hide Pipeline' : 'Show Pipeline'}
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onDuplicate(job)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(job.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Pipeline View */}
          {showPipeline && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Application Pipeline</h4>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="p-2 border rounded">
                  <div className="text-lg font-bold text-blue-600">{job.pipeline.applied}</div>
                  <div className="text-xs text-muted-foreground">Applied</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-lg font-bold text-yellow-600">{job.pipeline.screening}</div>
                  <div className="text-xs text-muted-foreground">Screening</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-lg font-bold text-purple-600">{job.pipeline.interview}</div>
                  <div className="text-xs text-muted-foreground">Interview</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-lg font-bold text-green-600">{job.pipeline.offer}</div>
                  <div className="text-xs text-muted-foreground">Offer</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-lg font-bold text-gray-600">{job.pipeline.hired}</div>
                  <div className="text-xs text-muted-foreground">Hired</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// New Job Form Component
function NewJobForm({ 
  onClose, 
  onSave,
  companyInfo,
  departments,
  jobTypes,
  experienceLevels,
  locations 
}: { 
  onClose: () => void;
  onSave: (job: JobPosting) => void;
  companyInfo: any;
  departments: string[];
  jobTypes: string[];
  experienceLevels: string[];
  locations: string[];
}) {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    type: 'Full-time',
    location: 'Remote',
    salaryRange: '',
    experienceLevel: 'Mid-level',
    applicationDeadline: '',
    description: '',
    requirements: [''],
    skills: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newJob: JobPosting = {
      id: `job${Date.now()}`,
      title: formData.title,
      department: formData.department,
      type: formData.type,
      location: formData.location,
      salaryRange: formData.salaryRange,
      experienceLevel: formData.experienceLevel,
      status: 'draft',
      views: 0,
      applications: 0,
      matches: 0,
      datePosted: null,
      applicationDeadline: formData.applicationDeadline,
      description: formData.description,
      requirements: formData.requirements.filter(req => req.trim()),
      skills: formData.skills.filter(skill => skill.trim()),
      pipeline: {
        applied: 0,
        screening: 0,
        interview: 0,
        offer: 0,
        hired: 0
      }
    };
    
    onSave(newJob);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle>Create New Job Posting</CardTitle>
          <CardDescription>
            Post a new job opening for {companyInfo.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="department">Department *</Label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="type">Job Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <select
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <select
                  id="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="salaryRange">Salary Range</Label>
              <Input
                id="salaryRange"
                value={formData.salaryRange}
                onChange={(e) => setFormData(prev => ({ ...prev, salaryRange: e.target.value }))}
                placeholder="e.g., $100,000 - $130,000"
              />
            </div>

            <div>
              <Label htmlFor="applicationDeadline">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className="w-full p-2 border rounded-md"
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <Label>Requirements</Label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={req}
                    onChange={(e) => {
                      const newReqs = [...formData.requirements];
                      newReqs[index] = e.target.value;
                      setFormData(prev => ({ ...prev, requirements: newReqs }));
                    }}
                    placeholder="e.g., 5+ years of experience in..."
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        requirements: prev.requirements.filter((_, i) => i !== index)
                      }))}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  requirements: [...prev.requirements, '']
                }))}
              >
                Add Requirement
              </Button>
            </div>

            {/* Skills */}
            <div>
              <Label>Required Skills</Label>
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...formData.skills];
                      newSkills[index] = e.target.value;
                      setFormData(prev => ({ ...prev, skills: newSkills }));
                    }}
                    placeholder="e.g., React, TypeScript, etc."
                  />
                  {formData.skills.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        skills: prev.skills.filter((_, i) => i !== index)
                      }))}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  skills: [...prev.skills, '']
                }))}
              >
                Add Skill
              </Button>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Create Job Posting
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}