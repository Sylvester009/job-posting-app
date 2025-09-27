'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Badge } from '@/styles/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/styles/components/ui/tabs';
import { Input } from '@/styles/components/ui/input';
// import { Textarea } from '@/styles/components/ui/textarea';
import { Label } from '@/styles/components/ui/label';
import { 
  Plus, 
  Edit, 
  Download, 
  Eye, 
  EyeOff, 
  Star, 
  Copy, 
  Trash2, 
  FileText,
  Target,
  BarChart3,
  Share2
} from 'lucide-react';

import profileData from '../data.json';

interface ResumeProfile {
  id: string;
  name: string;
  isPrimary: boolean;
  lastUpdated: string;
  careerPath: string;
  summary: string;
  targetRoles: string[];
  targetSalary: string;
  visibility: string;
  stats: {
    views: number;
    downloads: number;
    applications: number;
  };
  content: {
    experience: Experience[];
    skills: {
      technical: string[];
      soft: string[];
    };
    education: Education[];
  };
}

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<ResumeProfile[]>(profileData.resumeProfiles);
  const [activeTab, setActiveTab] = useState('profiles');
  const [editingProfile, setEditingProfile] = useState<ResumeProfile | null>(null);
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);

  const setPrimaryProfile = (profileId: string) => {
    setProfiles(prev => prev.map(profile => ({
      ...profile,
      isPrimary: profile.id === profileId
    })));
  };

  const duplicateProfile = (profile: ResumeProfile) => {
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
      name: `${profile.name} (Copy)`,
      isPrimary: false,
      lastUpdated: new Date().toISOString().split('T')[0],
      stats: { views: 0, downloads: 0, applications: 0 }
    };
    setProfiles(prev => [...prev, newProfile]);
  };

  const deleteProfile = (profileId: string) => {
    if (profiles.length > 1) {
      setProfiles(prev => {
        const filtered = prev.filter(p => p.id !== profileId);
        // If deleting primary, set first as primary
        if (filtered.length > 0 && !filtered.some(p => p.isPrimary)) {
          filtered[0].isPrimary = true;
        }
        return filtered;
      });
    }
  };

  const primaryProfile = profiles.find(p => p.isPrimary);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Profile Management</h1>
                <p className="text-muted-foreground">
                  Create and manage multiple tailored resumes for different career paths
                </p>
              </div>
              <Button onClick={() => setShowNewProfileForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Profile
              </Button>
            </div>
          </div>

          {/* Primary Profile Banner */}
          {primaryProfile && (
            <div className="px-4 lg:px-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Star className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{primaryProfile.name}</h3>
                          <Badge variant="default">Primary</Badge>
                        </div>
                        <p className="text-muted-foreground">{primaryProfile.careerPath}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>Target: {primaryProfile.targetRoles[0]}</span>
                          <span>•</span>
                          <span>{primaryProfile.targetSalary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="px-4 lg:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profiles">Resume Profiles</TabsTrigger>
                <TabsTrigger value="preview">Live Preview</TabsTrigger>
                <TabsTrigger value="analytics">Profile Analytics</TabsTrigger>
              </TabsList>

              {/* Profiles Tab */}
              <TabsContent value="profiles" className="space-y-6">
                {/* New Profile Form */}
                {showNewProfileForm && (
                  <NewProfileForm 
                    onClose={() => setShowNewProfileForm(false)}
                    onSave={(newProfile) => {
                      setProfiles(prev => [...prev, newProfile]);
                      setShowNewProfileForm(false);
                    }}
                    careerPaths={profileData.careerPaths}
                  />
                )}

                {/* Profiles Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {profiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onSetPrimary={setPrimaryProfile}
                      onDuplicate={duplicateProfile}
                      onDelete={deleteProfile}
                      onEdit={setEditingProfile}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Live Preview Tab */}
              <TabsContent value="preview">
                {primaryProfile && <ResumePreview profile={primaryProfile} />}
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <ProfileAnalytics profiles={profiles} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Edit Profile Modal */}
          {editingProfile && (
            <EditProfileModal
              profile={editingProfile}
              onClose={() => setEditingProfile(null)}
              onSave={(updatedProfile) => {
                setProfiles(prev => prev.map(p => 
                  p.id === updatedProfile.id ? updatedProfile : p
                ));
                setEditingProfile(null);
              }}
              careerPaths={profileData.careerPaths}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ 
  profile, 
  onSetPrimary, 
  onDuplicate, 
  onDelete, 
  onEdit 
}: { 
  profile: ResumeProfile;
  onSetPrimary: (id: string) => void;
  onDuplicate: (profile: ResumeProfile) => void;
  onDelete: (id: string) => void;
  onEdit: (profile: ResumeProfile) => void;
}) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${profile.isPrimary ? 'border-blue-300' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{profile.name}</CardTitle>
              {profile.isPrimary && (
                <Badge variant="default" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Primary
                </Badge>
              )}
            </div>
            <CardDescription>{profile.careerPath}</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant={profile.visibility === 'public' ? 'default' : 'secondary'}>
              {profile.visibility === 'public' ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Target Info */}
        <div>
          <h4 className="text-sm font-semibold">Target Roles</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.targetRoles.slice(0, 2).map(role => (
              <Badge key={role} variant="outline" className="text-xs">
                {role}
              </Badge>
            ))}
            {profile.targetRoles.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{profile.targetRoles.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-semibold">{profile.stats.views}</div>
            <div className="text-xs text-muted-foreground">Views</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{profile.stats.downloads}</div>
            <div className="text-xs text-muted-foreground">Downloads</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{profile.stats.applications}</div>
            <div className="text-xs text-muted-foreground">Apps</div>
          </div>
        </div>

        {/* Skills Preview */}
        <div>
          <h4 className="text-sm font-semibold">Key Skills</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.content.skills.technical.slice(0, 4).map(skill => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {!profile.isPrimary && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSetPrimary(profile.id)}
              className="flex-1"
            >
              <Star className="h-3 w-3 mr-1" />
              Set Primary
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(profile)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDuplicate(profile)}
          >
            <Copy className="h-3 w-3" />
          </Button>
          {!profile.isPrimary && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(profile.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ResumePreview({ profile }: { profile: ResumeProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Preview - {profile.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold">John Doe</h1>
            <p className="text-lg text-muted-foreground">{profile.targetRoles[0]}</p>
            <p className="text-sm">{profile.targetSalary} • {profile.careerPath}</p>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-xl font-semibold border-b mb-2">Professional Summary</h2>
            <p>{profile.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-xl font-semibold border-b mb-2">Experience</h2>
            {profile.content.experience.map(exp => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{exp.title}</h3>
                  <span className="text-muted-foreground">{exp.period}</span>
                </div>
                <p className="font-medium">{exp.company}</p>
                <p>{exp.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {exp.skills.map(skill => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xl font-semibold border-b mb-2">Skills</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Technical</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.content.skills.technical.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Soft Skills</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.content.skills.soft.map(skill => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileAnalytics({ profiles }: { profiles: ResumeProfile[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Profile Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profiles.map(profile => (
              <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.careerPath}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{profile.stats.applications} applications</div>
                  <div className="text-sm text-muted-foreground">
                    {((profile.stats.applications / profile.stats.views) * 100).toFixed(1)}% conversion
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Career Path Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profiles.map(profile => (
              <div key={profile.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{profile.careerPath}</span>
                  <span>{profile.stats.applications} apps</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ 
                      width: `${(profile.stats.applications / Math.max(...profiles.map(p => p.stats.applications))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// New Profile Form Component
function NewProfileForm({ onClose, onSave, careerPaths }: { 
  onClose: () => void; 
  onSave: (profile: ResumeProfile) => void;
  careerPaths: string[];
}) {
  const [formData, setFormData] = useState({
    name: '',
    careerPath: '',
    summary: '',
    targetRoles: [''],
    targetSalary: '$100,000 - $120,000'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: ResumeProfile = {
      id: Date.now().toString(),
      name: formData.name,
      isPrimary: false,
      lastUpdated: new Date().toISOString().split('T')[0],
      careerPath: formData.careerPath,
      summary: formData.summary,
      targetRoles: formData.targetRoles.filter(role => role.trim()),
      targetSalary: formData.targetSalary,
      visibility: 'public',
      stats: { views: 0, downloads: 0, applications: 0 },
      content: {
        experience: [],
        skills: { technical: [], soft: [] },
        education: []
      }
    };
    onSave(newProfile);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Profile</CardTitle>
        <CardDescription>Set up a new tailored resume for a specific career path</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Profile Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Frontend Developer Profile"
              required
            />
          </div>

          <div>
            <Label htmlFor="careerPath">Career Path</Label>
            <select
            title="careerPath"
              id="careerPath"
              value={formData.careerPath}
              onChange={(e) => setFormData(prev => ({ ...prev, careerPath: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a career path</option>
              {careerPaths.map(path => (
                <option key={path} value={path}>{path}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            {/* <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Brief overview of your professional profile..."
              required
            /> */}
          </div>

          <div>
            <Label>Target Roles</Label>
            {formData.targetRoles.map((role, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={role}
                  onChange={(e) => {
                    const newRoles = [...formData.targetRoles];
                    newRoles[index] = e.target.value;
                    setFormData(prev => ({ ...prev, targetRoles: newRoles }));
                  }}
                  placeholder="e.g., Senior Frontend Developer"
                />
                {formData.targetRoles.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      targetRoles: prev.targetRoles.filter((_, i) => i !== index)
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
                targetRoles: [...prev.targetRoles, '']
              }))}
            >
              Add Another Role
            </Button>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Create Profile</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Edit Profile Modal Component
function EditProfileModal({ profile, onClose, onSave, careerPaths }: {
  profile: ResumeProfile;
  onClose: () => void;
  onSave: (profile: ResumeProfile) => void;
  careerPaths: string[];
}) {
  const [formData, setFormData] = useState(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Profile Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="edit-careerPath">Career Path</Label>
              <select
              title="careerPath"
                id="edit-careerPath"
                value={formData.careerPath}
                onChange={(e) => setFormData(prev => ({ ...prev, careerPath: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                {careerPaths.map(path => (
                  <option key={path} value={path}>{path}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="edit-summary">Professional Summary</Label>
              {/* <Textarea
                id="edit-summary"
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              /> */}
            </div>

            <div className="flex gap-2">
              <Button type="submit">Save Changes</Button>
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