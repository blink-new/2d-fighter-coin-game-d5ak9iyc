export interface Fighter {
  x: number
  y: number
  width: number
  height: number
  health: number
  maxHealth: number
  speed: number
  isJumping: boolean
  velocityY: number
  isMovingLeft: boolean
  isMovingRight: boolean
  isAttacking: boolean
  attackCooldown: number
  damage: number
  color: string
  name: string
}

export interface GameState {
  player: Fighter
  enemy: Fighter
  coins: number
  gameStarted: boolean
  gameOver: boolean
  winner: string | null
  level: number
  score: number
}

export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  type: 'health' | 'damage' | 'speed'
  value: number
  purchased: boolean
  icon: string
}

export interface GameStats {
  totalCoins: number
  upgradesPurchased: ShopItem[]
  gamesWon: number
  totalGames: number
}