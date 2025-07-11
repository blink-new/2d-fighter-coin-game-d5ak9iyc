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
  // New abilities
  doubleJump: boolean
  doubleJumpUsed: boolean
  shieldActive: boolean
  shieldCooldown: number
  berserkerMode: boolean
  berserkerTimer: number
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
  type: 'health' | 'damage' | 'speed' | 'ability'
  value: number
  purchased: boolean
  icon: string
  stock?: number
  maxStock?: number
  isLimited?: boolean
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface GameStats {
  totalCoins: number
  upgradesPurchased: ShopItem[]
  gamesWon: number
  totalGames: number
  shopStock: Record<string, number>
}

export interface TouchInput {
  left: boolean
  right: boolean
  jump: boolean
  attack: boolean
  shield: boolean
}