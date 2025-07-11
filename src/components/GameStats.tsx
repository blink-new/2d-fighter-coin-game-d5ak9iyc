import { GameState } from '../types/game'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Coins, Heart, Target, Trophy } from 'lucide-react'

interface GameStatsProps {
  gameState: GameState
}

export function GameStats({ gameState }: GameStatsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Coins</CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">{gameState.coins}</div>
            <p className="text-xs text-muted-foreground">
              Earn more by winning battles!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Score</CardTitle>
            <Trophy className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{gameState.score}</div>
            <p className="text-xs text-muted-foreground">
              Your fighting prowess
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{gameState.level}</div>
            <p className="text-xs text-muted-foreground">
              Difficulty increases with level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Player Health</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              {gameState.player.health}/{gameState.player.maxHealth}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(gameState.player.health / gameState.player.maxHealth) * 100}%`
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Player Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Damage:</span>
                <Badge variant="outline">{gameState.player.damage}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Speed:</span>
                <Badge variant="outline">{gameState.player.speed}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Max Health:</span>
                <Badge variant="outline">{gameState.player.maxHealth}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enemy Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Health:</span>
                <Badge variant="outline" className="text-red-600">
                  {gameState.enemy.health}/{gameState.enemy.maxHealth}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Damage:</span>
                <Badge variant="outline">{gameState.enemy.damage}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Speed:</span>
                <Badge variant="outline">{gameState.enemy.speed}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}