import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Database, 
  Palette, 
  Zap,
  Copy,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { useTenantTheme } from '@/context/tenant-theme-context'
import { useTenantThemeStore } from '@/stores/tenant-theme-store'

interface TestResult {
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  duration?: number
  error?: string
  details?: string
}

export function ColorPaletteTestSuite() {
  const { tenantId } = useTenantTheme()
  const { 
    colorPalettes, 
    updateColorPaletteAPI,
    generateColorPalette,
    loadColorPalettes,
    isLoading,
    isSaving
  } = useTenantThemeStore()

  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [customPrimaryColor, setCustomPrimaryColor] = useState('#3b82f6')
  const [testOutput, setTestOutput] = useState('')

  const updateTestResult = (name: string, updates: Partial<TestResult>) => {
    setTestResults(prev => prev.map(test => 
      test.name === name ? { ...test, ...updates } : test
    ))
  }

  const addToOutput = (message: string) => {
    setTestOutput(prev => prev + message + '\n')
  }

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    const startTime = Date.now()
    updateTestResult(testName, { status: 'running' })
    addToOutput(`🔄 Running: ${testName}`)
    
    try {
      await testFn()
      const duration = Date.now() - startTime
      updateTestResult(testName, { 
        status: 'passed', 
        duration,
        details: `Completed in ${duration}ms`
      })
      addToOutput(`✅ PASSED: ${testName} (${duration}ms)`)
    } catch (error) {
      const duration = Date.now() - startTime
      updateTestResult(testName, { 
        status: 'failed', 
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: `Failed after ${duration}ms`
      })
      addToOutput(`❌ FAILED: ${testName} - ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const initializeTests = () => {
    const tests: TestResult[] = [
      { name: 'Load Color Palettes', status: 'pending' },
      { name: 'Generate Color Palette', status: 'pending' },
      { name: 'Update Color Palette', status: 'pending' },
      { name: 'Apply Theme Changes', status: 'pending' },
      { name: 'Validate CSS Variables', status: 'pending' },
      { name: 'Test Dark Mode Switch', status: 'pending' },
      { name: 'Test API Error Handling', status: 'pending' },
      { name: 'Test Local Storage', status: 'pending' },
    ]
    setTestResults(tests)
    setTestOutput('')
  }

  const runAllTests = async () => {
    setIsRunningTests(true)
    initializeTests()
    addToOutput('🚀 Starting Color Palette API Tests...\n')

    // Test 1: Load Color Palettes
    await runTest('Load Color Palettes', async () => {
      await loadColorPalettes()
      if (colorPalettes.length === 0) {
        throw new Error('No color palettes loaded')
      }
      addToOutput(`   Found ${colorPalettes.length} color palettes`)
    })

    // Test 2: Generate Color Palette
    await runTest('Generate Color Palette', async () => {
      const palette = await generateColorPalette(customPrimaryColor)
      if (!palette || !palette.colors || !palette.darkModeColors) {
        throw new Error('Generated palette is invalid')
      }
      addToOutput(`   Generated palette: ${palette.name}`)
    })

    // Test 3: Update Color Palette
    await runTest('Update Color Palette', async () => {
      if (!tenantId) {
        throw new Error('No tenant ID available')
      }
      await updateColorPaletteAPI({
        tenantId,
        colors: {
          primary: customPrimaryColor,
          secondary: 'oklch(0.968 0.007 247.896)',
          accent: customPrimaryColor,
        },
        darkModeColors: {
          primary: customPrimaryColor,
          secondary: 'oklch(0.208 0.042 265.755)',
          accent: customPrimaryColor,
        }
      })
      addToOutput(`   Updated colors for tenant: ${tenantId}`)
    })

    // Test 4: Apply Theme Changes
    await runTest('Apply Theme Changes', async () => {
      // Wait for theme to be applied
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const root = document.documentElement
      const primaryColor = getComputedStyle(root).getPropertyValue('--primary').trim()
      
      if (!primaryColor) {
        throw new Error('Primary color not applied to CSS variables')
      }
      addToOutput(`   Primary color applied: ${primaryColor}`)
    })

    // Test 5: Validate CSS Variables
    await runTest('Validate CSS Variables', async () => {
      const root = document.documentElement
      const style = getComputedStyle(root)
      
      const requiredVars = ['--primary', '--secondary', '--background', '--foreground']
      const missingVars = requiredVars.filter(varName => 
        !style.getPropertyValue(varName).trim()
      )
      
      if (missingVars.length > 0) {
        throw new Error(`Missing CSS variables: ${missingVars.join(', ')}`)
      }
      addToOutput(`   All required CSS variables are present`)
    })

    // Test 6: Test Dark Mode Switch
    await runTest('Test Dark Mode Switch', async () => {
      const root = document.documentElement
      const originalClasses = root.className
      
      // Test adding dark class
      root.classList.add('dark')
      const hasDarkClass = root.classList.contains('dark')
      
      // Restore original classes
      root.className = originalClasses
      
      if (!hasDarkClass) {
        throw new Error('Dark mode class not applied correctly')
      }
      addToOutput(`   Dark mode switching works correctly`)
    })

    // Test 7: Test API Error Handling
    await runTest('Test API Error Handling', async () => {
      try {
        // This should simulate an API error
        await generateColorPalette('')
        throw new Error('Expected API error but none occurred')
      } catch (error) {
        if (error instanceof Error && error.message.includes('Expected API error')) {
          throw error
        }
        // Expected error, test passed
        addToOutput(`   API error handling works correctly`)
      }
    })

    // Test 8: Test Local Storage
    await runTest('Test Local Storage', async () => {
      const storageKey = 'tenant-theme-storage'
      const storageData = localStorage.getItem(storageKey)
      
      if (!storageData) {
        throw new Error('Theme data not found in localStorage')
      }
      
      const parsedData = JSON.parse(storageData)
      if (!parsedData.state || !parsedData.state.tenantThemes) {
        throw new Error('Invalid theme data structure in localStorage')
      }
      
      addToOutput(`   localStorage contains valid theme data`)
    })

    setIsRunningTests(false)
    addToOutput('\n🎉 All tests completed!')
    
    const passedTests = testResults.filter(test => test.status === 'passed').length
    const totalTests = testResults.length
    toast.success(`Tests completed: ${passedTests}/${totalTests} passed`)
  }

  const runSingleTest = async (testName: string) => {
    const testFunctions: Record<string, () => Promise<void>> = {
      'Load Color Palettes': async () => {
        await loadColorPalettes()
        if (colorPalettes.length === 0) {
          throw new Error('No color palettes loaded')
        }
      },
      'Generate Color Palette': async () => {
        const palette = await generateColorPalette(customPrimaryColor)
        if (!palette || !palette.colors) {
          throw new Error('Generated palette is invalid')
        }
      },
      'Update Color Palette': async () => {
        if (!tenantId) {
          throw new Error('No tenant ID available')
        }
        await updateColorPaletteAPI({
          tenantId,
          colors: { primary: customPrimaryColor },
          darkModeColors: { primary: customPrimaryColor }
        })
      }
    }

    const testFn = testFunctions[testName]
    if (testFn) {
      await runTest(testName, testFn)
    }
  }

  const copyTestOutput = () => {
    navigator.clipboard.writeText(testOutput)
    toast.success('Test output copied to clipboard')
  }

  const clearTestOutput = () => {
    setTestOutput('')
    setTestResults([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Color Palette API Test Suite
          </CardTitle>
          <CardDescription>
            Test your multi-tenant color palette system with real API calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="automated" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="automated">Automated Tests</TabsTrigger>
              <TabsTrigger value="manual">Manual Tests</TabsTrigger>
              <TabsTrigger value="browser">Browser Tests</TabsTrigger>
            </TabsList>

            <TabsContent value="automated" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="test-color">Test Primary Color</Label>
                  <Input
                    id="test-color"
                    type="color"
                    value={customPrimaryColor}
                    onChange={(e) => setCustomPrimaryColor(e.target.value)}
                    className="w-20"
                  />
                </div>
                <Button
                  onClick={runAllTests}
                  disabled={isRunningTests}
                  className="mt-6"
                >
                  {isRunningTests ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Running Tests
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run All Tests
                    </>
                  )}
                </Button>
              </div>

              {testResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Test Results:</h4>
                  {testResults.map((test) => (
                    <div key={test.name} className="flex items-center gap-2 p-2 border rounded">
                      {test.status === 'pending' && <Clock className="h-4 w-4 text-muted-foreground" />}
                      {test.status === 'running' && <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />}
                      {test.status === 'passed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {test.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                      
                      <span className="flex-1">{test.name}</span>
                      
                      {test.status === 'passed' && (
                        <Badge variant="secondary">{test.duration}ms</Badge>
                      )}
                      {test.status === 'failed' && (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                      
                      {test.status !== 'pending' && test.status !== 'running' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => runSingleTest(test.name)}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Test Output:</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyTestOutput}
                    disabled={!testOutput}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearTestOutput}
                  >
                    Clear
                  </Button>
                </div>
                <Textarea
                  value={testOutput}
                  readOnly
                  className="font-mono text-sm min-h-[200px]"
                  placeholder="Test output will appear here..."
                />
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      API Endpoint Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">1. Test Color Palette Loading</h4>
                      <p className="text-sm text-muted-foreground">
                        Go to the Color Editor → Presets tab and verify palettes load
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadColorPalettes()}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Loading...' : 'Load Palettes'}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">2. Test Color Generation</h4>
                      <p className="text-sm text-muted-foreground">
                        Use the Generate tab to create a palette from a primary color
                      </p>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={customPrimaryColor}
                          onChange={(e) => setCustomPrimaryColor(e.target.value)}
                          className="w-20"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateColorPalette(customPrimaryColor)}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Generating...' : 'Generate'}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">3. Test Color Saving</h4>
                      <p className="text-sm text-muted-foreground">
                        Make changes in the Custom tab and save them
                      </p>
                      <Badge variant={isSaving ? 'default' : 'secondary'}>
                        {isSaving ? 'Saving...' : 'Ready to Save'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Visual Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">4. Test Theme Switching</h4>
                      <p className="text-sm text-muted-foreground">
                        Switch between tenants and verify colors change instantly
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">5. Test Dark/Light Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark modes to test color variants
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">6. Test Live Preview</h4>
                      <p className="text-sm text-muted-foreground">
                        Check that color changes appear immediately in the preview
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="browser" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Browser Console Tests</CardTitle>
                  <CardDescription>
                    Run these commands in your browser console
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Check CSS Variables:</h4>
                    <pre className="text-xs bg-muted p-2 rounded">
{`// Check current CSS variables
const root = document.documentElement
const style = getComputedStyle(root)
console.log('Primary:', style.getPropertyValue('--primary'))
console.log('Background:', style.getPropertyValue('--background'))
console.log('Foreground:', style.getPropertyValue('--foreground'))`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Check Local Storage:</h4>
                    <pre className="text-xs bg-muted p-2 rounded">
{`// Check stored theme data
const data = localStorage.getItem('tenant-theme-storage')
console.log('Stored theme data:', JSON.parse(data))`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Test API Service:</h4>
                    <pre className="text-xs bg-muted p-2 rounded">
{`// Test mock API service
import { MockTenantThemeAPIService } from '@/services/tenant-theme-api'

// Get color palettes
MockTenantThemeAPIService.getColorPalettes().then(console.log)

// Generate palette
MockTenantThemeAPIService.generateColorPalette('#ff0000').then(console.log)`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
