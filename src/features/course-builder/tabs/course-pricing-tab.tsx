import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesService } from '@/services/courses'
import { toast } from 'sonner'
import { Save, DollarSign, CreditCard, Calendar, Percent, Loader2 } from 'lucide-react'

interface CoursePricingTabProps {
  courseId: string
}

export function CoursePricingTab({ courseId }: CoursePricingTabProps) {
  const queryClient = useQueryClient()

  // Fetch pricing data from API
  const { data: apiPricingData, isLoading, error } = useQuery({
    queryKey: ['course-builder', 'pricing', courseId],
    queryFn: () => coursesService.getCoursePricing(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch supported access models
  const { data: supportedModelsResponse } = useQuery({
    queryKey: ['course-builder', 'access-models'],
    queryFn: () => coursesService.getSupportedAccessModels(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
  
  const supportedModels = supportedModelsResponse?.data || []

  const [pricingData, setPricingData] = useState({
    accessModel: 'one_time',
    basePrice: 99.99,
    discountPercentage: 0,
    subscriptionPrice: 19.99,
    trialPeriodDays: 7,
    currency: 'USD',
    isActive: true,
  })

  // Update local state when API data is loaded
  useEffect(() => {
    if (apiPricingData?.data) {
      setPricingData({
        accessModel: apiPricingData.data.access_model,
        basePrice: apiPricingData.data.base_price,
        discountPercentage: apiPricingData.data.discount_percentage,
        subscriptionPrice: apiPricingData.data.subscription_price || 19.99,
        trialPeriodDays: apiPricingData.data.trial_period_days || 7,
        currency: apiPricingData.data.base_currency,
        isActive: apiPricingData.data.is_active,
      })
    }
  }, [apiPricingData])

  // Mutation for updating pricing
  const updatePricingMutation = useMutation({
    mutationFn: (data: any) => coursesService.updateCoursePricing(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-builder', 'pricing', courseId] })
      toast.success('Pricing updated successfully')
    },
    onError: () => {
      toast.error('Failed to update pricing')
    }
  })

  const handleSave = async () => {
    const updateData = {
      access_model: pricingData.accessModel,
      base_price: pricingData.basePrice,
      discount_percentage: pricingData.discountPercentage,
      subscription_price: pricingData.subscriptionPrice,
      trial_period_days: pricingData.trialPeriodDays,
      is_active: pricingData.isActive,
    }
    
    updatePricingMutation.mutate(updateData)
  }

  const getDiscountedPrice = () => {
    if (pricingData.discountPercentage > 0) {
      return pricingData.basePrice * (1 - pricingData.discountPercentage / 100)
    }
    return pricingData.basePrice
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-medium">Loading Pricing Data</h3>
          <p className="text-muted-foreground">Please wait while we fetch the pricing information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <DollarSign className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium">Error Loading Pricing</h3>
          <p className="text-muted-foreground">Failed to load pricing data. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Access Model</CardTitle>
          <CardDescription>
            Choose how students can access this course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {supportedModels.includes('one_time') && (
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  pricingData.accessModel === 'one_time' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPricingData({...pricingData, accessModel: 'one_time'})}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium">One-Time Purchase</h3>
                    <p className="text-sm text-gray-500">Students buy the course once and own it forever</p>
                  </div>
                  <Badge variant={pricingData.accessModel === 'one_time' ? 'default' : 'secondary'}>
                    Most Popular
                  </Badge>
                </div>
              </div>
            )}

            {supportedModels.includes('monthly_subscription') && (
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  pricingData.accessModel === 'monthly_subscription' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPricingData({...pricingData, accessModel: 'monthly_subscription'})}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium">Monthly Subscription</h3>
                    <p className="text-sm text-gray-500">Students pay monthly to access the course</p>
                  </div>
                  <Badge variant={pricingData.accessModel === 'monthly_subscription' ? 'default' : 'secondary'}>
                    Recurring
                  </Badge>
                </div>
              </div>
            )}

            {supportedModels.includes('full_curriculum') && (
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  pricingData.accessModel === 'full_curriculum' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPricingData({...pricingData, accessModel: 'full_curriculum'})}
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium">Full Curriculum Access</h3>
                    <p className="text-sm text-gray-500">Part of the complete curriculum package</p>
                  </div>
                  <Badge variant={pricingData.accessModel === 'full_curriculum' ? 'default' : 'secondary'}>
                    Premium
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {pricingData.accessModel === 'one_time' && (
        <Card>
          <CardHeader>
            <CardTitle>One-Time Purchase Pricing</CardTitle>
            <CardDescription>
              Set the price for lifetime access to this course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base-price">Base Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="base-price"
                    type="number"
                    value={pricingData.basePrice}
                    onChange={(e) => setPricingData({...pricingData, basePrice: parseFloat(e.target.value) || 0})}
                    className="pl-10"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={pricingData.currency} onValueChange={(value) => setPricingData({...pricingData, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount Percentage</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="discount"
                  type="number"
                  value={pricingData.discountPercentage}
                  onChange={(e) => setPricingData({...pricingData, discountPercentage: parseFloat(e.target.value) || 0})}
                  className="pl-10"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {pricingData.discountPercentage > 0 && (
              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Price Preview</p>
                    <p className="text-xs text-green-600">Students will see the discounted price</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm line-through text-gray-500">
                      ${pricingData.basePrice.toFixed(2)}
                    </p>
                    <p className="text-lg font-bold text-green-700">
                      ${getDiscountedPrice().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {pricingData.accessModel === 'monthly_subscription' && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription Pricing</CardTitle>
            <CardDescription>
              Set monthly subscription price and trial period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subscription-price">Monthly Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="subscription-price"
                    type="number"
                    value={pricingData.subscriptionPrice}
                    onChange={(e) => setPricingData({...pricingData, subscriptionPrice: parseFloat(e.target.value) || 0})}
                    className="pl-10"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trial-period">Free Trial (Days)</Label>
                <Input
                  id="trial-period"
                  type="number"
                  value={pricingData.trialPeriodDays}
                  onChange={(e) => setPricingData({...pricingData, trialPeriodDays: parseInt(e.target.value) || 0})}
                  min="0"
                  max="365"
                />
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Subscription Preview</p>
                  <p className="text-xs text-blue-600">
                    {pricingData.trialPeriodDays > 0 
                      ? `${pricingData.trialPeriodDays} days free, then ` 
                      : ''
                    }
                    ${pricingData.subscriptionPrice}/month
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {pricingData.accessModel === 'full_curriculum' && (
        <Card>
          <CardHeader>
            <CardTitle>Curriculum Access</CardTitle>
            <CardDescription>
              This course is included in the full curriculum package
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-purple-50 p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">
                    Full Curriculum Access
                  </p>
                  <p className="text-xs text-purple-600">
                    Students with curriculum access can view this course at no additional cost
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pricing Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="pricing-active"
              checked={pricingData.isActive}
              onCheckedChange={(checked) => setPricingData({...pricingData, isActive: checked})}
            />
            <Label htmlFor="pricing-active">Pricing is active</Label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            When disabled, the course will be free for all students
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Pricing'}
        </Button>
      </div>
    </div>
  )
}
