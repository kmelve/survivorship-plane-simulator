import './style.css'
import { GameEngine } from './ui/GameEngine.js'
import { GameLayout } from './ui/components/GameLayout.js'

const app = document.querySelector<HTMLDivElement>('#app')!

const gameEngine = new GameEngine()
const gameLayout = new GameLayout(gameEngine, app)

gameLayout.mount()

console.log('Survivorship Bias Plane Simulator loaded!')
console.log('Current game state:', gameEngine.getState())
