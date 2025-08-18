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
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

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

  // Set random tip only on client side to avoid hydration mismatch
  useEffect(() => {
    setCurrentTipIndex(Math.floor(Math.random() * successTips.length))
  }, [])

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Brutalist geometric background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/5 rotate-45 translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rotate-12 translate-x-48 translate-y-48" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 border-8 border-white/5" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 border-4 border-yellow-500/10 rotate-45" />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-[-0.08em] text-yellow-500 mb-2 uppercase text-stroke">
            WEALTH MUSIC
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-emerald-500 mb-6 tracking-[0.3em] uppercase">
            GENERATOR
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-white/60 max-w-2xl mx-auto font-black uppercase tracking-wider">
            Create AI-powered music that puts you in the perfect mindset for building wealth, closing deals, and
            achieving financial success.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mt-12">
            <div className="text-center p-6 bg-black border-4 border-yellow-500 rounded-none shadow-[6px_6px_0_0_rgba(234,179,8,0.5)]">
              <div className="text-4xl md:text-5xl font-black text-yellow-500 font-mono">{playlist.length}</div>
              <div className="text-xs md:text-sm text-white uppercase tracking-[0.2em] font-black mt-2">Tracks Generated</div>
            </div>
            <div className="text-center p-6 bg-black border-4 border-emerald-500 rounded-none shadow-[6px_6px_0_0_rgba(16,185,129,0.5)]">
              <div className="text-4xl md:text-5xl font-black text-emerald-500 font-mono">
                {Math.round(playlist.reduce((acc, track) => acc + track.duration, 0) / 60)}
              </div>
              <div className="text-xs md:text-sm text-white uppercase tracking-[0.2em] font-black mt-2">Minutes of Success</div>
            </div>
            <div className="text-center p-6 bg-black border-4 border-yellow-500 rounded-none shadow-[6px_6px_0_0_rgba(234,179,8,0.5)]">
              <div className="text-4xl md:text-5xl font-black text-yellow-500 font-mono">
                {new Set(playlist.map((t) => t.scenario?.category)).size}
              </div>
              <div className="text-xs md:text-sm text-white uppercase tracking-[0.2em] font-black mt-2">Categories Explored</div>
            </div>
          </div>
        </div>

        {showQuickStart && playlist.length === 0 && (
          <Card className="mb-8 bg-black border-8 border-white/10 shadow-none rounded-none">
            <CardHeader className="border-b-8 border-yellow-500 bg-gradient-to-r from-black via-gray-900 to-black p-8">
              <CardTitle className="flex flex-col md:flex-row items-center gap-3 md:gap-4 text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-[-0.08em]">
                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-yellow-500 flex items-center justify-center shadow-[6px_6px_0_0_rgba(0,0,0,1)] rotate-3">
                  <Sparkles className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-black" />
                </div>
                <span className="text-center md:text-left">QUICK <span className="text-yellow-500">START</span></span>
              </CardTitle>
              <CardDescription className="text-white/60 text-sm font-black uppercase tracking-[0.2em] mt-2">
                INSTANT WEALTH FREQUENCY ACTIVATION
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStartScenarios.map((scenario) => (
                  <Card
                    key={scenario.id}
                    className="cursor-pointer transition-all duration-100 hover:translate-y-[-4px] bg-black border-4 border-white/20 hover:border-yellow-500 rounded-none group relative overflow-hidden"
                    onClick={() => {
                      setSelectedScenario(scenario)
                      setActiveCategory(scenario.category)
                    }}
                  >
                    <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                    <CardContent className="p-6 text-center relative z-10">
                      <div className="w-20 h-20 bg-white text-black flex items-center justify-center mx-auto mb-4 shadow-[6px_6px_0_0_rgba(234,179,8,1)] group-hover:shadow-[3px_3px_0_0_rgba(234,179,8,1)] transition-all duration-100">
                        {scenario.icon}
                      </div>
                      <h3 className="font-black text-white text-xl mb-2 uppercase tracking-tight">{scenario.title}</h3>
                      <p className="text-xs text-white/60 uppercase tracking-wider font-bold">{scenario.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="bg-black border-8 border-white/10 shadow-none rounded-none">
              <CardHeader className="border-b-8 border-yellow-500 bg-gradient-to-r from-black via-gray-900 to-black p-8">
                <CardTitle className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-[-0.05em]">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-black" />
                  </div>
                  <span className="text-center md:text-left">SUCCESS SCENARIOS</span>
                </CardTitle>
                <CardDescription className="text-white/60 text-sm font-black uppercase tracking-[0.15em] mt-2">
                  CHOOSE YOUR WEALTH-BUILDING PROTOCOL
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8 bg-black border-4 border-white/20 p-0 rounded-none">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-none data-[state=active]:bg-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.5)] rounded-none border-r-2 border-black last:border-r-0 py-4"
                      >
                        {label.split(" ")[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(categoryLabels).map(([category, label]) => (
                    <TabsContent key={category} value={category} className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-2xl text-white font-serif">{label}</h3>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-mono">
                          {wealthScenarios.filter((s) => s.category === category).length} scenarios
                        </Badge>
                      </div>
                      {wealthScenarios
                        .filter((scenario) => scenario.category === category)
                        .map((scenario) => (
                          <Card
                            key={scenario.id}
                            className={`cursor-pointer transition-none hover:translate-x-2 ${
                              selectedScenario?.id === scenario.id
                                ? "border-l-8 border-yellow-500 bg-yellow-500/5 shadow-[inset_0_0_0_2px_rgba(234,179,8,0.5)]"
                                : "border-l-8 border-white/20 bg-black hover:border-l-white/40"
                            } border-2 border-white/10 rounded-none`}
                            onClick={() => setSelectedScenario(scenario)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="p-3 bg-white text-black flex-shrink-0 shadow-[4px_4px_0_0_rgba(234,179,8,1)]">
                                  {scenario.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-black text-white text-xl uppercase tracking-tight">
                                      {scenario.title}
                                    </h3>
                                    {recentGenerations.some((track) => track.scenario?.id === scenario.id) && (
                                      <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-gray-300 line-clamp-2 leading-relaxed">{scenario.description}</p>
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

            <Card className="bg-black border-8 border-white/10 shadow-none rounded-none">
              <CardHeader className="border-b-8 border-yellow-500 bg-gradient-to-r from-black via-gray-900 to-black p-6 md:p-8">
                <CardTitle className="text-3xl md:text-4xl font-black text-white uppercase tracking-[-0.05em]">CUSTOM <span className="text-yellow-500">WEALTH</span> MUSIC</CardTitle>
                <CardDescription className="text-white/60 text-xs md:text-sm font-black uppercase tracking-[0.15em] mt-2">
                  ENGINEER YOUR SUCCESS FREQUENCY
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6 md:p-8">
                <Textarea
                  placeholder="DESCRIBE YOUR WEALTH FREQUENCY..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[120px] bg-black border-4 border-white/20 text-white placeholder:text-white/30 focus:border-yellow-500 font-mono text-xs md:text-sm uppercase tracking-wider rounded-none shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.5)]"
                />

                <Alert className="bg-black border-4 border-emerald-500 rounded-none shadow-[4px_4px_0_0_rgba(16,185,129,0.5)]">
                  <Lightbulb className="h-6 w-6 text-emerald-500" />
                  <AlertDescription className="text-emerald-400 font-black uppercase text-xs md:text-sm tracking-wider">
                    <strong className="text-emerald-500">PRO TIP:</strong>{" "}
                    <span className="text-white">{successTips[currentTipIndex]}</span>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {recentGenerations.length > 0 && (
              <Card className="bg-black border-8 border-white/10 shadow-none rounded-none">
                <CardHeader className="border-b-8 border-emerald-500 bg-gradient-to-r from-black via-gray-900 to-black p-6 md:p-8">
                  <CardTitle className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-[-0.05em]">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <Clock className="w-6 h-6 md:w-8 md:h-8 text-black" />
                    </div>
                    <span className="text-center md:text-left">RECENT GENERATIONS</span>
                  </CardTitle>
                  <CardDescription className="text-white/60 text-xs md:text-sm font-black uppercase tracking-[0.15em] mt-2">
                    YOUR LATEST WEALTH FREQUENCIES
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {recentGenerations.slice(0, 3).map((track, index) => (
                      <div
                        key={track.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-black/60 backdrop-blur-sm border border-gray-700 hover:border-yellow-500/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20"
                        onClick={() => {
                          const trackIndex = playlist.findIndex((p) => p.id === track.id)
                          if (trackIndex !== -1) {
                            setCurrentTrackIndex(trackIndex)
                            setGeneratedTrack(track.url)
                          }
                        }}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 text-black flex items-center justify-center font-bold shadow-lg shadow-yellow-500/30">
                          {track.scenario?.icon || <Music className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white truncate font-serif">{track.title}</div>
                          <div className="text-sm text-gray-400 font-mono">
                            {track.createdAt.toLocaleDateString()} • {track.duration}s
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-mono font-bold">
                          #{index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            <Card className="bg-black border-8 border-white/10 shadow-none rounded-none">
              <CardHeader className="border-b-8 border-yellow-500 bg-black p-8">
                <CardTitle className="text-4xl font-black text-yellow-500 uppercase tracking-[-0.05em]">MUSIC SETTINGS</CardTitle>
                <CardDescription className="text-white/60 text-sm font-black uppercase tracking-[0.15em] mt-2">CUSTOMIZE YOUR WEALTH SOUNDTRACK</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div>
                  <label className="text-lg font-bold mb-4 block text-white font-serif">
                    Duration: <span className="text-yellow-400 font-mono">{duration[0]}s</span>
                  </label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    max={300}
                    min={10}
                    step={5}
                    className="w-full [&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-400"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2 font-mono">
                    <span>Quick (10s)</span>
                    <span>Standard (30s)</span>
                    <span>Extended (5min)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-lg font-bold mb-4 block text-white font-serif">Music Style</label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger className="bg-black/60 border border-gray-700 text-white backdrop-blur-sm">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border border-gray-700 text-white">
                        {musicStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value} className="hover:bg-gray-800">
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-lg font-bold mb-4 block text-white font-serif">Tempo</label>
                    <Select value={selectedTempo} onValueChange={setSelectedTempo}>
                      <SelectTrigger className="bg-black/60 border border-gray-700 text-white backdrop-blur-sm">
                        <SelectValue placeholder="Select tempo" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border border-gray-700 text-white">
                        {tempoRanges.map((tempo) => (
                          <SelectItem key={tempo.value} value={tempo.value} className="hover:bg-gray-800">
                            {tempo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isGenerating && (
                  <div className="space-y-4 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span className="text-emerald-400 font-serif">Generating your wealth music...</span>
                      <span className="text-yellow-400 font-mono">{generationProgress}%</span>
                    </div>
                    <Progress
                      value={generationProgress}
                      className="w-full h-3 bg-black/60 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-emerald-400"
                    />
                    <div className="text-center text-gray-300 font-light">
                      Creating the perfect soundtrack for your success mindset
                    </div>
                  </div>
                )}

                <Button
                  onClick={generateMusic}
                  disabled={isGenerating || (!selectedScenario && !customPrompt.trim())}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black text-2xl py-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] border-4 border-black rounded-none transition-all duration-100"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-8 h-8 mr-4 animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <Music className="w-8 h-8 mr-4" />
                      GENERATE WEALTH MUSIC
                    </>
                  )}
                </Button>

                {selectedScenario && (
                  <div className="text-center text-gray-300 font-light">
                    Ready to generate:{" "}
                    <span className="font-bold text-yellow-400 font-serif">{selectedScenario.title}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {generatedTrack && (
              <Card className="bg-black/60 backdrop-blur-md border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
                <CardHeader className="border-b border-emerald-500/20">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl font-black text-emerald-400 font-serif">YOUR WEALTH SOUNDTRACK</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFavorited(!isFavorited)}
                        className={`${isFavorited ? "text-red-500" : "text-gray-400"} hover:text-red-400`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={shareTrack}
                        className="text-gray-400 hover:text-yellow-400"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    {playlist[currentTrackIndex]?.title || "Ready to boost your success mindset"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  {showVisualizer && (
                    <div className="h-32 bg-gradient-to-r from-yellow-500/20 via-emerald-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-yellow-500/20">
                      <div className="flex items-end gap-1 h-20">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-yellow-400 via-emerald-400 to-yellow-500 rounded-sm animate-pulse shadow-lg"
                            style={{
                              width: "4px",
                              height: `${Math.random() * 100}%`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ... existing audio player controls with updated styling ... */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-lg font-mono">
                      <span className="text-yellow-400 font-bold">{formatTime(currentTime)}</span>
                      <div
                        className="flex-1 h-4 bg-black/60 rounded-full cursor-pointer relative group border border-gray-700"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          const percentage = ((e.clientX - rect.left) / rect.width) * 100
                          seekTo(percentage)
                        }}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-emerald-400 rounded-full transition-all shadow-lg shadow-yellow-500/30"
                          style={{ width: `${totalDuration ? (currentTime / totalDuration) * 100 : 0}%` }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-yellow-400 border-2 border-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          style={{
                            left: `${totalDuration ? (currentTime / totalDuration) * 100 : 0}%`,
                            transform: "translateX(-50%) translateY(-50%)",
                          }}
                        />
                      </div>
                      <span className="text-yellow-400 font-bold">{formatTime(totalDuration)}</span>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsShuffling(!isShuffling)}
                        className={`${isShuffling ? "text-emerald-400" : "text-gray-400"} hover:text-emerald-300`}
                      >
                        <Shuffle className="w-5 h-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={playPreviousTrack}
                        disabled={playlist.length <= 1}
                        className="text-gray-400 hover:text-white disabled:text-gray-600"
                      >
                        <SkipBack className="w-5 h-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={restartTrack}
                        className="text-gray-400 hover:text-yellow-400"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </Button>

                      <Button
                        onClick={togglePlayback}
                        size="lg"
                        className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-amber-600 text-black font-black text-xl p-6 shadow-2xl shadow-yellow-500/40 transition-all duration-300 hover:shadow-yellow-500/60"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={playNextTrack}
                        disabled={playlist.length <= 1}
                        className="text-gray-400 hover:text-white disabled:text-gray-600"
                      >
                        <SkipForward className="w-5 h-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsLooping(!isLooping)}
                        className={`${isLooping ? "text-emerald-400" : "text-gray-400"} hover:text-emerald-300`}
                      >
                        <Repeat className="w-5 h-5" />
                      </Button>

                      <Button
                        onClick={downloadTrack}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-yellow-400"
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleMute}
                          className="text-gray-400 hover:text-white"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
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
                          className="flex-1 [&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-400"
                        />
                        <span className="text-yellow-400 font-mono font-bold w-12">{volume[0]}%</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-mono w-16">Speed:</span>
                        <Slider
                          value={playbackRate}
                          onValueChange={setPlaybackRate}
                          max={2}
                          min={0.5}
                          step={0.1}
                          className="flex-1 [&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-400"
                        />
                        <span className="text-emerald-400 font-mono font-bold w-12">{playbackRate[0]}x</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={showVisualizer}
                            onCheckedChange={setShowVisualizer}
                            className="data-[state=checked]:bg-yellow-500"
                          />
                          <span className="text-white font-bold font-serif">Visualizer</span>
                        </div>

                        {playlist.length > 1 && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                            Track {currentTrackIndex + 1} of {playlist.length}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge className="bg-gradient-to-r from-yellow-500/20 to-emerald-500/20 text-yellow-400 border border-yellow-500/30 font-black text-lg px-6 py-2 font-serif tracking-wider">
                      READY FOR SUCCESS
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
