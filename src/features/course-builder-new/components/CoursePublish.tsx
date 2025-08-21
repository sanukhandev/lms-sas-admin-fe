import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCourseBuilder } from '../context/CourseBuilderContext';
import { 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  Video, 
  FileText,
  Calendar,
  DollarSign,
  Globe
} from 'lucide-react';

export function CoursePublish() {
  const { 
    courseId,
    courseDetails,
    structure,
    pricing,
    publishCourse,
    loading 
  } = useCourseBuilder();
  
  const [publishing, setPublishing] = useState(false);
  
  // Validation checks for publishing
  const hasValidStructure = structure && 
    structure.modules && 
    structure.modules.length > 0 && 
    structure.total_chapters > 0;
  
  const hasValidPricing = pricing && 
    ((pricing.access_model === 'one_time' && pricing.base_price > 0) || 
     (pricing.access_model === 'monthly_subscription' && pricing.subscription_price! > 0) ||
     (pricing.access_model === 'full_curriculum' && pricing.base_price > 0));
  
  const isReadyToPublish = courseId && 
    courseDetails.title && 
    courseDetails.description && 
    hasValidStructure && 
    hasValidPricing;
  
  const handlePublish = async () => {
    if (!isReadyToPublish) return;
    
    setPublishing(true);
    try {
      await publishCourse();
    } finally {
      setPublishing(false);
    }
  };
  
  if (!courseId) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold">Publish Course</h2>
        <div className="flex items-center p-4 text-amber-800 bg-amber-50 rounded-md">
          <AlertCircle className="mr-2" size={20} />
          <p>Please complete the course details first.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 bg-white p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold">Publish Course</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left panel: Checklist and requirements */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publishing Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                {courseDetails.title ? (
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <X className="mr-2 h-5 w-5 text-red-500" />
                )}
                <span className={!courseDetails.title ? 'text-gray-400' : ''}>
                  Course title is set
                </span>
              </div>
              
              <div className="flex items-center">
                {courseDetails.description ? (
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <X className="mr-2 h-5 w-5 text-red-500" />
                )}
                <span className={!courseDetails.description ? 'text-gray-400' : ''}>
                  Course description is set
                </span>
              </div>
              
              <div className="flex items-center">
                {hasValidStructure ? (
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <X className="mr-2 h-5 w-5 text-red-500" />
                )}
                <span className={!hasValidStructure ? 'text-gray-400' : ''}>
                  Course has at least one module with content
                </span>
              </div>
              
              <div className="flex items-center">
                {hasValidPricing ? (
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <X className="mr-2 h-5 w-5 text-red-500" />
                )}
                <span className={!hasValidPricing ? 'text-gray-400' : ''}>
                  Course pricing is configured
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publishing Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Clock className="mt-0.5 h-4 w-4 text-blue-500 shrink-0" />
                <div>
                  <p className="font-medium">Scheduling</p>
                  <p className="text-sm text-gray-500">
                    Once published, your course will be immediately available to students.
                    You can unpublish the course at any time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />
                <div>
                  <p className="font-medium">Content Quality</p>
                  <p className="text-sm text-gray-500">
                    Ensure all content is professional, free of errors, and meets our community guidelines.
                    Low-quality content may be flagged for review.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                <div>
                  <p className="font-medium">Post-Publishing</p>
                  <p className="text-sm text-gray-500">
                    After publishing, you can still edit your course, add content, or adjust pricing.
                    Students who already enrolled will be notified of any significant updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right panel: Summary and publish button */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium truncate">{courseDetails.title || 'Not set'}</p>
              </div>
              
              <Separator />
              
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4 text-gray-500" />
                <p className="text-sm">
                  <span className="font-medium">{structure?.modules.length || 0}</span> modules
                </p>
              </div>
              
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-gray-500" />
                <p className="text-sm">
                  <span className="font-medium">{structure?.total_chapters || 0}</span> chapters
                </p>
              </div>
              
              <div className="flex items-center">
                <Video className="mr-2 h-4 w-4 text-gray-500" />
                <p className="text-sm">
                  <span className="font-medium">{structure?.total_duration || 0}</span> hours of content
                </p>
              </div>
              
              <Separator />
              
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                <p className="text-sm">
                  {pricing?.access_model === 'one_time' && (
                    <span className="font-medium">
                      ${pricing.base_price} one-time payment
                    </span>
                  )}
                  {pricing?.access_model === 'monthly_subscription' && (
                    <span className="font-medium">
                      ${pricing.subscription_price}/month subscription
                    </span>
                  )}
                  {pricing?.access_model === 'full_curriculum' && (
                    <span className="font-medium">
                      ${pricing.base_price} for full curriculum
                    </span>
                  )}
                  {!pricing && <span>Pricing not configured</span>}
                </p>
              </div>
              
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                <p className="text-sm">
                  <span className="font-medium">Immediate availability</span> upon publishing
                </p>
              </div>
              
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4 text-gray-500" />
                <p className="text-sm">
                  <span className="font-medium">Status: </span> 
                  {courseDetails.status === 'published' ? (
                    <span className="text-green-600 font-medium">Published</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Draft</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col space-y-2">
            {courseDetails.status === 'published' ? (
              <div className="flex items-center justify-center p-4 text-green-700 bg-green-50 rounded-md">
                <CheckCircle2 className="mr-2" size={20} />
                <p>This course is already published!</p>
              </div>
            ) : (
              <Button 
                size="lg"
                onClick={handlePublish} 
                disabled={!isReadyToPublish || publishing || loading}
                className="py-6"
              >
                {publishing || loading ? 'Publishing...' : 'Publish Course Now'}
              </Button>
            )}
            
            {!isReadyToPublish && courseDetails.status !== 'published' && (
              <p className="text-xs text-amber-600 text-center">
                Complete all requirements before publishing
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
