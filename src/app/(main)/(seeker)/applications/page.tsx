'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/styles/components/ui/tabs';
import { Badge } from '@/styles/components/ui/badge';
import { Button } from '@/styles/components/ui/button';
import { Input } from '@/styles/components/ui/input';
import { 
  Search,
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Star, 
  Eye, 
  EyeOff,
  Building,
  Globe,
  Clock
} from 'lucide-react';

import applicationsData from '../data.json';

type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdate: string;
  location: string;
  salary: string;
  type: string;
  companyInfo: {
    rating: number;
    reviews: number;
    employees: string;
    industry: string;
    founded: number;
    website: string;
  };
  applicationStats: {
    viewed: boolean;
    savedBy: number;
    applicants: number;
  };
}

export default function ApplicationsPage() {
  const [applications] = useState<Application[]>(applicationsData.applications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    interview: applications.filter(app => app.status === 'interview').length,
    offer: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
              <p className="text-muted-foreground">
                Track your job applications and get detailed company insights
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                  <p className="text-xs text-muted-foreground">All time applications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statusCounts.interview + statusCounts.applied}</div>
                  <p className="text-xs text-muted-foreground">In progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((statusCounts.interview / applications.length) * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Of total applications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((statusCounts.offer / applications.length) * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Offers received</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs or companies..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as unknown as ApplicationStatus | 'all')}>
                    <TabsList>
                      <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                      <TabsTrigger value="applied">Applied ({statusCounts.applied})</TabsTrigger>
                      <TabsTrigger value="interview">Interview ({statusCounts.interview})</TabsTrigger>
                      <TabsTrigger value="offer">Offer ({statusCounts.offer})</TabsTrigger>
                      <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applications List */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4">
              {filteredApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
              
              {filteredApplications.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                      <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No applications found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'Start applying to jobs to track your progress here'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  const [showCompanyInsights, setShowCompanyInsights] = useState(false);

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = {
      applied: { label: 'Applied', variant: 'secondary' as const },
      interview: { label: 'Interview', variant: 'default' as const },
      offer: { label: 'Offer', variant: 'success' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Main Application Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Building className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                  {getStatusBadge(application.status)}
                </div>
                <p className="text-muted-foreground">{application.company}</p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {application.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {application.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Applied {new Date(application.appliedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompanyInsights(!showCompanyInsights)}
              >
                {showCompanyInsights ? 'Hide Insights' : 'Show Insights'}
              </Button>
            </div>
          </div>

          {/* Application Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {application.applicationStats.viewed ? (
                <Eye className="h-3 w-3 text-green-500" />
              ) : (
                <EyeOff className="h-3 w-3 text-muted-foreground" />
              )}
              <span>{application.applicationStats.viewed ? 'Viewed' : 'Not viewed'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{application.applicationStats.applicants} applicants</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span>{application.companyInfo.rating} ({application.companyInfo.reviews} reviews)</span>
            </div>
          </div>

          {/* Company Insights */}
          {showCompanyInsights && (
            <div className="mt-4 rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-3">Company Insights</h4>
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div>
                  <p className="font-medium">Company Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span>{application.companyInfo.rating}/5</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Employees</p>
                  <p>{application.companyInfo.employees}</p>
                </div>
                <div>
                  <p className="font-medium">Industry</p>
                  <p>{application.companyInfo.industry}</p>
                </div>
                <div>
                  <p className="font-medium">Founded</p>
                  <p>{application.companyInfo.founded}</p>
                </div>
              </div>
              <div className="mt-3">
                <Button variant="link" size="sm" className="p-0 h-auto">
                  <Globe className="h-3 w-3 mr-1" />
                  Visit company website
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}