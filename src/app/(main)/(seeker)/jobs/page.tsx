'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Badge } from '@/styles/components/ui/badge';
import { Button } from '@/styles/components/ui/button';
import { Input } from '@/styles/components/ui/input';
// import { Slider } from '@/styles/components/ui/slider';
import { Checkbox } from '@/styles/components/ui/checkbox';
import { Label } from '@/styles/components/ui/label';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Star, 
  Users,
  Zap,
  Target,
  Briefcase,
  CheckCircle2,
  XCircle
} from 'lucide-react';

import jobsData from '../data.json';

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  matchRate: number;
  skillsRequired: string[];
  experienceRequired: string;
  description: string;
  companyInfo: {
    rating: number;
    size: string;
    industry: string;
  };
  urgency: string;
}

interface JobSeekerProfile {
  skills: string[];
  experience: string;
  preferredLocation: string[];
  desiredSalary: string;
  preferredJobTypes: string[];
  industries: string[];
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [minMatchRate, setMinMatchRate] = useState(70);
  const [filters, setFilters] = useState({
    jobTypes: [] as string[],
    locations: [] as string[],
    industries: [] as string[],
  });
  const [showFilters, setShowFilters] = useState(false);

  const profile: JobSeekerProfile = jobsData.jobSeekerProfile;
  const allJobs: Job[] = jobsData.recommendedJobs;

