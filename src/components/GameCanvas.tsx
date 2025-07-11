import { useEffect, useRef, useState, useCallback } from 'react'
import { Fighter, GameState } from '../types/game'
import { useGameLoop } from '../hooks/useGameLoop'
import { TouchControls } from './TouchControls'

interface GameCanvasProps {
  gameState: GameState
  onGameStateChange: (state: GameState) => void
}

export function GameCanvas({ gameState, onGameStateChange }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [keys, setKeys] = useState<Set<string>>(new Set())
  const [touchInputs, setTouchInputs] = useState<Set<string>>(new Set())
  const [isMobile, setIsMobile] = useState(false)

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 400
  const GROUND_Y = CANVAS_HEIGHT - 100
  const GRAVITY = 0.8
  const JUMP_FORCE = -15

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const createFighter = useCallback((x: number, color: string, name: string): Fighter => ({
    x,
    y: GROUND_Y - 60,
    width: 50,
    height: 60,
    health: 100,
    maxHealth: 100,
    speed: 5,
    isJumping: false,
    velocityY: 0,
    isMovingLeft: false,
    isMovingRight: false,
    isAttacking: false,
    attackCooldown: 0,
    damage: 20,
    color,
    name
  }), [])

  const resetGame = useCallback(() => {
    const newState: GameState = {
      ...gameState,
      player: createFighter(100, '#3B82F6', 'Player'),
      enemy: createFighter(CANVAS_WIDTH - 150, '#EF4444', 'Enemy'),
      gameStarted: false,
      gameOver: false,
      winner: null
    }
    onGameStateChange(newState)
  }, [gameState, onGameStateChange, createFighter])

  const updateFighter = useCallback((fighter: Fighter, deltaTime: number) => {
    // Apply gravity
    if (fighter.y < GROUND_Y - fighter.height || fighter.isJumping) {
      fighter.velocityY += GRAVITY
      fighter.y += fighter.velocityY
      
      if (fighter.y >= GROUND_Y - fighter.height) {
        fighter.y = GROUND_Y - fighter.height
        fighter.velocityY = 0
        fighter.isJumping = false
      }
    }

    // Update attack cooldown
    if (fighter.attackCooldown > 0) {
      fighter.attackCooldown -= deltaTime
    }

    // Movement bounds
    fighter.x = Math.max(0, Math.min(CANVAS_WIDTH - fighter.width, fighter.x))
  }, [])

  const checkCollision = useCallback((fighter1: Fighter, fighter2: Fighter): boolean => {
    return fighter1.x < fighter2.x + fighter2.width &&
           fighter1.x + fighter1.width > fighter2.x &&
           fighter1.y < fighter2.y + fighter2.height &&
           fighter1.y + fighter1.height > fighter2.y
  }, [])

  const handlePlayerInput = useCallback((player: Fighter) => {
    // Keyboard input
    const leftPressed = keys.has('ArrowLeft') || keys.has('a')
    const rightPressed = keys.has('ArrowRight') || keys.has('d')
    const upPressed = keys.has('ArrowUp') || keys.has('w')
    const attackPressed = keys.has(' ') || keys.has('Enter')

    // Touch input
    const touchLeftPressed = touchInputs.has('left')
    const touchRightPressed = touchInputs.has('right')
    const touchUpPressed = touchInputs.has('jump')
    const touchAttackPressed = touchInputs.has('attack')

    if (leftPressed || touchLeftPressed) {
      player.x -= player.speed
      player.isMovingLeft = true
    } else {
      player.isMovingLeft = false
    }

    if (rightPressed || touchRightPressed) {
      player.x += player.speed
      player.isMovingRight = true
    } else {
      player.isMovingRight = false
    }

    if ((upPressed || touchUpPressed) && !player.isJumping) {
      player.velocityY = JUMP_FORCE
      player.isJumping = true
    }

    if ((attackPressed || touchAttackPressed) && player.attackCooldown <= 0) {
      player.isAttacking = true
      player.attackCooldown = 500
    }
  }, [keys, touchInputs])

  const handleEnemyAI = useCallback((enemy: Fighter, player: Fighter) => {
    const distanceToPlayer = Math.abs(enemy.x - player.x)
    
    // Move towards player
    if (distanceToPlayer > 80) {
      if (enemy.x < player.x) {
        enemy.x += enemy.speed * 0.7
        enemy.isMovingRight = true
        enemy.isMovingLeft = false
      } else {
        enemy.x -= enemy.speed * 0.7
        enemy.isMovingLeft = true
        enemy.isMovingRight = false
      }
    } else {
      enemy.isMovingLeft = false
      enemy.isMovingRight = false
    }

    // Attack if close enough
    if (distanceToPlayer < 70 && enemy.attackCooldown <= 0) {
      enemy.isAttacking = true
      enemy.attackCooldown = 800
    }

    // Random jump
    if (Math.random() < 0.002 && !enemy.isJumping) {
      enemy.velocityY = JUMP_FORCE
      enemy.isJumping = true
    }
  }, [])

  const updateGame = useCallback((deltaTime: number) => {
    if (!gameState.gameStarted || gameState.gameOver) return

    const newState = { ...gameState }
    
    // Handle player input
    handlePlayerInput(newState.player)
    
    // Handle enemy AI
    handleEnemyAI(newState.enemy, newState.player)
    
    // Update fighters
    updateFighter(newState.player, deltaTime)
    updateFighter(newState.enemy, deltaTime)
    
    // Check for attacks
    if (newState.player.isAttacking && checkCollision(newState.player, newState.enemy)) {
      newState.enemy.health -= newState.player.damage
      newState.player.isAttacking = false
    }
    
    if (newState.enemy.isAttacking && checkCollision(newState.enemy, newState.player)) {
      newState.player.health -= newState.enemy.damage
      newState.enemy.isAttacking = false
    }
    
    // Check for game over
    if (newState.player.health <= 0) {
      newState.gameOver = true
      newState.winner = 'Enemy'
    } else if (newState.enemy.health <= 0) {
      newState.gameOver = true
      newState.winner = 'Player'
      newState.coins += 10 + (newState.level * 5)
      newState.score += 100
    }
    
    onGameStateChange(newState)
  }, [gameState, handlePlayerInput, handleEnemyAI, updateFighter, checkCollision, onGameStateChange])

  const drawFighter = useCallback((ctx: CanvasRenderingContext2D, fighter: Fighter) => {
    // Draw fighter body
    ctx.fillStyle = fighter.color
    ctx.fillRect(fighter.x, fighter.y, fighter.width, fighter.height)
    
    // Draw fighter outline
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.strokeRect(fighter.x, fighter.y, fighter.width, fighter.height)
    
    // Draw attack indicator
    if (fighter.isAttacking) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.6)'
      const attackRange = 20
      if (fighter.color === '#3B82F6') { // Player
        ctx.fillRect(fighter.x + fighter.width, fighter.y + 10, attackRange, fighter.height - 20)
      } else { // Enemy
        ctx.fillRect(fighter.x - attackRange, fighter.y + 10, attackRange, fighter.height - 20)
      }
    }
    
    // Draw health bar
    const healthBarWidth = fighter.width
    const healthBarHeight = 8
    const healthBarY = fighter.y - 15
    
    // Health bar background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillRect(fighter.x, healthBarY, healthBarWidth, healthBarHeight)
    
    // Health bar fill
    const healthPercentage = fighter.health / fighter.maxHealth
    ctx.fillStyle = healthPercentage > 0.5 ? '#10B981' : healthPercentage > 0.25 ? '#F59E0B' : '#EF4444'
    ctx.fillRect(fighter.x, healthBarY, healthBarWidth * healthPercentage, healthBarHeight)
    
    // Health bar border
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.strokeRect(fighter.x, healthBarY, healthBarWidth, healthBarHeight)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
    gradient.addColorStop(0, '#87CEEB')
    gradient.addColorStop(1, '#98FB98')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Draw ground
    ctx.fillStyle = '#8B4513'
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y)
    
    // Draw fighters
    drawFighter(ctx, gameState.player)
    drawFighter(ctx, gameState.enemy)
    
    // Draw UI
    ctx.fillStyle = '#000'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    
    if (!gameState.gameStarted && !isMobile) {
      ctx.fillText('Press SPACE to Start!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      ctx.font = '16px Arial'
      ctx.fillText('Use ARROW KEYS or WASD to move, SPACE to attack', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30)
    }
    
    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      
      ctx.fillStyle = '#FFF'
      ctx.font = 'bold 48px Arial'
      ctx.fillText(`${gameState.winner} Wins!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      
      if (gameState.winner === 'Player') {
        ctx.font = '24px Arial'
        ctx.fillText(`+${10 + (gameState.level * 5)} Coins!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60)
      }
      
      if (!isMobile) {
        ctx.font = '18px Arial'
        ctx.fillText('Press R to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100)
      }
    }
  }, [gameState, drawFighter, isMobile])

  const handleTouchInput = useCallback((action: string, pressed: boolean) => {
    if (pressed) {
      setTouchInputs(prev => new Set(prev.add(action)))
    } else {
      setTouchInputs(prev => {
        const newSet = new Set(prev)
        newSet.delete(action)
        return newSet
      })
    }
  }, [])

  const handleStart = useCallback(() => {
    onGameStateChange({ ...gameState, gameStarted: true })
  }, [gameState, onGameStateChange])

  useGameLoop(updateGame)

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev.add(e.key)))
      
      if (e.key === ' ' && !gameState.gameStarted && !gameState.gameOver) {
        onGameStateChange({ ...gameState, gameStarted: true })
      }
      
      if (e.key === 'r' && gameState.gameOver) {
        resetGame()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev)
        newKeys.delete(e.key)
        return newKeys
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState, onGameStateChange, resetGame])

  const canvasStyle = isMobile ? {
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
    imageRendering: 'pixelated' as const
  } : {
    imageRendering: 'pixelated' as const
  }

  return (
    <div className="relative flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-gray-800 rounded-lg shadow-lg bg-white"
        style={canvasStyle}
      />
      
      {!isMobile && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Use ARROW KEYS or WASD to move • SPACE to attack • R to restart
          </p>
        </div>
      )}
      
      {isMobile && (
        <TouchControls
          onInput={handleTouchInput}
          gameStarted={gameState.gameStarted}
          gameOver={gameState.gameOver}
          onStart={handleStart}
          onRestart={resetGame}
        />
      )}
    </div>
  )
}