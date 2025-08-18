"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Play,
  Pause,
  Download,
  Loader2,
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  Volume2,
  Music,
  Briefcase,
  Coffee,
  Moon,
  Car,
  Handshake,
  Trophy,
  Brain,
  Rocket,
  Crown,
  Shield,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  VolumeX,
  Share2,
  Heart,
  RotateCcw,
  Lightbulb,
  Clock,
  Star,
  Sparkles,
} from "lucide-react"

interface WealthScenario {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  prompt: string
  color: string
  category: string
}

interface GeneratedTrack {
  id: string
  url: string
  title: string
  scenario?: WealthScenario
  customPrompt?: string
  duration: number
  createdAt: Date
}

const wealthScenarios: WealthScenario[] = [
  // Morning & Energy
  {
    id: "morning-motivation",
    title: "Morning Wealth Mindset",
    description: "Start your day with abundance energy",
    icon: <TrendingUp className="w-5 h-5" />,
    prompt:
      "Create an uplifting, energetic track with inspiring melodies and driving rhythms. Include motivational elements that evoke success, abundance, and morning energy. Tempo 120-130 BPM with uplifting chord progressions and triumphant brass sections.",
    color: "bg-orange-500",
    category: "morning",
  },
  {
    id: "power-breakfast",
    title: "Power Breakfast",
    description: "Fuel your success while you fuel your body",
    icon: <Coffee className="w-5 h-5" />,
    prompt:
      "Generate sophisticated, energizing music perfect for a power breakfast. Include elegant jazz elements mixed with modern beats, creating an atmosphere of success and refinement. Tempo 100-115 BPM with smooth saxophone and piano.",
    color: "bg-amber-500",
    category: "morning",
  },
  {
    id: "workout-wealth",
    title: "Wealth Workout",
    description: "Build your body and wealth mindset simultaneously",
    icon: <Zap className="w-5 h-5" />,
    prompt:
      "Create high-energy workout music that incorporates themes of strength, power, and financial success. Include driving electronic beats, motivational builds, and triumphant drops. Tempo 130-150 BPM with aggressive synths and powerful percussion.",
    color: "bg-red-500",
    category: "morning",
  },

  // Work & Focus
  {
    id: "focus-work",
    title: "Deep Work Focus",
    description: "Concentration music for wealth-building tasks",
    icon: <Target className="w-5 h-5" />,
    prompt:
      "Generate focused, ambient electronic music with subtle rhythmic elements. Create a productive atmosphere with minimal distractions, incorporating gentle synth pads and soft percussion. Tempo 90-100 BPM for sustained concentration and mental clarity.",
    color: "bg-blue-500",
    category: "work",
  },
  {
    id: "ceo-mode",
    title: "CEO Mode",
    description: "Executive-level decision making music",
    icon: <Crown className="w-5 h-5" />,
    prompt:
      "Create sophisticated, commanding music that evokes executive presence and strategic thinking. Include orchestral elements with modern production, building confidence and authority. Tempo 95-110 BPM with rich strings, brass, and subtle electronic elements.",
    color: "bg-indigo-600",
    category: "work",
  },
  {
    id: "creative-wealth",
    title: "Creative Wealth Flow",
    description: "Inspire innovative money-making ideas",
    icon: <Brain className="w-5 h-5" />,
    prompt:
      "Generate flowing, creative music that stimulates innovation and out-of-the-box thinking about wealth creation. Include ethereal pads, gentle arpeggios, and inspiring melodies. Tempo 85-100 BPM with ambient textures and uplifting progressions.",
    color: "bg-cyan-500",
    category: "work",
  },

  // Meetings & Deals
  {
    id: "deal-closing",
    title: "Deal Closing Power",
    description: "Confidence boost before big meetings",
    icon: <DollarSign className="w-5 h-5" />,
    prompt:
      "Create a powerful, confident track with strong bass lines and assertive rhythms. Include elements that evoke success, power, and determination. Tempo 110-120 BPM with bold instrumentation and commanding presence.",
    color: "bg-emerald-500",
    category: "meetings",
  },
  {
    id: "negotiation-master",
    title: "Negotiation Master",
    description: "Strategic mindset for winning deals",
    icon: <Handshake className="w-5 h-5" />,
    prompt:
      "Generate strategic, calculated music that builds confidence for negotiations. Include subtle tension and resolution, creating an atmosphere of controlled power and tactical thinking. Tempo 100-115 BPM with layered instrumentation and dynamic builds.",
    color: "bg-teal-600",
    category: "meetings",
  },
  {
    id: "presentation-power",
    title: "Presentation Power",
    description: "Command the room with confidence",
    icon: <Briefcase className="w-5 h-5" />,
    prompt:
      "Create authoritative, inspiring music perfect for preparing presentations. Include triumphant melodies, confident rhythms, and elements that evoke leadership and success. Tempo 115-125 BPM with orchestral and modern elements.",
    color: "bg-slate-600",
    category: "meetings",
  },

  // Travel & Commute
  {
    id: "drive-time",
    title: "Wealth Drive",
    description: "Motivational music for your commute",
    icon: <Car className="w-5 h-5" />,
    prompt:
      "Generate high-energy, motivational music perfect for driving. Include driving beats, inspiring melodies, and elements that evoke ambition and success. Tempo 125-140 BPM with dynamic builds and energetic drops.",
    color: "bg-purple-500",
    category: "travel",
  },
  {
    id: "flight-success",
    title: "First Class Mindset",
    description: "Luxury travel success vibes",
    icon: <Rocket className="w-5 h-5" />,
    prompt:
      "Create sophisticated, luxurious music that evokes first-class travel and high-end success. Include smooth jazz elements, elegant orchestration, and refined electronic touches. Tempo 90-105 BPM with rich harmonies and polished production.",
    color: "bg-violet-600",
    category: "travel",
  },

  // Evening & Rest
  {
    id: "wealth-reflection",
    title: "Wealth Reflection",
    description: "Evening gratitude and planning",
    icon: <Moon className="w-5 h-5" />,
    prompt:
      "Generate calming, reflective music perfect for evening wealth planning and gratitude practice. Include gentle piano, soft strings, and ambient textures that promote clarity and positive thinking. Tempo 70-85 BPM with peaceful, uplifting melodies.",
    color: "bg-blue-800",
    category: "evening",
  },
  {
    id: "success-sleep",
    title: "Success Sleep Programming",
    description: "Subconscious wealth programming for sleep",
    icon: <Shield className="w-5 h-5" />,
    prompt:
      "Create deeply relaxing, ambient music designed for sleep with subtle wealth affirmation undertones. Include soft drones, gentle nature sounds, and barely perceptible success-themed musical motifs. Tempo 60-70 BPM with calming, meditative qualities.",
    color: "bg-indigo-900",
    category: "evening",
  },

  // Achievement & Celebration
  {
    id: "victory-celebration",
    title: "Victory Celebration",
    description: "Celebrate your financial wins",
    icon: <Trophy className="w-5 h-5" />,
    prompt:
      "Generate triumphant, celebratory music perfect for acknowledging financial achievements. Include fanfares, uplifting orchestration, and elements that evoke victory and accomplishment. Tempo 120-135 BPM with grand, inspiring arrangements.",
    color: "bg-yellow-500",
    category: "achievement",
  },
]

