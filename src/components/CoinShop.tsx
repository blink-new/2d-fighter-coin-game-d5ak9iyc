import { ShopItem, GameStats } from '../types/game'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Coins, Heart, Zap, Wind } from 'lucide-react'

interface CoinShopProps {
  coins: number
  gameStats: GameStats
  onPurchase: (item: ShopItem) => void
}

const shopItems: ShopItem[] = [
  {
    id: 'health1',
    name: 'Health Boost I',
    description: 'Increase max health by 20',
    price: 25,
    type: 'health',
    value: 20,
    purchased: false,
    icon: '❤️'
  },
  {
    id: 'health2',
    name: 'Health Boost II',
    description: 'Increase max health by 40',
    price: 50,
    type: 'health',
    value: 40,
    purchased: false,
    icon: '💚'
  },
  {
    id: 'damage1',
    name: 'Power Up I',
    description: 'Increase damage by 5',
    price: 30,
    type: 'damage',
    value: 5,
    purchased: false,
    icon: '⚡'
  },
  {
    id: 'damage2',
    name: 'Power Up II',
    description: 'Increase damage by 10',
    price: 60,
    type: 'damage',
    value: 10,
    purchased: false,
    icon: '🔥'
  },
  {
    id: 'speed1',
    name: 'Speed Boost I',
    description: 'Increase movement speed by 1',
    price: 20,
    type: 'speed',
    value: 1,
    purchased: false,
    icon: '💨'
  },
  {
    id: 'speed2',
    name: 'Speed Boost II',
    description: 'Increase movement speed by 2',
    price: 40,
    type: 'speed',
    value: 2,
    purchased: false,
    icon: '🚀'
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
      default:
        return 'bg-gray-500'
    }
  }

  const isPurchased = (itemId: string) => {
    return gameStats.upgradesPurchased.some(item => item.id === itemId)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Coin Shop</h2>
          <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-800">{coins}</span>
          </div>
        </div>
        <p className="text-gray-600">
          Use your hard-earned coins to upgrade your fighter and gain advantages in battle!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopItems.map((item) => {
          const purchased = isPurchased(item.id)
          const canAfford = coins >= item.price && !purchased

          return (
            <Card key={item.id} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${getTypeColor(item.type)} text-white`}>
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-2xl">{item.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
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