  // Filter jobs based on criteria
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.skillsRequired.some(skill => 
                             skill.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      
      const matchesMinRate = job.matchRate >= minMatchRate;
      
      const matchesJobType = filters.jobTypes.length === 0 || 
                           filters.jobTypes.includes(job.type);
      
      const matchesLocation = filters.locations.length === 0 || 
                            filters.locations.some(loc => job.location.includes(loc));
      
      const matchesIndustry = filters.industries.length === 0 || 
                            filters.industries.includes(job.companyInfo.industry);

      return matchesSearch && matchesMinRate && matchesJobType && matchesLocation && matchesIndustry;
    });
  }, [allJobs, searchTerm, minMatchRate, filters]);

  const highMatchJobs = filteredJobs.filter(job => job.matchRate >= 85);
  const goodMatchJobs = filteredJobs.filter(job => job.matchRate >= 70 && job.matchRate < 85);

  // Get unique values for filters
  const uniqueJobTypes = [...new Set(allJobs.map(job => job.type))];
  const uniqueLocations = [...new Set(allJobs.map(job => job.location))];
  const uniqueIndustries = [...new Set(allJobs.map(job => job.companyInfo.industry))];

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  // const getMatchColor = (rate: number) => {
  //   if (rate >= 85) return 'text-green-600 bg-green-50 border-green-200';
  //   if (rate >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
  //   return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  // };

  // const getUrgencyBadge = (urgency: string) => {
  //   const config = {
  //     high: { label: 'High Urgency', variant: 'destructive' as const, icon: Zap },
  //     medium: { label: 'Medium Urgency', variant: 'default' as const, icon: Clock },
  //     low: { label: 'Low Urgency', variant: 'secondary' as const, icon: Clock },
  //   };
    
  //   const { label, variant, icon: Icon } = config[urgency as keyof typeof config];
  //   return (
  //     <Badge variant={variant} className="flex items-center gap-1">
  //       <Icon className="h-3 w-3" />
  //       {label}
  //     </Badge>
  //   );
  // };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold tracking-tight">Job Recommendations</h1>
              </div>
              <p className="text-muted-foreground">
                Personalized job matches based on your profile. Only showing jobs with ≥70% match rate.
              </p>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Your Profile Summary
                </CardTitle>
                <CardDescription>
                  Jobs are matched based on your skills, experience, and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <h4 className="font-semibold text-sm">Skills</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.skills.slice(0, 4).map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profile.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Experience</h4>
                    <p className="text-sm text-muted-foreground">{profile.experience}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Preferred Locations</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.preferredLocation.map(loc => (
                        <Badge key={loc} variant="outline" className="text-xs">
                          {loc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Desired Salary</h4>
                    <p className="text-sm text-muted-foreground">{profile.desiredSalary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  {/* Search Bar */}
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search jobs, companies, or skills..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </div>

                  {/* Match Rate Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="match-rate">Minimum Match Rate: {minMatchRate}%</Label>
                      <Badge variant={minMatchRate >= 70 ? "default" : "secondary"}>
                        {minMatchRate >= 70 ? "Optimized" : "Custom"}
                      </Badge>
                    </div>
                    {/* <Slider
                      id="match-rate"
                      min={50}
                      max={100}
                      step={5}
                      value={[minMatchRate]}
                      onValueChange={([value]) => setMinMatchRate(value)}
                      className="cursor-pointer"
                    /> */}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>70% (Recommended)</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  {showFilters && (
                    <div className="grid gap-4 border-t pt-4 md:grid-cols-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Job Type</h4>
                        <div className="space-y-2">
                          {uniqueJobTypes.map(type => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`type-${type}`}
                                checked={filters.jobTypes.includes(type)}
                                onCheckedChange={() => toggleFilter('jobTypes', type)}
                              />
                              <Label htmlFor={`type-${type}`} className="text-sm">
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Location</h4>
                        <div className="space-y-2">
                          {uniqueLocations.map(location => (
                            <div key={location} className="flex items-center space-x-2">
                              <Checkbox
                                id={`location-${location}`}
                                checked={filters.locations.includes(location)}
                                onCheckedChange={() => toggleFilter('locations', location)}
                              />
                              <Label htmlFor={`location-${location}`} className="text-sm">
                                {location}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Industry</h4>
                        <div className="space-y-2">
                          {uniqueIndustries.map(industry => (
                            <div key={industry} className="flex items-center space-x-2">
                              <Checkbox
                                id={`industry-${industry}`}
                                checked={filters.industries.includes(industry)}
                                onCheckedChange={() => toggleFilter('industries', industry)}
                              />
                              <Label htmlFor={`industry-${industry}`} className="text-sm">
                                {industry}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Summary */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {filteredJobs.length} Recommended Jobs
                </h3>
                <p className="text-sm text-muted-foreground">
                  {highMatchJobs.length} perfect matches • {goodMatchJobs.length} good matches
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  ≥70% Match Rate
                </Badge>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4">
              {/* High Match Jobs */}
              {highMatchJobs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-green-600" />
                    <h3 className="text-xl font-semibold">Perfect Matches (≥85%)</h3>
                    <Badge variant="secondary">{highMatchJobs.length} jobs</Badge>
                  </div>
                  <div className="grid gap-4">
                    {highMatchJobs.map(job => (
                      <JobCard key={job.id} job={job} profile={profile} />
                    ))}
                  </div>
                </div>
              )}

              {/* Good Match Jobs */}
              {goodMatchJobs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4 mt-6">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-semibold">Good Matches (70-84%)</h3>
                    <Badge variant="secondary">{goodMatchJobs.length} jobs</Badge>
                  </div>
                  <div className="grid gap-4">
                    {goodMatchJobs.map(job => (
                      <JobCard key={job.id} job={job} profile={profile} />
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredJobs.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                      <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No matching jobs found</h3>
                      <p className="text-muted-foreground mt-2">
                        Try adjusting your filters or minimum match rate to see more recommendations.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setMinMatchRate(70);
                          setFilters({ jobTypes: [], locations: [], industries: [] });
                        }}
                      >
                        Reset to Recommended Settings
                      </Button>
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

function JobCard({ job, profile }: { job: Job; profile: JobSeekerProfile }) {
  const [showDetails, setShowDetails] = useState(false);

  const getMatchColor = (rate: number) => {
    if (rate >= 85) return 'text-green-700 bg-green-100 border-green-300';
    if (rate >= 70) return 'text-blue-700 bg-blue-100 border-blue-300';
    return 'text-yellow-700 bg-yellow-100 border-yellow-300';
  };

  const getUrgencyBadge = (urgency: string) => {
    const config = {
      high: { label: 'High Urgency', variant: 'destructive' as const, icon: Zap },
      medium: { label: 'Medium Urgency', variant: 'default' as const, icon: Clock },
      low: { label: 'Low Urgency', variant: 'secondary' as const, icon: Clock },
    };
    
    const { label, variant, icon: Icon } = config[urgency as keyof typeof config];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  // Calculate skill matches
  const matchedSkills = job.skillsRequired.filter(skill => 
    profile.skills.some(profileSkill => 
      profileSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(profileSkill.toLowerCase())
    )
  );

  const skillMatchPercentage = Math.round((matchedSkills.length / job.skillsRequired.length) * 100);

  return (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Building className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <Badge variant="outline">{job.type}</Badge>
                  {getUrgencyBadge(job.urgency)}
                </div>
                <p className="text-muted-foreground">{job.company}</p>
                
                {/* Job Details */}
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(job.postedDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.companyInfo.size}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Match Rate */}
            <div className="text-right">
              <Badge className={`text-sm font-semibold px-3 py-1 ${getMatchColor(job.matchRate)}`}>
                {job.matchRate}% Match
              </Badge>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs text-muted-foreground">{job.companyInfo.rating}</span>
              </div>
            </div>
          </div>

          {/* Skills Match */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold">Skills Match: {skillMatchPercentage}%</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {job.skillsRequired.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant={matchedSkills.includes(skill) ? "default" : "outline"}
                    className="text-xs"
                  >
                    {skill} {matchedSkills.includes(skill) && "✓"}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Save
              </Button>
              <Button size="sm" disabled={job.matchRate < 70}>
                Quick Apply
              </Button>
            </div>
          </div>

          {/* Expanded Details */}
          {showDetails && (
            <div className="mt-4 space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Job Description</h4>
                <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold">Experience Required</h4>
                  <p className="text-muted-foreground">{job.experienceRequired}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Industry</h4>
                  <p className="text-muted-foreground">{job.companyInfo.industry}</p>
                </div>
              </div>

              {/* Why This Matches Your Profile */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Why this job matches your profile:</h4>
                <ul className="text-sm space-y-1">
                  {matchedSkills.length > 0 && (
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>Skills match: {matchedSkills.length}/{job.skillsRequired.length} required skills</span>
                    </li>
                  )}
                  {profile.preferredLocation.some(loc => job.location.includes(loc)) && (
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>Location matches your preference</span>
                    </li>
                  )}
                  {profile.preferredJobTypes.includes(job.type) && (
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>Job type matches your preference</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}