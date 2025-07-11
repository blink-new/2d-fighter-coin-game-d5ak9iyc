import { useState, useEffect } from 'react'
import { GameState, GameStats, ShopItem } from './types/game'
import { GameCanvas } from './components/GameCanvas'
import { CoinShop } from './components/CoinShop'
import { GameStats as GameStatsComponent } from './components/GameStats'
import { Button } from './components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Swords, ShoppingCart, BarChart3, Play, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

function App() {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      x: 100,
      y: 240,
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
      color: '#3B82F6',
      name: 'Player'
    },
    enemy: {
      x: 650,
      y: 240,
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
      color: '#EF4444',
      name: 'Enemy'
    },
    coins: 0,
    gameStarted: false,
    gameOver: false,
    winner: null,
    level: 1,
    score: 0
  })

  const [gameStats, setGameStats] = useState<GameStats>({
    totalCoins: 0,
    upgradesPurchased: [],
    gamesWon: 0,
    totalGames: 0,
    shopStock: {
      rage_mode: 3,
      healing_potion: 5,
      shield_barrier: 2
    }
  })

  const [activeTab, setActiveTab] = useState<string>('game')

  // Load game data from localStorage
  useEffect(() => {
    const savedGameState = localStorage.getItem('fighterGameState')
    const savedGameStats = localStorage.getItem('fighterGameStats')
    
    if (savedGameState) {
      try {
        const parsedState = JSON.parse(savedGameState)
        setGameState(prevState => ({
          ...prevState,
          coins: parsedState.coins || 0,
          level: parsedState.level || 1,
          score: parsedState.score || 0
        }))
      } catch (e) {
        console.error('Error loading game state:', e)
      }
    }
    
    if (savedGameStats) {
      try {
        const parsedStats = JSON.parse(savedGameStats)
        setGameStats(prevStats => ({
          ...prevStats,
          ...parsedStats,
          shopStock: parsedStats.shopStock || {
            double_jump: 3,
            shield: 2,
            berserker: 1,
            vampire: 2
          }
        }))
      } catch (e) {
        console.error('Error loading game stats:', e)
      }
    }
  }, [])

  // Save game data to localStorage
  useEffect(() => {
    localStorage.setItem('fighterGameState', JSON.stringify({
      coins: gameState.coins,
      level: gameState.level,
      score: gameState.score
    }))
  }, [gameState.coins, gameState.level, gameState.score])

  useEffect(() => {
    localStorage.setItem('fighterGameStats', JSON.stringify(gameStats))
  }, [gameStats])

  // Apply upgrades to player
  useEffect(() => {
    const newPlayer = { ...gameState.player }
    let hasChanges = false

    // Reset to base stats
    newPlayer.maxHealth = 100
    newPlayer.damage = 20
    newPlayer.speed = 5

    // Apply upgrades
    gameStats.upgradesPurchased.forEach(upgrade => {
      if (upgrade.type === 'health') {
        newPlayer.maxHealth += upgrade.value
        hasChanges = true
      } else if (upgrade.type === 'damage') {
        newPlayer.damage += upgrade.value
        hasChanges = true
      } else if (upgrade.type === 'speed') {
        newPlayer.speed += upgrade.value
        hasChanges = true
      }
    })

    // Ensure current health doesn't exceed max health
    if (newPlayer.health > newPlayer.maxHealth) {
      newPlayer.health = newPlayer.maxHealth
    }

    if (hasChanges) {
      setGameState(prevState => ({
        ...prevState,
        player: newPlayer
      }))
    }
  }, [gameStats.upgradesPurchased, gameState.player])

  // Handle game state changes
  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState)
    
    // Update stats when game ends
    if (newState.gameOver && !gameState.gameOver) {
      setGameStats(prevStats => ({
        ...prevStats,
        totalCoins: prevStats.totalCoins + (newState.coins - gameState.coins),
        gamesWon: newState.winner === 'Player' ? prevStats.gamesWon + 1 : prevStats.gamesWon,
        totalGames: prevStats.totalGames + 1
      }))
      
      if (newState.winner === 'Player') {
        toast.success(`Victory! You earned ${newState.coins - gameState.coins} coins!`, {
          duration: 3000,
          icon: '🎉'
        })
      } else {
        toast.error('Defeat! Better luck next time!', {
          duration: 3000,
          icon: '💀'
        })
      }
    }
  }

  // Handle shop purchases
  const handlePurchase = (item: ShopItem) => {
    if (gameState.coins >= item.price) {
      if (item.isLimited) {
        // Handle limited stock items
        const currentStock = gameStats.shopStock[item.id] || 0
        if (currentStock > 0) {
          setGameState(prevState => ({
            ...prevState,
            coins: prevState.coins - item.price
          }))
          
          setGameStats(prevStats => ({
            ...prevStats,
            shopStock: {
              ...prevStats.shopStock,
              [item.id]: currentStock - 1
            }
          }))
          
          toast.success(`Purchased ${item.name}! You have ${currentStock - 1} remaining.`, {
            duration: 3000,
            icon: '✨'
          })
        } else {
          toast.error('This item is out of stock!', {
            duration: 3000,
            icon: '❌'
          })
        }
      } else {
        // Handle permanent upgrades
        if (!gameStats.upgradesPurchased.some(upgrade => upgrade.id === item.id)) {
          setGameState(prevState => ({
            ...prevState,
            coins: prevState.coins - item.price
          }))
          
          setGameStats(prevStats => ({
            ...prevStats,
            upgradesPurchased: [...prevStats.upgradesPurchased, { ...item, purchased: true }]
          }))
          
          toast.success(`Purchased ${item.name}! Your fighter is now stronger!`, {
            duration: 3000,
            icon: '🛒'
          })
        }
      }
    }
  }

  // Start new game
  const startNewGame = () => {
    setGameState(prevState => ({
      ...prevState,
      gameStarted: true,
      gameOver: false,
      winner: null,
      player: {
        ...prevState.player,
        health: prevState.player.maxHealth,
        x: 100,
        y: 240,
        isAttacking: false,
        attackCooldown: 0
      },
      enemy: {
        ...prevState.enemy,
        health: 100 + (prevState.level * 10), // Enemies get stronger each level
        maxHealth: 100 + (prevState.level * 10),
        damage: 20 + (prevState.level * 2),
        speed: 5 + (prevState.level * 0.5),
        x: 650,
        y: 240,
        isAttacking: false,
        attackCooldown: 0
      }
    }))
    setActiveTab('game')
  }

  const hasLimitedAbilities = Object.values(gameStats.shopStock).some(stock => stock > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            2D Fighter Arena
          </h1>
          <p className="text-gray-600">
            Battle enemies, earn coins, and upgrade your fighter!
          </p>
        </div>

        {/* Quick Start Card */}
        {!gameState.gameStarted && !gameState.gameOver && (
          <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Play className="w-6 h-6" />
                Ready to Fight?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <p className="mb-2">Level {gameState.level} • {gameState.coins} coins</p>
                  <p className="text-sm opacity-90">
                    Defeat enemies to earn coins and upgrade your fighter in the shop!
                  </p>
                </div>
                <Button 
                  onClick={startNewGame} 
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Start Battle
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="game" className="flex items-center gap-2">
              <Swords className="w-4 h-4" />
              Game
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Shop
              <div className="flex gap-1">
                {gameState.coins >= 20 && (
                  <Badge variant="secondary" className="ml-1">
                    {gameState.coins}
                  </Badge>
                )}
                {hasLimitedAbilities && (
                  <Badge variant="default" className="bg-purple-500 text-white">
                    <Sparkles className="w-3 h-3" />
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-4">
            <GameCanvas 
              gameState={gameState}
              onGameStateChange={handleGameStateChange}
            />
            <GameStatsComponent gameState={gameState} />
          </TabsContent>

          <TabsContent value="shop" className="space-y-4">
            <CoinShop
              coins={gameState.coins}
              gameStats={gameStats}
              onPurchase={handlePurchase}
            />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <GameStatsComponent gameState={gameState} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App