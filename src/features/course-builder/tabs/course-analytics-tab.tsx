import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  Play,
  CheckCircle,
  AlertCircle,
  Target,
  Award,
  MessageCircle
} from 'lucide-react'

export function CourseAnalyticsTab() {
  const engagementData = [
    { module: 'Introduction', completion: 95, avgTime: 12, rating: 4.8 },
    { module: 'Fundamentals', completion: 87, avgTime: 25, rating: 4.6 },
    { module: 'Intermediate', completion: 73, avgTime: 35, rating: 4.5 },
    { module: 'Advanced', completion: 62, avgTime: 42, rating: 4.7 },
    { module: 'Project Work', completion: 45, avgTime: 60, rating: 4.9 },
  ]

  const performanceMetrics = {
    totalEnrollments: 1247,
    activeStudents: 892,
    completionRate: 67,
    averageRating: 4.6,
    totalRevenue: 28450,
    refundRate: 3.2
  }

  const feedbackData = [
    { category: 'Content Quality', score: 4.7, feedback: 'Excellent explanations and examples' },
    { category: 'Video Quality', score: 4.5, feedback: 'Clear audio and video production' },
    { category: 'Assignments', score: 4.3, feedback: 'Challenging but fair projects' },
    { category: 'Support', score: 4.8, feedback: 'Quick response to questions' },
    { category: 'Platform', score: 4.4, feedback: 'Easy to navigate and use' },
  ]

  return (
    <div className='space-y-6'>
      {/* Overview Metrics */}
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Enrollments</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{performanceMetrics.totalEnrollments.toLocaleString()}</div>
            <p className='text-xs text-muted-foreground'>
              <TrendingUp className='h-3 w-3 inline mr-1' />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Students</CardTitle>
            <Play className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{performanceMetrics.activeStudents.toLocaleString()}</div>
            <p className='text-xs text-muted-foreground'>
              {Math.round((performanceMetrics.activeStudents / performanceMetrics.totalEnrollments) * 100)}% engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Completion Rate</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{performanceMetrics.completionRate}%</div>
            <Progress value={performanceMetrics.completionRate} className='mt-2' />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Average Rating</CardTitle>
            <Star className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{performanceMetrics.averageRating}</div>
            <div className='flex items-center mt-1'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(performanceMetrics.averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Revenue</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>${performanceMetrics.totalRevenue.toLocaleString()}</div>
            <p className='text-xs text-muted-foreground'>
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Refund Rate</CardTitle>
            <AlertCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{performanceMetrics.refundRate}%</div>
            <p className='text-xs text-green-600'>
              Below industry avg
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='engagement' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='engagement'>Engagement</TabsTrigger>
          <TabsTrigger value='performance'>Performance</TabsTrigger>
          <TabsTrigger value='feedback'>Feedback</TabsTrigger>
          <TabsTrigger value='recommendations'>Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value='engagement' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Module Engagement Analytics</CardTitle>
              <CardDescription>
                Track how students interact with each module
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {engagementData.map((module, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium'>
                          {index + 1}
                        </div>
                        <div>
                          <div className='font-medium'>{module.module}</div>
                          <div className='text-sm text-muted-foreground'>
                            Avg time: {module.avgTime} minutes
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center space-x-4'>
                        <div className='text-right'>
                          <div className='font-medium'>{module.completion}%</div>
                          <div className='text-sm text-muted-foreground'>completed</div>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <Star className='h-4 w-4 text-yellow-400 fill-current' />
                          <span className='font-medium'>{module.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Progress value={module.completion} className='h-2' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Clock className='h-5 w-5' />
                  <span>Time Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Video Content</span>
                    <div className='flex items-center space-x-2'>
                      <Progress value={65} className='w-20 h-2' />
                      <span className='text-sm font-medium'>65%</span>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Reading Materials</span>
                    <div className='flex items-center space-x-2'>
                      <Progress value={20} className='w-20 h-2' />
                      <span className='text-sm font-medium'>20%</span>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Assignments</span>
                    <div className='flex items-center space-x-2'>
                      <Progress value={15} className='w-20 h-2' />
                      <span className='text-sm font-medium'>15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Target className='h-5 w-5' />
                  <span>Learning Outcomes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Objective 1</span>
                    <Badge variant='default'>Achieved</Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Objective 2</span>
                    <Badge variant='default'>Achieved</Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Objective 3</span>
                    <Badge variant='secondary'>In Progress</Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Objective 4</span>
                    <Badge variant='outline'>Planned</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='performance' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Student progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Week 1</span>
                    <div className='flex items-center space-x-2'>
                      <Progress value={85} className='w-24 h-2' />
                      <span className='text-sm font-medium'>85%</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Week 2</span>
                    <div className='flex items-center space-x-2'>
                      <Progress value={78} className='w-24 h-2' />
                      <span className='text-sm font-medium'>78%</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Week 3</span>
                    <div className='flex items-center space-x-2'>
                      <Progress value={72} className='w-24 h-2' />
                      <span className='text-sm font-medium'>72%</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Week 4</span>
                    <div className='flex items-center space-x-2'>
                      <Progress value={67} className='w-24 h-2' />
                      <span className='text-sm font-medium'>67%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Drop-off Analysis</CardTitle>
                <CardDescription>Where students tend to leave</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Module 1</span>
                    <Badge variant='outline'>5% drop-off</Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Module 2</span>
                    <Badge variant='outline'>8% drop-off</Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Module 3</span>
                    <Badge variant='destructive'>14% drop-off</Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Module 4</span>
                    <Badge variant='destructive'>11% drop-off</Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Module 5</span>
                    <Badge variant='destructive'>17% drop-off</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='feedback' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Student Feedback Summary</CardTitle>
              <CardDescription>
                Aggregated feedback across all course aspects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {feedbackData.map((item, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <MessageCircle className='h-4 w-4 text-muted-foreground' />
                        <span className='font-medium'>{item.category}</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Star className='h-4 w-4 text-yellow-400 fill-current' />
                        <span className='font-medium'>{item.score}</span>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground ml-7'>{item.feedback}</p>
                    <Progress value={item.score * 20} className='ml-7 h-2' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='border-l-4 border-green-500 pl-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='flex'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className='h-3 w-3 text-yellow-400 fill-current' />
                        ))}
                      </div>
                      <span className='text-sm text-muted-foreground'>2 days ago</span>
                    </div>
                    <p className='text-sm mt-1'>"Excellent course! Clear explanations and great examples."</p>
                  </div>
                  
                  <div className='border-l-4 border-blue-500 pl-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='flex'>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Star key={i} className='h-3 w-3 text-yellow-400 fill-current' />
                        ))}
                        <Star className='h-3 w-3 text-gray-300' />
                      </div>
                      <span className='text-sm text-muted-foreground'>5 days ago</span>
                    </div>
                    <p className='text-sm mt-1'>"Good content, could use more practical exercises."</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Module 3 difficulty spike</span>
                    <Badge variant='destructive'>High priority</Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Assignment instructions unclear</span>
                    <Badge variant='default'>Medium priority</Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Video quality in Chapter 7</span>
                    <Badge variant='secondary'>Low priority</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='recommendations' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Award className='h-5 w-5 text-green-500' />
                  <span>Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-start space-x-3'>
                    <CheckCircle className='h-4 w-4 text-green-500 mt-0.5' />
                    <div>
                      <div className='font-medium text-sm'>High engagement in intro modules</div>
                      <div className='text-xs text-muted-foreground'>Students complete first 2 modules consistently</div>
                    </div>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <CheckCircle className='h-4 w-4 text-green-500 mt-0.5' />
                    <div>
                      <div className='font-medium text-sm'>Excellent video production quality</div>
                      <div className='text-xs text-muted-foreground'>Clear audio and visual presentation</div>
                    </div>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <CheckCircle className='h-4 w-4 text-green-500 mt-0.5' />
                    <div>
                      <div className='font-medium text-sm'>Strong practical assignments</div>
                      <div className='text-xs text-muted-foreground'>Students enjoy hands-on projects</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <AlertCircle className='h-5 w-5 text-orange-500' />
                  <span>Areas for Improvement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-start space-x-3'>
                    <AlertCircle className='h-4 w-4 text-orange-500 mt-0.5' />
                    <div>
                      <div className='font-medium text-sm'>Reduce Module 3 complexity</div>
                      <div className='text-xs text-muted-foreground'>Break into smaller, digestible chunks</div>
                    </div>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <AlertCircle className='h-4 w-4 text-orange-500 mt-0.5' />
                    <div>
                      <div className='font-medium text-sm'>Add more intermediate content</div>
                      <div className='text-xs text-muted-foreground'>Bridge the gap between basic and advanced</div>
                    </div>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <AlertCircle className='h-4 w-4 text-orange-500 mt-0.5' />
                    <div>
                      <div className='font-medium text-sm'>Improve assignment instructions</div>
                      <div className='text-xs text-muted-foreground'>Provide clearer step-by-step guidance</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actionable Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='p-4 border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='font-medium'>Add transitional content before Module 3</div>
                    <Badge>High Impact</Badge>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    Create a bridge module to help students transition from basic to intermediate concepts.
                  </p>
                  <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                    <Clock className='h-3 w-3' />
                    <span>Estimated effort: 2-3 weeks</span>
                  </div>
                </div>

                <div className='p-4 border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='font-medium'>Implement spaced repetition quizzes</div>
                    <Badge variant='secondary'>Medium Impact</Badge>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    Add review quizzes at regular intervals to reinforce learning and improve retention.
                  </p>
                  <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                    <Clock className='h-3 w-3' />
                    <span>Estimated effort: 1 week</span>
                  </div>
                </div>

                <div className='p-4 border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='font-medium'>Create video transcripts</div>
                    <Badge variant='outline'>Low Impact</Badge>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    Provide text versions of video content for accessibility and reference.
                  </p>
                  <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                    <Clock className='h-3 w-3' />
                    <span>Estimated effort: 1-2 weeks</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
