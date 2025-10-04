/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Badge } from '@/styles/components/ui/badge';
import { Input } from '@/styles/components/ui/input';
// import { Textarea } from '@/styles/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/styles/components/ui/tabs';
import { 
  Search, 
  MessageSquare,
  Calendar,
  Clock,
  Video,
  Phone,
  Paperclip,
  Send,
  User,
  CheckCircle2,
  Edit,
} from 'lucide-react';

import recruiterData from '../dashboard/data.json';

interface Applicant {
  id: string;
  name: string;
  email: string;
  photo: string;
  currentRole: string;
}

interface Interview {
  id: string;
  date: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  duration: number;
  participants: string[];
  meetingLink?: string;
  feedback?: string;
}

interface Conversation {
  id: string;
  applicantId: string;
  jobId: string;
  applicant: Applicant;
  jobTitle: string;
  lastMessage: {
    content: string;
    timestamp: string;
    sender: 'applicant' | 'recruiter';
    read: boolean;
  };
  unreadCount: number;
  status: string;
  lastActivity: string;
  scheduledInterviews: Interview[];
}

interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
}

export default function MessagesPage() {
  const [conversations] = useState<Conversation[]>(recruiterData.messages.conversations as Conversation[]);
  const [templates] = useState<MessageTemplate[]>(recruiterData.messages.messageTemplates as MessageTemplate[]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Mock messages data for the selected conversation
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    timestamp: string;
    sender: 'applicant' | 'recruiter';
    type: 'text' | 'interview' | 'attachment';
    interview?: Interview;
  }>>([]);

  useEffect(() => {
    if (selectedConversation) {
      // Load mock messages for the selected conversation
      setMessages([
        {
          id: '1',
          content: "Hi, I'm interested in the Senior Frontend Developer position and would love to learn more about the role.",
          timestamp: '2024-01-18T10:30:00Z',
          sender: 'applicant',
          type: 'text'
        },
        {
          id: '2',
          content: "Thanks for your application! We're impressed with your background. Are you available for a quick call this week?",
          timestamp: '2024-01-18T14:20:00Z',
          sender: 'recruiter',
          type: 'text'
        },
        {
          id: '3',
          content: "Technical Interview Scheduled",
          timestamp: '2024-01-19T09:15:00Z',
          sender: 'recruiter',
          type: 'interview',
          interview: selectedConversation.scheduledInterviews[0]
        },
        {
          id: '4',
          content: "Looking forward to discussing the technical interview details tomorrow.",
          timestamp: '2024-01-20T14:30:00Z',
          sender: 'applicant',
          type: 'text'
        }
      ]);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now().toString(),
      content: messageInput,
      timestamp: new Date().toISOString(),
      sender: 'recruiter' as const,
      type: 'text' as const
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
                <p className="text-muted-foreground">
                  Communicate with applicants and schedule interviews
                </p>
              </div>
              <Button onClick={() => setShowScheduleModal(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="interviews">Interviews</TabsTrigger>
              </TabsList>

              {/* Messages Tab */}
              <TabsContent value="messages" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Conversations List */}
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle>Conversations</CardTitle>
                      <CardDescription>
                        Active conversations with applicants
                      </CardDescription>
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search applicants..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                          <TabsList className="w-full">
                            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                            <TabsTrigger value="screening" className="flex-1">Screening</TabsTrigger>
                            <TabsTrigger value="interview" className="flex-1">Interview</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedConversation?.id === conversation.id ? 'bg-muted border-blue-300' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm truncate">
                                  {conversation.applicant.name}
                                </h4>
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="default" className="ml-2">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {conversation.lastMessage.content}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-1">
                                  {getStatusBadge(conversation.status)}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(conversation.lastMessage.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Message Thread */}
                  <div className="lg:col-span-2">
                    {selectedConversation ? (
                      <Card className="h-[600px] flex flex-col">
                        <CardHeader className="border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {selectedConversation.applicant.name}
                                </CardTitle>
                                <CardDescription>
                                  {selectedConversation.applicant.currentRole} • {selectedConversation.jobTitle}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Video className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        {/* Messages Container */}
                        <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  message.sender === 'recruiter'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-muted'
                                }`}
                              >
                                {message.type === 'interview' && message.interview ? (
                                  <InterviewMessage interview={message.interview} />
                                ) : (
                                  <p className="text-sm">{message.content}</p>
                                )}
                                <p className={`text-xs mt-1 ${
                                  message.sender === 'recruiter' ? 'text-blue-100' : 'text-muted-foreground'
                                }`}>
                                  {formatTime(message.timestamp)}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </CardContent>

                        {/* Message Input */}
                        <div className="border-t p-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Type your message..."
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  sendMessage();
                                }
                              }}
                            />
                            <Button variant="outline" size="icon">
                              <Paperclip className="h-4 w-4" />
                            </Button>
                            <Button onClick={sendMessage}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card className="h-[600px] flex items-center justify-center">
                        <CardContent className="text-center">
                          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold">Select a conversation</h3>
                          <p className="text-muted-foreground">
                            Choose a conversation from the list to start messaging
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Templates Tab */}
              <TabsContent value="templates">
                <TemplatesManager templates={templates} />
              </TabsContent>

              {/* Interviews Tab */}
              <TabsContent value="interviews">
                <InterviewsManager conversations={conversations} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <ScheduleInterviewModal
          onClose={() => setShowScheduleModal(false)}
          onSchedule={(interview) => {
            // Handle interview scheduling
            console.log('Scheduled interview:', interview);
            setShowScheduleModal(false);
          }}
          applicants={conversations.map(conv => conv.applicant)}
          interviewTypes={recruiterData.messages.interviewTypes}
          durationOptions={recruiterData.messages.durationOptions}
        />
      )}
    </div>
  );
}

function InterviewMessage({ interview }: { interview: Interview }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span className="font-semibold">Interview Scheduled</span>
      </div>
      <div className="text-sm">
        <div><strong>Type:</strong> {interview.type}</div>
        <div><strong>Date:</strong> {new Date(interview.date).toLocaleString()}</div>
        <div><strong>Duration:</strong> {interview.duration} minutes</div>
        {interview.meetingLink && (
          <div>
            <strong>Link:</strong>{' '}
            <a href={interview.meetingLink} className="underline" target="_blank" rel="noopener noreferrer">
              Join Meeting
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function TemplatesManager({ templates }: { templates: MessageTemplate[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(templates.map(t => t.category))];
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Templates' : category.split('_').join(' ')}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.subject}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground line-clamp-3">
                {template.body}
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
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
    </div>
  );
}

function InterviewsManager({ conversations }: { conversations: Conversation[] }) {
  const upcomingInterviews = conversations.flatMap(conv => 
    conv.scheduledInterviews
      .filter(int => int.status === 'scheduled')
      .map(int => ({ ...int, applicant: conv.applicant, jobTitle: conv.jobTitle }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastInterviews = conversations.flatMap(conv => 
    conv.scheduledInterviews
      .filter(int => int.status === 'completed')
      .map(int => ({ ...int, applicant: conv.applicant, jobTitle: conv.jobTitle }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Interviews
            </CardTitle>
            <CardDescription>
              Scheduled interviews for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{interview.applicant.name}</h4>
                  <Badge variant="default">{interview.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{interview.jobTitle}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(interview.date).toLocaleString()}
                  </div>
                  <Button variant="outline" size="sm">
                    <Video className="h-3 w-3 mr-1" />
                    Join
                  </Button>
                </div>
              </div>
            ))}
            {upcomingInterviews.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No upcoming interviews
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Interviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Recent Interviews
            </CardTitle>
            <CardDescription>
              Completed interviews with feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pastInterviews.map((interview) => (
              <div key={interview.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{interview.applicant.name}</h4>
                  <Badge variant="outline">Completed</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{interview.jobTitle}</p>
                {interview.feedback && (
                  <p className="text-sm mb-2 line-clamp-2">{interview.feedback}</p>
                )}
                <div className="text-sm text-muted-foreground">
                  {new Date(interview.date).toLocaleDateString()}
                </div>
              </div>
            ))}
            {pastInterviews.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No recent interviews
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ScheduleInterviewModal({ 
  onClose, 
  onSchedule,
  applicants,
  interviewTypes,
  durationOptions 
}: { 
  onClose: () => void;
  onSchedule: (interview: any) => void;
  applicants: Applicant[];
  interviewTypes: string[];
  durationOptions: number[];
}) {
  const [formData, setFormData] = useState({
    applicantId: '',
    type: 'technical',
    date: '',
    time: '',
    duration: 60,
    participants: [''],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const interview = {
      id: `int${Date.now()}`,
      date: new Date(`${formData.date}T${formData.time}`).toISOString(),
      type: formData.type,
      status: 'scheduled' as const,
      duration: formData.duration,
      participants: formData.participants.filter(p => p.trim()),
      meetingLink: `https://meet.techcorp.com/interview-${Date.now()}`,
      notes: formData.notes
    };

    onSchedule(interview);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Schedule Interview</CardTitle>
          <CardDescription>
            Schedule a new interview with an applicant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Applicant</label>
              <select
                value={formData.applicantId}
                onChange={(e) => setFormData(prev => ({ ...prev, applicantId: e.target.value }))}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Applicant</option>
                {applicants.map(applicant => (
                  <option key={applicant.id} value={applicant.id}>
                    {applicant.name} - {applicant.currentRole}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Interview Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  {interviewTypes.map(type => (
                    <option key={type} value={type}>
                      {type.split('_').join(' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full p-2 border rounded-md"
                >
                  {durationOptions.map(duration => (
                    <option key={duration} value={duration}>
                      {duration} min
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Participants</label>
              {formData.participants.map((participant, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={participant}
                    onChange={(e) => {
                      const newParticipants = [...formData.participants];
                      newParticipants[index] = e.target.value;
                      setFormData(prev => ({ ...prev, participants: newParticipants }));
                    }}
                    placeholder="Participant name and role"
                  />
                  {formData.participants.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        participants: prev.participants.filter((_, i) => i !== index)
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
                  participants: [...prev.participants, '']
                }))}
              >
                Add Participant
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              {/* <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes for the interview..."
                rows={3}
              /> */}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Schedule Interview
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