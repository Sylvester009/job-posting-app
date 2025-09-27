'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Badge } from '@/styles/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/styles/components/ui/tabs';
import { Input } from '@/styles/components/ui/input';
// import { Textarea } from '@/styles/components/ui/textarea';
import { Label } from '@/styles/components/ui/label';
import { 
  Send, 
  Mail, 
  Trash2, 
  Edit, 
  Copy, 
  Search,
  FileText,
  Building,
  User,
  Calendar,
  Save
} from 'lucide-react';

import messagesData from '../data.json';

interface Message {
  id: string;
  subject: string;
  preview: string;
  sentDate?: string;
  lastSaved?: string;
  applicationId?: string;
  recipient?: string;
  status?: 'read' | 'unread';
  jobTitle?: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  usedCount: number;
}

interface ApplicationWithRecruiter {
  id: string;
  jobTitle: string;
  company: string;
  recruiter: {
    name: string;
    title: string;
    email: string;
    lastContact: string;
  };
  applicationDate: string;
  lastStatus: string;
}

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState('compose');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithRecruiter | null>(null);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(messagesData.messages.templates);
  const [drafts, setDrafts] = useState<Message[]>(messagesData.messages.drafts);
  const [sentMessages, setSentMessages] = useState<Message[]>(messagesData.messages.sent as Message[]);
  const [searchTerm, setSearchTerm] = useState('');

  const applications: ApplicationWithRecruiter[] = messagesData.applicationsWithRecruiters;

  const filteredApplications = applications.filter(app =>
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.recruiter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
              <p className="text-muted-foreground">
                Send professional, structured messages to recruiters and track your communications
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 lg:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="compose">Compose</TabsTrigger>
                <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
                <TabsTrigger value="sent">Sent ({sentMessages.length})</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              {/* Compose Tab */}
              <TabsContent value="compose" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Applications List */}
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Your Applications
                      </CardTitle>
                      <CardDescription>
                        Select an application to message the recruiter
                      </CardDescription>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search applications..."
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {filteredApplications.map((application) => (
                        <ApplicationCard
                          key={application.id}
                          application={application}
                          isSelected={selectedApplication?.id === application.id}
                          onSelect={setSelectedApplication}
                        />
                      ))}
                    </CardContent>
                  </Card>

                  {/* Message Composer */}
                  <div className="lg:col-span-2">
                    {selectedApplication ? (
                      <MessageComposer
                        application={selectedApplication}
                        templates={messageTemplates}
                        onTemplateUse={(template) => {
                          // Update usage count
                          setMessageTemplates(prev =>
                            prev.map(t =>
                              t.id === template.id
                                ? { ...t, usedCount: t.usedCount + 1 }
                                : t
                            )
                          );
                        }}
                        onSaveDraft={(draft) => setDrafts(prev => [...prev, draft])}
                        onSendMessage={(message) => setSentMessages(prev => [...prev, message])}
                      />
                    ) : (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold">Select an Application</h3>
                          <p className="text-muted-foreground text-center mt-2">
                            Choose an application from the list to start composing a message to the recruiter
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Drafts Tab */}
              <TabsContent value="drafts">
                <MessageList
                  messages={drafts}
                  type="drafts"
                  onEdit={(draft) => {
                    // Find the application and set as selected
                    const application = applications.find(app => app.id === draft.applicationId);
                    if (application) {
                      setSelectedApplication(application);
                      setActiveTab('compose');
                    }
                  }}
                  onDelete={(draftId) => setDrafts(prev => prev.filter(d => d.id !== draftId))}
                />
              </TabsContent>

              {/* Sent Tab */}
              <TabsContent value="sent">
                <MessageList
                  messages={sentMessages}
                  type="sent"
                  onResend={(message) => {
                    const application = applications.find(app => app.id === message.applicationId);
                    if (application) {
                      setSelectedApplication(application);
                      setActiveTab('compose');
                    }
                  }}
                />
              </TabsContent>

              {/* Templates Tab */}
              <TabsContent value="templates">
                <TemplatesManager
                  templates={messageTemplates}
                  onUseTemplate={(template) => {
                    setActiveTab('compose');
                  }}
                  onEditTemplate={(template) => {
                    // Implement template editing
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ 
  application, 
  isSelected, 
  onSelect 
}: { 
  application: ApplicationWithRecruiter;
  isSelected: boolean;
  onSelect: (app: ApplicationWithRecruiter) => void;
}) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      applied: { label: 'Applied', variant: 'secondary' as const },
      interview: { label: 'Interview', variant: 'default' as const },
      offer: { label: 'Offer', variant: 'default' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.applied;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 bg-blue-50' : ''
      }`}
      onClick={() => onSelect(application)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{application.jobTitle}</h3>
              {getStatusBadge(application.lastStatus)}
            </div>
            <p className="text-sm text-muted-foreground">{application.company}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{application.recruiter.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Applied {new Date(application.applicationDate).toLocaleDateString()}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MessageComposer({ 
  application, 
  templates, 
  onTemplateUse,
  onSaveDraft,
  onSendMessage 
}: { 
  application: ApplicationWithRecruiter;
  templates: MessageTemplate[];
  onTemplateUse: (template: MessageTemplate) => void;
  onSaveDraft: (draft: Message) => void;
  onSendMessage: (message: Message) => void;
}) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const replacePlaceholders = (text: string) => {
    return text
      .replace(/{Job Title}/g, application.jobTitle)
      .replace(/{Company Name}/g, application.company)
      .replace(/{Recruiter Name}/g, application.recruiter.name);
  };

  const applyTemplate = (template: MessageTemplate) => {
    setSubject(replacePlaceholders(template.subject));
    setBody(replacePlaceholders(template.body));
    onTemplateUse(template);
    
    // Focus on body after applying template
    setTimeout(() => bodyRef.current?.focus(), 100);
  };

  const handleSaveDraft = () => {
    const draft: Message = {
      id: `draft-${Date.now()}`,
      subject: subject || 'Untitled Draft',
      preview: body.substring(0, 100) + '...',
      lastSaved: new Date().toISOString(),
      applicationId: application.id
    };
    onSaveDraft(draft);
  };

  const handleSend = async () => {
    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sentMessage: Message = {
      id: `sent-${Date.now()}`,
      subject,
      preview: body.substring(0, 100) + '...',
      sentDate: new Date().toISOString(),
      applicationId: application.id,
      recipient: `${application.recruiter.name} - ${application.company}`,
      status: 'unread',
      jobTitle: application.jobTitle
    };
    
    onSendMessage(sentMessage);
    setIsSending(false);
    
    // Reset form
    setSubject('');
    setBody('');
  };

  const suggestedTemplates = templates.filter(t => 
    t.category === 'follow-up' || 
    (application.lastStatus === 'interview' && t.category === 'thank-you')
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Compose Message</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              size="sm" 
              onClick={handleSend}
              disabled={!subject.trim() || !body.trim() || isSending}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          To: {application.recruiter.name} ({application.recruiter.email}) - {application.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Suggested Templates */}
        {suggestedTemplates.length > 0 && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              {/* <Template className="h-4 w-4" /> */}
              Suggested Templates
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestedTemplates.map(template => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate(template)}
                  className="text-xs"
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Subject */}
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Enter message subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Body */}
        <div>
          <Label htmlFor="body">Message</Label>
          {/* <Textarea
            ref={bodyRef}
            id="body"
            placeholder="Compose your message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            className="font-mono text-sm"
          /> */}
        </div>

        {/* Formatting Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-semibold text-sm mb-2">Professional Messaging Tips:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Use a clear, descriptive subject line</li>
            <li>• Address the recruiter by name</li>
            <li>• Reference the specific job title and company</li>
            <li>• Keep your message concise and professional</li>
            <li>• Proofread before sending</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function MessageList({ 
  messages, 
  type, 
  onEdit, 
  onDelete,
  onResend 
}: { 
  messages: Message[];
  type: 'drafts' | 'sent';
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onResend?: (message: Message) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'drafts' ? <FileText className="h-5 w-5" /> : <Send className="h-5 w-5" />}
          {type === 'drafts' ? 'Draft Messages' : 'Sent Messages'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{message.subject}</h3>
                      {message.status && (
                        <Badge variant={message.status === 'read' ? 'default' : 'secondary'}>
                          {message.status === 'read' ? 'Read' : 'Unread'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{message.preview}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {message.recipient && (
                        <span>To: {message.recipient}</span>
                      )}
                      {message.jobTitle && (
                        <span>Job: {message.jobTitle}</span>
                      )}
                      {message.sentDate ? (
                        <span>Sent: {new Date(message.sentDate).toLocaleString()}</span>
                      ) : (
                        message.lastSaved && (
                          <span>Last saved: {new Date(message.lastSaved).toLocaleString()}</span>
                        )
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {type === 'drafts' && onEdit && (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(message)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {type === 'sent' && onResend && (
                      <Button variant="ghost" size="sm" onClick={() => onResend(message)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="sm" onClick={() => onDelete(message.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No {type} messages</h3>
              <p className="text-muted-foreground">
                {type === 'drafts' 
                  ? 'You have no saved drafts. Start composing a message to save it as a draft.'
                  : 'You haven\'t sent any messages yet.'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TemplatesManager({ 
  templates, 
  onUseTemplate,
  onEditTemplate 
}: { 
  templates: MessageTemplate[];
  onUseTemplate: (template: MessageTemplate) => void;
  onEditTemplate: (template: MessageTemplate) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(templates.map(t => t.category))];
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Templates' : category.split('-').join(' ')}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                {template.name}
                <Badge variant="secondary">{template.usedCount} uses</Badge>
              </CardTitle>
              <CardDescription>{template.subject}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground line-clamp-3">
                {template.body.substring(0, 100)}...
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onUseTemplate(template)}
                >
                  Use Template
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {/* <Template className="h-12 w-12 text-muted-foreground mb-4" /> */}
            <h3 className="text-lg font-semibold">No templates found</h3>
            <p className="text-muted-foreground">
              {selectedCategory === 'all' 
                ? 'You have no message templates yet.'
                : `No templates found in the ${selectedCategory} category.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}