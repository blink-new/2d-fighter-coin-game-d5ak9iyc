import { ShopItem, GameStats } from '../types/game'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Coins, Heart, Zap, Wind, Shield, Sparkles, Crown, Star } from 'lucide-react'

interface CoinShopProps {
  coins: number
  gameStats: GameStats
  onPurchase: (item: ShopItem) => void
}

const shopItems: ShopItem[] = [
  // Regular upgrades
  {
    id: 'health1',
    name: 'Health Boost I',
    description: 'Increase max health by 20',
    price: 25,
    type: 'health',
    value: 20,
    purchased: false,
    icon: '❤️',
    rarity: 'common'
  },
  {
    id: 'health2',
    name: 'Health Boost II',
    description: 'Increase max health by 40',
    price: 50,
    type: 'health',
    value: 40,
    purchased: false,
    icon: '💚',
    rarity: 'common'
  },
  {
    id: 'damage1',
    name: 'Power Up I',
    description: 'Increase damage by 5',
    price: 30,
    type: 'damage',
    value: 5,
    purchased: false,
    icon: '⚡',
    rarity: 'common'
  },
  {
    id: 'damage2',
    name: 'Power Up II',
    description: 'Increase damage by 10',
    price: 60,
    type: 'damage',
    value: 10,
    purchased: false,
    icon: '🔥',
    rarity: 'common'
  },
  {
    id: 'speed1',
    name: 'Speed Boost I',
    description: 'Increase movement speed by 1',
    price: 20,
    type: 'speed',
    value: 1,
    purchased: false,
    icon: '💨',
    rarity: 'common'
  },
  {
    id: 'speed2',
    name: 'Speed Boost II',
    description: 'Increase movement speed by 2',
    price: 40,
    type: 'speed',
    value: 2,
    purchased: false,
    icon: '🚀',
    rarity: 'common'
  },
  // Limited stock abilities
  {
    id: 'double_jump',
    name: 'Double Jump',
    description: 'Press jump twice to double jump! Limited stock.',
    price: 100,
    type: 'ability',
    value: 1,
    purchased: false,
    icon: '🦅',
    isLimited: true,
    stock: 3,
    maxStock: 3,
    rarity: 'rare'
  },
  {
    id: 'shield',
    name: 'Energy Shield',
    description: 'Activate shield to block damage. Limited stock.',
    price: 150,
    type: 'ability',
    value: 1,
    purchased: false,
    icon: '🛡️',
    isLimited: true,
    stock: 2,
    maxStock: 2,
    rarity: 'epic'
  },
  {
    id: 'berserker',
    name: 'Berserker Mode',
    description: 'Double damage and speed for 10 seconds. Very rare!',
    price: 250,
    type: 'ability',
    value: 1,
    purchased: false,
    icon: '🔥',
    isLimited: true,
    stock: 1,
    maxStock: 1,
    rarity: 'legendary'
  },
  {
    id: 'vampire',
    name: 'Vampire Strike',
    description: 'Attacks heal you for 25% of damage dealt. Rare!',
    price: 200,
    type: 'ability',
    value: 1,
    purchased: false,
    icon: '🧛',
    isLimited: true,
    stock: 2,
    maxStock: 2,
    rarity: 'epic'
  }
]

