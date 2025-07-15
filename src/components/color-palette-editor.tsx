import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2, Palette, Save, Wand2, Eye, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useTenantTheme } from '@/context/tenant-theme-context'
import { useTenantThemeStore } from '@/stores/tenant-theme-store'
import { ColorPalette } from '@/types/tenant-theme-api'

export function ColorPaletteEditor() {
  const { tenantId } = useTenantTheme()
  const { 
    currentThemeConfig, 
    colorPalettes, 
    isLoading, 
    isSaving,
    updateColorPaletteAPI,
    generateColorPalette,
    loadColorPalettes
  } = useTenantThemeStore()

  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null)
  const [customColors, setCustomColors] = useState({
    light: { ...currentThemeConfig.theme.colors },
    dark: { ...currentThemeConfig.theme.darkMode.colors }
  })
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    if (colorPalettes.length === 0) {
      loadColorPalettes()
    }
  }, [colorPalettes, loadColorPalettes])

  const handleColorChange = (colorKey: string, value: string, mode: 'light' | 'dark') => {
    setCustomColors(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [colorKey]: value
      }
    }))
  }

  const handleApplyPalette = (palette: ColorPalette) => {
    setSelectedPalette(palette)
    setCustomColors({
      light: {
          ...palette.colors,
          card: '',
          cardForeground: '',
          popover: '',
          popoverForeground: '',
          muted: '',
          mutedForeground: '',
          border: '',
          input: '',
          ring: '',
          destructive: '',
          chart1: '',
          chart2: '',
          chart3: '',
          chart4: '',
          chart5: '',
          sidebar: '',
          sidebarForeground: '',
          sidebarPrimary: '',
          sidebarPrimaryForeground: '',
          sidebarAccent: '',
          sidebarAccentForeground: '',
          sidebarBorder: '',
          sidebarRing: ''
      },
      dark: {
          ...palette.darkModeColors,
          card: '',
          cardForeground: '',
          popover: '',
          popoverForeground: '',
          muted: '',
          mutedForeground: '',
          border: '',
          input: '',
          ring: '',
          destructive: '',
          chart1: '',
          chart2: '',
          chart3: '',
          chart4: '',
          chart5: '',
          sidebar: '',
          sidebarForeground: '',
          sidebarPrimary: '',
          sidebarPrimaryForeground: '',
          sidebarAccent: '',
          sidebarAccentForeground: '',
          sidebarBorder: '',
          sidebarRing: ''
      }
    })
    toast.success(`Applied ${palette.name} palette`)
  }

  const handleGeneratePalette = async () => {
    if (!primaryColor) {
      toast.error('Please select a primary color')
      return
    }

    try {
      const generatedPalette = await generateColorPalette(primaryColor)
      handleApplyPalette(generatedPalette)
      toast.success('Generated new color palette!')
    } catch (error) {
      toast.error('Failed to generate color palette')
    }
  }

  const handleSaveColors = async () => {
    if (!tenantId) {
      toast.error('No tenant selected')
      return
    }

    try {
      await updateColorPaletteAPI({
        tenantId,
        colors: customColors.light,
        darkModeColors: customColors.dark
      })
      toast.success('Color palette saved successfully!')
    } catch (error) {
      toast.error('Failed to save color palette')
    }
  }

  const handleResetColors = () => {
    setCustomColors({
      light: { ...currentThemeConfig.theme.colors },
      dark: { ...currentThemeConfig.theme.darkMode.colors }
    })
    setSelectedPalette(null)
    toast.info('Reset to original colors')
  }

  const colorKeys = [
    { key: 'primary', label: 'Primary', description: 'Main brand color' },
    { key: 'secondary', label: 'Secondary', description: 'Secondary accent' },
    { key: 'accent', label: 'Accent', description: 'Highlight color' },
    { key: 'background', label: 'Background', description: 'Main background' },
    { key: 'foreground', label: 'Foreground', description: 'Main text color' },
    { key: 'card', label: 'Card', description: 'Card background' },
    { key: 'border', label: 'Border', description: 'Border color' },
    { key: 'input', label: 'Input', description: 'Input background' },
    { key: 'ring', label: 'Ring', description: 'Focus ring color' },
    { key: 'destructive', label: 'Destructive', description: 'Error/danger color' },
    { key: 'muted', label: 'Muted', description: 'Muted background' },
    { key: 'mutedForeground', label: 'Muted Text', description: 'Muted text color' },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Palette Editor
          </CardTitle>
          <CardDescription>
            Customize colors for {currentThemeConfig.tenantName} theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            {/* Preset Palettes */}
            <TabsContent value="presets" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  <div className="col-span-full flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading palettes...</span>
                  </div>
                ) : (
                  colorPalettes.map((palette) => (
                    <Card 
                      key={palette.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedPalette?.id === palette.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleApplyPalette(palette)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{palette.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {palette.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-1 mb-2">
                          {Object.entries(palette.colors).slice(0, 6).map(([key, color]) => (
                            <div
                              key={key}
                              className="w-6 h-6 rounded-sm border"
                              style={{ backgroundColor: color }}
                              title={key}
                            />
                          ))}
                        </div>
                        <div 
                          className="h-8 rounded-md border"
                          style={{ background: palette.preview }}
                        />
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Generate Palette */}
            <TabsContent value="generate" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleGeneratePalette}
                  disabled={isLoading}
                  className="mt-6"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  Generate
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Generate a complete color palette from a single primary color. 
                  The AI will create harmonious colors for all theme elements.
                </p>
              </div>
            </TabsContent>

            {/* Custom Colors */}
            <TabsContent value="custom" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode('light')}
                  className={previewMode === 'light' ? 'bg-accent' : ''}
                >
                  Light Mode
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode('dark')}
                  className={previewMode === 'dark' ? 'bg-accent' : ''}
                >
                  Dark Mode
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {colorKeys.map(({ key, label, description }) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-sm font-medium">
                      {label}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={key}
                        type="color"
                        value={customColors[previewMode][key as keyof typeof customColors.light] || '#000000'}
                        onChange={(e) => handleColorChange(key, e.target.value, previewMode)}
                        className="w-16"
                      />
                      <Input
                        value={customColors[previewMode][key as keyof typeof customColors.light] || ''}
                        onChange={(e) => handleColorChange(key, e.target.value, previewMode)}
                        placeholder="oklch(0.5 0.1 180)"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Preview */}
            <TabsContent value="preview" className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                
                <div className="flex gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Preview Card</CardTitle>
                    <CardDescription>
                      This is how cards will look with the new colors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-muted-foreground">
                        Muted background with muted text
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t">
            <Button
              onClick={handleSaveColors}
              disabled={isSaving || !tenantId}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Colors
            </Button>
            
            <Button
              variant="outline"
              onClick={handleResetColors}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            
            <div className="ml-auto">
              {selectedPalette && (
                <Badge variant="secondary">
                  Using: {selectedPalette.name}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
