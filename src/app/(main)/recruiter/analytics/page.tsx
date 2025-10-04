/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/styles/components/ui/card';
import { Button } from '@/styles/components/ui/button';
import { Badge } from '@/styles/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/styles/components/ui/tabs';
// import { Progress } from '@/styles/components/ui/progress';
import { 
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Download,
  Clock,
  Star,
  Award,
} from 'lucide-react';

import recruiterData from '../dashboard/data.json';

interface AnalyticsData {
  timeMetrics: any;
  sourceEffectiveness: any;
  pipelineMetrics: any;
  qualityMetrics: any;
  diversityMetrics: any;
  costMetrics: any;
  teamPerformance: any;
  monthlyTrends: any[];
}

export default function AnalyticsPage() {
  const [analyticsData] = useState<AnalyticsData>(recruiterData.analytics as AnalyticsData);
  const [dateRange, setDateRange] = useState('last_6_months');
  const [activeTab, setActiveTab] = useState('overview');
  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = async (format: string) => {
    setExportLoading(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Exporting data as ${format}`);
    setExportLoading(false);
  };

  const overallStats = useMemo(() => {
    return {
      totalHires: analyticsData.pipelineMetrics.funnel.hired,
      avgTimeToHire: analyticsData.timeMetrics.timeToHire.average,
      costPerHire: analyticsData.costMetrics.costPerHire,
      candidateSatisfaction: analyticsData.qualityMetrics.candidateSatisfaction,
      offerAcceptanceRate: Math.round(
        (analyticsData.pipelineMetrics.funnel.hired / analyticsData.pipelineMetrics.funnel.offer) * 100
      )
    };
  }, [analyticsData]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
                <p className="text-muted-foreground">
                  Data-driven insights to optimize your recruitment process
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="p-2 border rounded-md text-sm"
                >
                  <option value="last_3_months">Last 3 Months</option>
                  <option value="last_6_months">Last 6 Months</option>
                  <option value="last_year">Last Year</option>
                  <option value="ytd">Year to Date</option>
                </select>
                <Button 
                  variant="outline" 
                  onClick={() => handleExport('pdf')}
                  disabled={exportLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exportLoading ? 'Exporting...' : 'Export'}
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Hires</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.totalHires}</div>
                  <p className="text-xs text-muted-foreground">Current period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.avgTimeToHire}</div>
                  <p className="text-xs text-muted-foreground">Days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cost per Hire</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${overallStats.costPerHire.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Candidate Satisfaction</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.candidateSatisfaction}/5</div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Offer Acceptance</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.offerAcceptanceRate}%</div>
                  <p className="text-xs text-muted-foreground">Rate</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="sources">Sources</TabsTrigger>
                <TabsTrigger value="diversity">Diversity</TabsTrigger>
                <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <TimeToHireMetrics data={analyticsData.timeMetrics} />
                  <PipelineFunnel data={analyticsData.pipelineMetrics} />
                </div>
                
                <div className="grid gap-6 lg:grid-cols-2">
                  <SourceEffectiveness data={analyticsData.sourceEffectiveness} />
                  <QualityMetrics data={analyticsData.qualityMetrics} />
                </div>
              </TabsContent>

              {/* Pipeline Tab */}
              <TabsContent value="pipeline">
                <PipelineAnalysis data={analyticsData} />
              </TabsContent>

              {/* Sources Tab */}
              <TabsContent value="sources">
                <SourceAnalysis data={analyticsData.sourceEffectiveness} />
              </TabsContent>

              {/* Diversity Tab */}
              <TabsContent value="diversity">
                <DiversityMetrics data={analyticsData.diversityMetrics} />
              </TabsContent>

              {/* Cost Analysis Tab */}
              <TabsContent value="costs">
                <CostAnalysis data={analyticsData.costMetrics} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeToHireMetrics({ data }: { data: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time to Hire Metrics
        </CardTitle>
        <CardDescription>
          Average hiring timeline and stage durations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Average */}
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{data.timeToHire.average} days</div>
          <div className="text-sm text-muted-foreground">Average Time to Hire</div>
        </div>

        {/* Time in Stages */}
        <div>
          <h4 className="font-semibold mb-3">Time Spent in Each Stage</h4>
          <div className="space-y-3">
            {Object.entries(data.timeInStages).map(([stage, days]) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-sm capitalize">{stage}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${(Number(days) / data.timeToHire.average) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{days as any}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Chart */}
        <div>
          <h4 className="font-semibold mb-3">Monthly Trend</h4>
          <div className="space-y-2">
            {data.timeToHire.trend.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{item.month}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ 
                        width: `${(item.days / 60) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="font-medium w-8">{item.days}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineFunnel({ data }: { data: any }) {
  const funnelStages = [
    { key: 'applied', label: 'Applied', color: 'bg-blue-500' },
    { key: 'screening', label: 'Screening', color: 'bg-purple-500' },
    { key: 'interview', label: 'Interview', color: 'bg-yellow-500' },
    { key: 'offer', label: 'Offer', color: 'bg-orange-500' },
    { key: 'hired', label: 'Hired', color: 'bg-green-500' }
  ];

  const totalApplicants = data.funnel.applied;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Recruitment Funnel
        </CardTitle>
        <CardDescription>
          Candidate progression through hiring stages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Funnel Visualization */}
        <div className="space-y-2">
          {funnelStages.map((stage, index) => {
            const count = data.funnel[stage.key];
            const percentage = totalApplicants > 0 ? (count / totalApplicants) * 100 : 0;
            const conversionRate = data.conversionRates[stage.key] || 0;

            return (
              <div key={stage.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                  <div>
                    <div className="font-medium capitalize">{stage.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {count} candidates • {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                {conversionRate > 0 && (
                  <Badge variant="outline">
                    {conversionRate}% conversion
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Drop-off Reasons */}
        <div>
          <h4 className="font-semibold mb-3">Top Drop-off Reasons</h4>
          <div className="space-y-2">
            {Object.entries(data.dropoffReasons).map(([reason, count]) => (
              <div key={reason} className="flex items-center justify-between text-sm">
                <span className="capitalize">{reason.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ 
                        width: `${(Number(count) / totalApplicants) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="font-medium w-8">{count as number}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SourceEffectiveness({ data }: { data: any }) {
  const sources = Object.entries(data).map(([key, value]: [string, any]) => ({
    name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    ...value
  })).sort((a, b) => b.conversion - a.conversion);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Source Effectiveness
        </CardTitle>
        <CardDescription>
          Performance metrics by candidate source
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sources.map((source, index) => (
            <div key={source.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">{source.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {source.applications} applications • {source.hires} hires
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-green-600">{source.conversion}%</div>
                <div className="text-sm text-muted-foreground">
                  ${source.costPerHire.toLocaleString()} cost
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QualityMetrics({ data }: { data: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Quality Metrics
        </CardTitle>
        <CardDescription>
          Hiring quality and satisfaction scores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Satisfaction Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{data.candidateSatisfaction}/5</div>
            <div className="text-sm text-muted-foreground">Candidate Satisfaction</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{data.hiringManagerSatisfaction}/5</div>
            <div className="text-sm text-muted-foreground">Hiring Manager Satisfaction</div>
          </div>
        </div>

        {/* Retention Rate */}
        <div>
          <h4 className="font-semibold mb-2">Retention Rate</h4>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full"
                style={{ width: `${data.retentionRate}%` }}
              ></div>
            </div>
            <span className="font-semibold text-green-600">{data.retentionRate}%</span>
          </div>
        </div>

        {/* Performance Scores */}
        <div>
          <h4 className="font-semibold mb-3">New Hire Performance</h4>
          <div className="space-y-2">
            {Object.entries(data.performanceScores).map(([level, percentage]) => (
              <div key={level} className="flex items-center justify-between text-sm">
                <span className="capitalize">{level.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="font-medium w-8">{percentage as any}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineAnalysis({ data }: { data: any }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Stage Conversion Rates</CardTitle>
          <CardDescription>
            How candidates move between stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.pipelineMetrics.conversionRates).map(([stage, rate]) => (
              <div key={stage} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="capitalize font-medium">{stage}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${rate}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-green-600">{rate as any}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>
            Applications and hires over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.monthlyTrends.map((month: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{month.month}</div>
                  <div className="text-sm text-muted-foreground">
                    {month.applications} applications
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{month.hires} hires</div>
                  <div className="text-sm text-muted-foreground">
                    {month.timeToHire} days avg.
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

function SourceAnalysis({ data }: { data: any }) {
  const sources = Object.entries(data).map(([key, value]: [string, any]) => ({
    name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    ...value
  }));

  const totalApplications = sources.reduce((sum, source) => sum + source.applications, 0);
  const totalHires = sources.reduce((sum, source) => sum + source.hires, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Source Performance</CardTitle>
          <CardDescription>
            Applications and conversion by source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sources.map((source) => (
              <div key={source.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{source.name}</span>
                  <span>{source.conversion}% conversion</span>
                </div>
                <div className="flex gap-1 h-2">
                  <div 
                    className="bg-blue-600 rounded-l"
                    style={{ width: `${(source.applications / totalApplications) * 100}%` }}
                    title={`${source.applications} applications`}
                  ></div>
                  <div 
                    className="bg-green-600 rounded-r"
                    style={{ width: `${(source.hires / totalHires) * 100}%` }}
                    title={`${source.hires} hires`}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{source.applications} apps</span>
                  <span>{source.hires} hires</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Efficiency</CardTitle>
          <CardDescription>
            Cost per hire by source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sources.map((source) => (
              <div key={source.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{source.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {source.hires} hires • {source.conversion}% conversion
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    source.costPerHire < 2000 ? 'text-green-600' :
                    source.costPerHire < 4000 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    ${source.costPerHire.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Cost per hire</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DiversityMetrics({ data }: { data: any }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Gender Diversity */}
      <Card>
        <CardHeader>
          <CardTitle>Gender Diversity</CardTitle>
          <CardDescription>
            Distribution across gender
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.gender).map(([gender, percentage]) => (
              <div key={gender} className="flex items-center justify-between">
                <span className="text-sm capitalize">{gender.replace('_', ' ')}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{percentage as any}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ethnicity Diversity */}
      <Card>
        <CardHeader>
          <CardTitle>Ethnicity Diversity</CardTitle>
          <CardDescription>
            Distribution across ethnicity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.ethnicity).map(([ethnicity, percentage]) => (
              <div key={ethnicity} className="flex items-center justify-between">
                <span className="text-sm capitalize">{ethnicity}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{percentage as any}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Age Diversity */}
      <Card>
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
          <CardDescription>
            Distribution across age groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.ageGroups).map(([ageGroup, percentage]) => (
              <div key={ageGroup} className="flex items-center justify-between">
                <span className="text-sm capitalize">{ageGroup.replace('_', ' ')}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{percentage as any}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CostAnalysis({ data }: { data: any }) {
  const costBreakdown = [
    { name: 'Advertising', value: data.advertisingSpend, color: 'bg-blue-500' },
    { name: 'Agency Fees', value: data.agencyFees, color: 'bg-purple-500' },
    { name: 'Referral Bonuses', value: data.referralBonuses, color: 'bg-green-500' },
    { name: 'Other Costs', value: data.otherCosts, color: 'bg-gray-500' }
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription>
            Recruitment spending distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costBreakdown.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>${item.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${(item.value / totalCost) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {((item.value / totalCost) * 100).toFixed(1)}% of total
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ROI & Efficiency</CardTitle>
          <CardDescription>
            Return on investment and cost metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{data.roi}x</div>
            <div className="text-sm text-muted-foreground">Return on Investment</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold">${data.costPerHire.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Cost per Hire</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold">${data.totalSpend.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Spend</div>
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold mb-2">Efficiency Insights</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Referral sources have lowest cost per hire</li>
              <li>• Agency fees represent 28% of total spend</li>
              <li>• ROI exceeds industry average of 2.5x</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}