export function CoinShop({ coins, gameStats, onPurchase }: CoinShopProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <Heart className="w-5 h-5" />
      case 'damage':
        return <Zap className="w-5 h-5" />
      case 'speed':
        return <Wind className="w-5 h-5" />
      case 'ability':
        return <Sparkles className="w-5 h-5" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'health':
        return 'bg-red-500'
      case 'damage':
        return 'bg-yellow-500'
      case 'speed':
        return 'bg-blue-500'
      case 'ability':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 bg-gray-50'
      case 'rare':
        return 'border-blue-300 bg-blue-50'
      case 'epic':
        return 'border-purple-300 bg-purple-50'
      case 'legendary':
        return 'border-yellow-300 bg-yellow-50'
      default:
        return 'border-gray-300 bg-white'
    }
  }

  const getRarityIcon = (rarity?: string) => {
    switch (rarity) {
      case 'rare':
        return <Star className="w-4 h-4 text-blue-500" />
      case 'epic':
        return <Crown className="w-4 h-4 text-purple-500" />
      case 'legendary':
        return <Sparkles className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const isPurchased = (itemId: string) => {
    return gameStats.upgradesPurchased.some(item => item.id === itemId)
  }

  const getItemStock = (itemId: string) => {
    return gameStats.shopStock[itemId] ?? shopItems.find(item => item.id === itemId)?.stock ?? 0
  }

  const groupedItems = {
    upgrades: shopItems.filter(item => item.type !== 'ability'),
    abilities: shopItems.filter(item => item.type === 'ability')
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Coin Shop</h2>
          <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-800">{coins}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm md:text-base">
          Use your hard-earned coins to upgrade your fighter and gain advantages in battle!
        </p>
      </div>

      {/* Permanent Upgrades */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Permanent Upgrades
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupedItems.upgrades.map((item) => {
            const purchased = isPurchased(item.id)
            const canAfford = coins >= item.price && !purchased

            return (
              <Card key={item.id} className={`relative overflow-hidden ${getRarityColor(item.rarity)}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${getTypeColor(item.type)} text-white`}>
                        {getIcon(item.type)}
                      </div>
                      <div>
                        <CardTitle className="text-base md:text-lg">{item.name}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </Badge>
                          {getRarityIcon(item.rarity)}
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl">{item.icon}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-sm">
                    {item.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">{item.price}</span>
                    </div>
                    <Button
                      onClick={() => onPurchase(item)}
                      disabled={!canAfford}
                      variant={purchased ? "secondary" : "default"}
                      size="sm"
                    >
                      {purchased ? 'Purchased' : canAfford ? 'Buy' : 'Not enough coins'}
                    </Button>
                  </div>
                </CardContent>
                {purchased && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✓ Owned
                    </Badge>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Limited Stock Abilities */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Limited Stock Abilities
          <Badge variant="outline" className="bg-red-100 text-red-800">
            🔥 Limited!
          </Badge>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupedItems.abilities.map((item) => {
            const purchased = isPurchased(item.id)
            const currentStock = getItemStock(item.id)
            const canAfford = coins >= item.price && !purchased && currentStock > 0

            return (
              <Card key={item.id} className={`relative overflow-hidden ${getRarityColor(item.rarity)} border-2`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${getTypeColor(item.type)} text-white`}>
                        {getIcon(item.type)}
                      </div>
                      <div>
                        <CardTitle className="text-base md:text-lg">{item.name}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.rarity?.charAt(0).toUpperCase() + item.rarity?.slice(1)}
                          </Badge>
                          {getRarityIcon(item.rarity)}
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl">{item.icon}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-sm">
                    {item.description}
                  </CardDescription>
                  
                  {/* Stock indicator */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-600">Stock</span>
                      <span className="text-xs font-bold text-gray-800">{currentStock} left</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentStock > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${((currentStock) / (item.maxStock || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">{item.price}</span>
                    </div>
                    <Button
                      onClick={() => onPurchase(item)}
                      disabled={!canAfford}
                      variant={purchased ? "secondary" : currentStock > 0 ? "default" : "destructive"}
                      size="sm"
                    >
                      {purchased ? 'Purchased' : currentStock > 0 ? (canAfford ? 'Buy' : 'Not enough coins') : 'Sold Out'}
                    </Button>
                  </div>
                </CardContent>
                {purchased && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✓ Owned
                    </Badge>
                  </div>
                )}
                {currentStock === 0 && !purchased && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      ❌ Sold Out
                    </Badge>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{gameStats.totalCoins}</p>
            <p className="text-sm text-gray-600">Total Coins Earned</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{gameStats.upgradesPurchased.length}</p>
            <p className="text-sm text-gray-600">Upgrades Purchased</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{gameStats.gamesWon}</p>
            <p className="text-sm text-gray-600">Games Won</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{gameStats.totalGames}</p>
            <p className="text-sm text-gray-600">Total Games</p>
          </div>
        </div>
      </div>
    </div>
  )
}