const categoryLabels = {
  morning: "Morning & Energy",
  work: "Work & Focus",
  meetings: "Meetings & Deals",
  travel: "Travel & Commute",
  evening: "Evening & Rest",
  achievement: "Achievement & Celebration",
}

const musicStyles = [
  { value: "electronic", label: "Electronic" },
  { value: "orchestral", label: "Orchestral" },
  { value: "ambient", label: "Ambient" },
  { value: "rock", label: "Rock" },
  { value: "jazz", label: "Jazz" },
  { value: "cinematic", label: "Cinematic" },
]

const tempoRanges = [
  { value: "slow", label: "Slow (60-90 BPM)", range: "60-90" },
  { value: "medium", label: "Medium (90-120 BPM)", range: "90-120" },
  { value: "fast", label: "Fast (120-150 BPM)", range: "120-150" },
  { value: "very-fast", label: "Very Fast (150+ BPM)", range: "150+" },
]

export function WealthMusicGenerator() {
  const [selectedScenario, setSelectedScenario] = useState<WealthScenario | null>(null)
  const [customPrompt, setCustomPrompt] = useState("")
  const [duration, setDuration] = useState([30])
  const [selectedStyle, setSelectedStyle] = useState("")
  const [selectedTempo, setSelectedTempo] = useState("")
  const [volume, setVolume] = useState([80])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [generatedTrack, setGeneratedTrack] = useState<string | null>(null)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [activeCategory, setActiveCategory] = useState("morning")

  const [playlist, setPlaylist] = useState<GeneratedTrack[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [previousVolume, setPreviousVolume] = useState(80)
  const [playbackRate, setPlaybackRate] = useState([1])
  const [isFavorited, setIsFavorited] = useState(false)
  const [showVisualizer, setShowVisualizer] = useState(true)
  const [showQuickStart, setShowQuickStart] = useState(true)
  const [recentGenerations, setRecentGenerations] = useState<GeneratedTrack[]>([])

  const quickStartScenarios = [
    wealthScenarios.find((s) => s.id === "morning-motivation"),
    wealthScenarios.find((s) => s.id === "focus-work"),
    wealthScenarios.find((s) => s.id === "deal-closing"),
    wealthScenarios.find((s) => s.id === "victory-celebration"),
  ].filter(Boolean) as WealthScenario[]

  const successTips = [
    "Listen to your wealth music for 10-15 minutes before important meetings to boost confidence",
    "Create a morning playlist with energizing tracks to start your day with abundance mindset",
    "Use focus music during deep work sessions to maintain concentration on wealth-building tasks",
    "Play celebration music after achieving financial milestones to reinforce positive associations",
    "Combine different scenarios throughout your day for a complete success soundtrack experience",
  ]

  const generateMusic = async () => {
    if (!selectedScenario && !customPrompt.trim()) return

    setIsGenerating(true)
    setGenerationProgress(0)
    setShowQuickStart(false)

    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => Math.min(prev + 10, 90))
    }, 500)

    try {
      let prompt = customPrompt.trim() || selectedScenario?.prompt || ""

      if (selectedStyle) {
        prompt += ` Style: ${selectedStyle}.`
      }
      if (selectedTempo) {
        const tempoInfo = tempoRanges.find((t) => t.value === selectedTempo)
        prompt += ` Tempo: ${tempoInfo?.range} BPM.`
      }

      const response = await fetch("/api/generate-music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          duration: duration[0] * 1000,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.error === "paid_plan_required") {
          // Show premium upgrade notice
          alert(`🎵 Premium Feature Required\n\n${errorData.message}\n\nUpgrade at: https://elevenlabs.io/pricing`)
          return
        }
        throw new Error(errorData.message || "Failed to generate music")
      }

      const blob = await response.blob()
      const audioUrl = URL.createObjectURL(blob)

      const newTrack: GeneratedTrack = {
        id: Date.now().toString(),
        url: audioUrl,
        title: selectedScenario?.title || "Custom Wealth Music",
        scenario: selectedScenario || undefined,
        customPrompt: customPrompt.trim() || undefined,
        duration: duration[0],
        createdAt: new Date(),
      }

      setPlaylist((prev) => [...prev, newTrack])
      setRecentGenerations((prev) => [newTrack, ...prev.slice(0, 4)])
      setCurrentTrackIndex(playlist.length - 1)
      setGeneratedTrack(audioUrl)
      setGenerationProgress(100)
    } catch (error) {
      console.error("Error generating music:", error)
      alert(
        "❌ Generation Failed\n\nThere was an issue generating your music. Please try again or check your API configuration.",
      )
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
      setTimeout(() => setGenerationProgress(0), 1000)
    }
  }

  const togglePlayback = () => {
    if (!generatedTrack) return

    if (isPlaying && currentAudio) {
      currentAudio.pause()
      setIsPlaying(false)
    } else {
      if (currentAudio) {
        currentAudio.pause()
      }
      const audio = new Audio(generatedTrack)
      audio.volume = isMuted ? 0 : volume[0] / 100
      audio.playbackRate = playbackRate[0]
      audio.loop = isLooping
      audio.play()
      setCurrentAudio(audio)
      audioRef.current = audio
      setIsPlaying(true)

      audio.onloadedmetadata = () => {
        setTotalDuration(audio.duration)
      }

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime)
      }

      audio.onended = () => {
        setIsPlaying(false)
        setCurrentTime(0)

        if (!isLooping) {
          if (isShuffling) {
            playRandomTrack()
          } else {
            playNextTrack()
          }
        }
      }
    }
  }

  const playNextTrack = () => {
    if (playlist.length === 0) return
    const nextIndex = (currentTrackIndex + 1) % playlist.length
    setCurrentTrackIndex(nextIndex)
    setGeneratedTrack(playlist[nextIndex].url)
    if (isPlaying) {
      setTimeout(togglePlayback, 100)
    }
  }

  const playPreviousTrack = () => {
    if (playlist.length === 0) return
    const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1
    setCurrentTrackIndex(prevIndex)
    setGeneratedTrack(playlist[prevIndex].url)
    if (isPlaying) {
      setTimeout(togglePlayback, 100)
    }
  }

  const playRandomTrack = () => {
    if (playlist.length <= 1) return
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * playlist.length)
    } while (randomIndex === currentTrackIndex)
    setCurrentTrackIndex(randomIndex)
    setGeneratedTrack(playlist[randomIndex].url)
    if (isPlaying) {
      setTimeout(togglePlayback, 100)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume([previousVolume])
      setIsMuted(false)
      if (currentAudio) currentAudio.volume = previousVolume / 100
    } else {
      setPreviousVolume(volume[0])
      setVolume([0])
      setIsMuted(true)
      if (currentAudio) currentAudio.volume = 0
    }
  }

  const restartTrack = () => {
    if (currentAudio) {
      currentAudio.currentTime = 0
      setCurrentTime(0)
    }
  }

  const shareTrack = async () => {
    if (!generatedTrack) return
    try {
      await navigator.share({
        title: "My Wealth Music",
        text: "Check out this AI-generated wealth mindset music!",
        url: window.location.href,
      })
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  useEffect(() => {
    if (currentAudio) {
      currentAudio.volume = isMuted ? 0 : volume[0] / 100
      currentAudio.playbackRate = playbackRate[0]
    }
  }, [volume, currentAudio, isMuted, playbackRate])

  const seekTo = (percentage: number) => {
    if (currentAudio && totalDuration) {
      const newTime = (percentage / 100) * totalDuration
      currentAudio.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const downloadTrack = () => {
    if (!generatedTrack) return

    const a = document.createElement("a")
    a.href = generatedTrack
    a.download = `wealth-music-${Date.now()}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Wealth Music Generator
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create AI-powered music that puts you in the perfect mindset for building wealth, closing deals, and achieving
          financial success.
        </p>

        <div className="flex justify-center gap-6 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{playlist.length}</div>
            <div className="text-sm text-muted-foreground">Tracks Generated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(playlist.reduce((acc, track) => acc + track.duration, 0) / 60)}
            </div>
            <div className="text-sm text-muted-foreground">Minutes of Success</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(playlist.map((t) => t.scenario?.category)).size}
            </div>
            <div className="text-sm text-muted-foreground">Categories Explored</div>
          </div>
        </div>
      </div>

      {showQuickStart && playlist.length === 0 && (
        <Card className="mb-8 border-emerald-200 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              Quick Start: Popular Success Scenarios
            </CardTitle>
            <CardDescription>Get started instantly with these proven wealth mindset boosters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStartScenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-emerald-200"
                  onClick={() => {
                    setSelectedScenario(scenario)
                    setActiveCategory(scenario.category)
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 rounded-full ${scenario.color} text-white flex items-center justify-center mx-auto mb-3`}
                    >
                      {scenario.icon}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{scenario.title}</h3>
                    <p className="text-xs text-muted-foreground">{scenario.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Success Scenarios
              </CardTitle>
              <CardDescription>Choose from comprehensive wealth-building scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      {label.split(" ")[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(categoryLabels).map(([category, label]) => (
                  <TabsContent key={category} value={category} className="space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{label}</h3>
                      <Badge variant="outline" className="text-xs">
                        {wealthScenarios.filter((s) => s.category === category).length} scenarios
                      </Badge>
                    </div>
                    {wealthScenarios
                      .filter((scenario) => scenario.category === category)
                      .map((scenario) => (
                        <Card
                          key={scenario.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedScenario?.id === scenario.id
                              ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedScenario(scenario)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${scenario.color} text-white flex-shrink-0`}>
                                {scenario.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold truncate">{scenario.title}</h3>
                                  {recentGenerations.some((track) => track.scenario?.id === scenario.id) && (
                                    <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{scenario.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Wealth Music</CardTitle>
              <CardDescription>Describe your ideal success soundtrack</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe the music that will put you in the perfect wealth-building mindset..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[100px]"
              />

              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Pro Tip:</strong> {successTips[Math.floor(Math.random() * successTips.length)]}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {recentGenerations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Recent Generations
                </CardTitle>
                <CardDescription>Your latest wealth music creations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentGenerations.slice(0, 3).map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        const trackIndex = playlist.findIndex((p) => p.id === track.id)
                        if (trackIndex !== -1) {
                          setCurrentTrackIndex(trackIndex)
                          setGeneratedTrack(track.url)
                        }
                      }}
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${track.scenario?.color || "bg-gray-500"} text-white flex items-center justify-center text-xs`}
                      >
                        {track.scenario?.icon || <Music className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{track.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {track.createdAt.toLocaleDateString()} • {track.duration}s
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Music Settings</CardTitle>
              <CardDescription>Customize your wealth soundtrack</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Duration: {duration[0]} seconds</label>
                <Slider value={duration} onValueChange={setDuration} max={300} min={10} step={5} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Quick (10s)</span>
                  <span>Standard (30s)</span>
                  <span>Extended (5min)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Music Style</label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {musicStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tempo</label>
                  <Select value={selectedTempo} onValueChange={setSelectedTempo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tempo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tempoRanges.map((tempo) => (
                        <SelectItem key={tempo.value} value={tempo.value}>
                          {tempo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Generating your wealth music...</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                  <div className="text-center text-xs text-muted-foreground">
                    Creating the perfect soundtrack for your success mindset
                  </div>
                </div>
              )}

              <Button
                onClick={generateMusic}
                disabled={isGenerating || (!selectedScenario && !customPrompt.trim())}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Your Wealth Music...
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4 mr-2" />
                    Generate Wealth Music
                  </>
                )}
              </Button>

              {selectedScenario && (
                <div className="text-center text-sm text-muted-foreground">
                  Ready to generate: <span className="font-medium text-foreground">{selectedScenario.title}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {generatedTrack && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Wealth Soundtrack</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={isFavorited ? "text-red-500" : ""}
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={shareTrack}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {playlist[currentTrackIndex]?.title || "Ready to boost your success mindset"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {showVisualizer && (
                  <div className="h-24 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <div className="flex items-end gap-1 h-16">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-t from-emerald-500 to-blue-500 rounded-sm animate-pulse"
                          style={{
                            width: "3px",
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <div
                      className="flex-1 h-3 bg-muted rounded-full cursor-pointer relative group"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const percentage = ((e.clientX - rect.left) / rect.width) * 100
                        seekTo(percentage)
                      }}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all"
                        style={{ width: `${totalDuration ? (currentTime / totalDuration) * 100 : 0}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          left: `${totalDuration ? (currentTime / totalDuration) * 100 : 0}%`,
                          transform: "translateX(-50%) translateY(-50%)",
                        }}
                      />
                    </div>
                    <span>{formatTime(totalDuration)}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsShuffling(!isShuffling)}
                      className={isShuffling ? "text-emerald-500" : ""}
                    >
                      <Shuffle className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={playPreviousTrack} disabled={playlist.length <= 1}>
                      <SkipBack className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={restartTrack}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={togglePlayback}
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>

                    <Button variant="ghost" size="sm" onClick={playNextTrack} disabled={playlist.length <= 1}>
                      <SkipForward className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsLooping(!isLooping)}
                      className={isLooping ? "text-emerald-500" : ""}
                    >
                      <Repeat className="w-4 h-4" />
                    </Button>

                    <Button onClick={downloadTrack} variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <Slider
                        value={volume}
                        onValueChange={(value) => {
                          setVolume(value)
                          if (value[0] > 0) setIsMuted(false)
                        }}
                        max={100}
                        min={0}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-8">{volume[0]}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-12">Speed:</span>
                      <Slider
                        value={playbackRate}
                        onValueChange={setPlaybackRate}
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-8">{playbackRate[0]}x</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch checked={showVisualizer} onCheckedChange={setShowVisualizer} />
                        <span className="text-sm">Visualizer</span>
                      </div>

                      {playlist.length > 1 && (
                        <Badge variant="secondary" className="text-xs">
                          Track {currentTrackIndex + 1} of {playlist.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                  >
                    Ready for Success
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
