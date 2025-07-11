import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight, ChevronUp, Sword, Shield } from 'lucide-react'

interface TouchControlsProps {
  onInput: (action: string, pressed: boolean) => void
  gameStarted: boolean
  gameOver: boolean
  onStart: () => void
  onRestart: () => void
  hasShield?: boolean
}

export function TouchControls({ 
  onInput, 
  gameStarted, 
  gameOver, 
  onStart, 
  onRestart,
  hasShield = false
}: TouchControlsProps) {
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set())
  const intervalRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const handleButtonPress = (action: string) => {
    if (activeButtons.has(action)) return
    
    setActiveButtons(prev => new Set(prev.add(action)))
    onInput(action, true)
    
    // Set up continuous input for movement
    if (['left', 'right'].includes(action)) {
      const interval = setInterval(() => {
        onInput(action, true)
      }, 50)
      intervalRefs.current.set(action, interval)
    }
  }

  const handleButtonRelease = (action: string) => {
    setActiveButtons(prev => {
      const newSet = new Set(prev)
      newSet.delete(action)
      return newSet
    })
    
    onInput(action, false)
    
    // Clear interval for movement
    const interval = intervalRefs.current.get(action)
    if (interval) {
      clearInterval(interval)
      intervalRefs.current.delete(action)
    }
  }

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      intervalRefs.current.forEach(interval => clearInterval(interval))
    }
  }, [])

  const buttonClass = (action: string) => `
    select-none touch-none transition-all duration-150 font-bold text-lg
    ${activeButtons.has(action) 
      ? 'bg-blue-600 text-white scale-95 shadow-inner' 
      : 'bg-white text-gray-800 hover:bg-gray-100 shadow-lg'
    }
  `

  const shieldButtonClass = (action: string) => `
    select-none touch-none transition-all duration-150 font-bold text-lg
    ${activeButtons.has(action) 
      ? 'bg-purple-600 text-white scale-95 shadow-inner' 
      : 'bg-purple-100 text-purple-800 hover:bg-purple-200 shadow-lg'
    }
  `

  if (!gameStarted && !gameOver) {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent">
        <div className="flex justify-center">
          <Button
            onClick={onStart}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-xl font-bold rounded-full shadow-lg animate-pulse"
          >
            🎮 Start Game
          </Button>
        </div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent">
        <div className="flex justify-center">
          <Button
            onClick={onRestart}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-xl font-bold rounded-full shadow-lg animate-pulse"
          >
            🔄 Play Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent">
      <div className="flex justify-between items-end max-w-2xl mx-auto">
        {/* Movement Controls */}
        <div className="flex gap-2">
          <Button
            className={buttonClass('left')}
            size="lg"
            onTouchStart={() => handleButtonPress('left')}
            onTouchEnd={() => handleButtonRelease('left')}
            onMouseDown={() => handleButtonPress('left')}
            onMouseUp={() => handleButtonRelease('left')}
            onMouseLeave={() => handleButtonRelease('left')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            className={buttonClass('right')}
            size="lg"
            onTouchStart={() => handleButtonPress('right')}
            onTouchEnd={() => handleButtonRelease('right')}
            onMouseDown={() => handleButtonPress('right')}
            onMouseUp={() => handleButtonRelease('right')}
            onMouseLeave={() => handleButtonRelease('right')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <Button
            className={buttonClass('jump')}
            size="lg"
            onTouchStart={() => handleButtonPress('jump')}
            onTouchEnd={() => handleButtonRelease('jump')}
            onMouseDown={() => handleButtonPress('jump')}
            onMouseUp={() => handleButtonRelease('jump')}
            onMouseLeave={() => handleButtonRelease('jump')}
          >
            <ChevronUp className="w-5 h-5" />
          </Button>
          <Button
            className={buttonClass('attack')}
            size="lg"
            onTouchStart={() => handleButtonPress('attack')}
            onTouchEnd={() => handleButtonRelease('attack')}
            onMouseDown={() => handleButtonPress('attack')}
            onMouseUp={() => handleButtonRelease('attack')}
            onMouseLeave={() => handleButtonRelease('attack')}
          >
            <Sword className="w-5 h-5" />
          </Button>
          {hasShield && (
            <Button
              className={shieldButtonClass('shield')}
              size="lg"
              onTouchStart={() => handleButtonPress('shield')}
              onTouchEnd={() => handleButtonRelease('shield')}
              onMouseDown={() => handleButtonPress('shield')}
              onMouseUp={() => handleButtonRelease('shield')}
              onMouseLeave={() => handleButtonRelease('shield')}
            >
              <Shield className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Control hints */}
      <div className="text-center mt-3 text-white text-sm bg-black/30 rounded-lg px-4 py-2 max-w-sm mx-auto">
        <p>👆 Tap and hold to move • 🗡️ Attack • 🦅 Jump{hasShield ? ' • 🛡️ Shield' : ''}</p>
      </div>
    </div>
  )
}