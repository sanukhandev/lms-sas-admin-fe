import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useCourseBuilder } from '../context/CourseBuilderContext';
import { DollarSign, Calendar, Info, AlertCircle } from 'lucide-react';

interface CoursePricingProps {
  onComplete: () => void;
}

export function CoursePricing({ onComplete }: CoursePricingProps) {
  const { courseId, pricing, savePricing, loading } = useCourseBuilder();
  
  const [pricingModel, setPricingModel] = useState(pricing?.access_model || 'one_time');
  const [basePrice, setBasePrice] = useState(String(pricing?.base_price || ''));
  const [discountPercentage, setDiscountPercentage] = useState(String(pricing?.discount_percentage || '0'));
  const [subscriptionPrice, setSubscriptionPrice] = useState(String(pricing?.subscription_price || ''));
  const [trialDays, setTrialDays] = useState(String(pricing?.trial_period_days || '0'));
  const [isActive, setIsActive] = useState(pricing?.is_active || false);
  
  // Calculate discounted price
  const calculateDiscountedPrice = () => {
    if (!basePrice || isNaN(parseFloat(basePrice))) return 0;
    if (!discountPercentage || isNaN(parseFloat(discountPercentage))) return parseFloat(basePrice);
    
    const discount = parseFloat(discountPercentage) / 100;
    return parseFloat(basePrice) * (1 - discount);
  };
  
  const discountedPrice = calculateDiscountedPrice().toFixed(2);
  
  // Simulated currency conversion (for demo)
  const currencyConversion = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.78 },
  };
  
  // Handle pricing save
  const handleSavePricing = async () => {
    const pricingData = {
      access_model: pricingModel,
      base_price: parseFloat(basePrice) || 0,
      discount_percentage: parseFloat(discountPercentage) || 0,
      subscription_price: pricingModel === 'monthly_subscription' ? (parseFloat(subscriptionPrice) || 0) : null,
      trial_period_days: pricingModel === 'monthly_subscription' ? (parseInt(trialDays) || 0) : null,
      is_active: isActive
    };
    
    const success = await savePricing(pricingData);
    if (success) {
      onComplete();
    }
  };
  
  // Validate if required fields are filled
  const isValidPricing = () => {
    if (pricingModel === 'one_time' || pricingModel === 'full_curriculum') {
      return basePrice && !isNaN(parseFloat(basePrice));
    } else if (pricingModel === 'monthly_subscription') {
      return subscriptionPrice && !isNaN(parseFloat(subscriptionPrice));
    }
    return false;
  };
  
  if (!courseId) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold">Course Pricing</h2>
        <div className="flex items-center p-4 text-amber-800 bg-amber-50 rounded-md">
          <AlertCircle className="mr-2" size={20} />
          <p>Please complete the course details and structure first.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 bg-white p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold">Course Pricing</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left panel: Pricing options */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pricing Model</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={pricingModel} 
                onValueChange={setPricingModel}
                className="space-y-4"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="one_time" id="one_time" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="one_time" className="font-medium">One-time Purchase</Label>
                    <p className="text-sm text-gray-500">
                      Students pay once for permanent access to the course
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="monthly_subscription" id="subscription" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="subscription" className="font-medium">Monthly Subscription</Label>
                    <p className="text-sm text-gray-500">
                      Students pay a recurring monthly fee for access
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="full_curriculum" id="full_curriculum" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="full_curriculum" className="font-medium">Full Curriculum</Label>
                    <p className="text-sm text-gray-500">
                      Students pay once for access to this course and all related courses
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          {/* One-time or Full Curriculum Pricing */}
          {(pricingModel === 'one_time' || pricingModel === 'full_curriculum') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {pricingModel === 'one_time' ? 'One-time Purchase' : 'Full Curriculum'} Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="base-price">Base Price ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="base-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={basePrice}
                      onChange={e => setBasePrice(e.target.value)}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentage}
                    onChange={e => setDiscountPercentage(e.target.value)}
                    placeholder="0"
                  />
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Pricing Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pricing-active"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                      />
                      <Label htmlFor="pricing-active" className="text-sm cursor-pointer">
                        {isActive ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    When inactive, students cannot purchase the course, but existing students maintain access.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Subscription Pricing */}
          {pricingModel === 'monthly_subscription' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Subscription Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subscription-price">Monthly Price ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="subscription-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={subscriptionPrice}
                      onChange={e => setSubscriptionPrice(e.target.value)}
                      className="pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="trial-days">Free Trial Period (Days)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="trial-days"
                      type="number"
                      min="0"
                      value={trialDays}
                      onChange={e => setTrialDays(e.target.value)}
                      className="pl-8"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Set to 0 for no trial period
                  </p>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Subscription Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pricing-active"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                      />
                      <Label htmlFor="pricing-active" className="text-sm cursor-pointer">
                        {isActive ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    When inactive, new subscriptions are disabled, but existing subscribers maintain access.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right panel: Summary and currency conversions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">
                  {pricingModel === 'one_time' 
                    ? 'One-time Purchase' 
                    : pricingModel === 'monthly_subscription'
                      ? 'Monthly Subscription'
                      : 'Full Curriculum'}
                </p>
              </div>
              
              {(pricingModel === 'one_time' || pricingModel === 'full_curriculum') && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Base Price</p>
                    <p className="font-medium">
                      {basePrice ? `$${parseFloat(basePrice).toFixed(2)}` : '$0.00'}
                    </p>
                  </div>
                  
                  {parseFloat(discountPercentage) > 0 && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Discount</p>
                        <p className="font-medium">{discountPercentage}%</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Final Price</p>
                        <p className="font-medium text-green-600">
                          ${discountedPrice}
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
              
              {pricingModel === 'monthly_subscription' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Monthly Price</p>
                    <p className="font-medium">
                      {subscriptionPrice ? `$${parseFloat(subscriptionPrice).toFixed(2)}/month` : '$0.00/month'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Trial Period</p>
                    <p className="font-medium">
                      {parseInt(trialDays) > 0 
                        ? `${trialDays} days free` 
                        : 'No trial period'}
                    </p>
                  </div>
                </>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className={`font-medium ${isActive ? 'text-green-600' : 'text-amber-600'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">International Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 flex items-start">
                <Info className="mr-2 shrink-0 mt-0.5" size={16} />
                <p>
                  Automatic currency conversions based on current exchange rates.
                </p>
              </div>
              
              <Separator />
              
              {(pricingModel === 'one_time' || pricingModel === 'full_curriculum') ? (
                <div className="space-y-2">
                  {Object.entries(currencyConversion).map(([currency, { symbol, rate }]) => (
                    <div key={currency} className="flex justify-between">
                      <span>{currency}</span>
                      <span className="font-medium">
                        {symbol}{parseFloat(discountedPrice) > 0 
                          ? (parseFloat(discountedPrice) * rate).toFixed(2) 
                          : '0.00'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(currencyConversion).map(([currency, { symbol, rate }]) => (
                    <div key={currency} className="flex justify-between">
                      <span>{currency}</span>
                      <span className="font-medium">
                        {symbol}{subscriptionPrice 
                          ? (parseFloat(subscriptionPrice) * rate).toFixed(2) 
                          : '0.00'}/month
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => onComplete()}>
              Skip
            </Button>
            <Button 
              onClick={handleSavePricing} 
              disabled={!isValidPricing() || loading}
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
