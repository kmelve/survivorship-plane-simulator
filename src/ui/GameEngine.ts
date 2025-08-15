import { BiasEngine, type BiasAnalysis } from '../game/BiasEngine.js'
import { MissionSystem, type Mission, type MissionResult } from '../game/MissionSystem.js'
import { VCAdvisor, type VCQuote } from '../game/VCAdvisor.js'
import { type ArmorPlacement } from '../game/BiasEngine.js'

export type GamePhase = 'tutorial' | 'analysis' | 'mission' | 'results' | 'graveyard'

export interface GameState {
  phase: GamePhase
  currentMission?: Mission
  lastMissionResult?: MissionResult
  armorPlacements: ArmorPlacement[]
  advisor: {
    currentQuote: VCQuote
    confidence: number
    mode: 'biased' | 'correct'
  }
  showHiddenData: boolean
  missionCount: number
}

export class GameEngine {
  private biasEngine: BiasEngine
  private missionSystem: MissionSystem
  private state: GameState
  private listeners: Set<(state: GameState) => void> = new Set()

  constructor() {
    this.biasEngine = new BiasEngine()
    this.missionSystem = new MissionSystem(this.biasEngine)
    
    const initialQuote = VCAdvisor.generateQuote({
      armorRecommendations: [],
      confidence: 0,
      reasoning: "Welcome to the future of aviation consulting!"
    }, 'general')

    this.state = {
      phase: 'tutorial',
      armorPlacements: [],
      advisor: {
        currentQuote: initialQuote,
        confidence: 0,
        mode: 'biased'
      },
      showHiddenData: false,
      missionCount: 0
    }
  }

  getState(): GameState {
    return { ...this.state }
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.getState()))
  }

  setPhase(phase: GamePhase): void {
    this.state.phase = phase
    
    if (phase === 'graveyard') {
      this.state.showHiddenData = true
      this.state.advisor.mode = 'correct'
      this.updateAdvisorQuote('general')
    }
    
    this.notify()
  }

  addArmorPlacement(placement: ArmorPlacement): void {
    this.state.armorPlacements.push(placement)
    this.notify()
  }

  removeArmorPlacement(index: number): void {
    this.state.armorPlacements.splice(index, 1)
    this.notify()
  }

  clearArmorPlacements(): void {
    this.state.armorPlacements = []
    this.notify()
  }

  async launchMission(difficulty: number = 1, planeCount: number = 10): Promise<void> {
    const mission = this.missionSystem.createMission('bombing', difficulty, planeCount)
    this.state.currentMission = mission
    this.state.missionCount++
    this.notify()

    try {
      const result = await this.missionSystem.executeMission(
        mission.id, 
        this.state.armorPlacements.map(p => ({ x: p.x, y: p.y }))
      )
      
      this.state.lastMissionResult = result
      this.state.currentMission = undefined
      
      this.updateAdvisorAfterMission(result)
      this.setPhase('results')
    } catch (error) {
      console.error('Mission failed:', error)
      this.state.currentMission = undefined
      this.notify()
    }
  }

  private updateAdvisorAfterMission(result: MissionResult): void {
    const analysis = this.getBiasedAnalysis()
    
    if (result.survivors.length > 0) {
      this.updateAdvisorQuote('success')
    } else {
      this.updateAdvisorQuote('failure')
    }
    
    this.state.advisor.confidence = analysis.confidence
  }

  private updateAdvisorQuote(context: VCQuote['context']): void {
    const analysis = this.state.advisor.mode === 'biased' 
      ? this.getBiasedAnalysis() 
      : this.getCorrectAnalysis()
    
    this.state.advisor.currentQuote = VCAdvisor.generateQuote(analysis, context)
  }

  getBiasedAnalysis(): BiasAnalysis {
    return this.biasEngine.generateBiasedAnalysis()
  }

  getCorrectAnalysis(): BiasAnalysis {
    return this.biasEngine.generateCorrectAnalysis()
  }

  getStats() {
    return this.biasEngine.getStats()
  }

  getSurvivedPlanes() {
    return this.biasEngine.getSurvivedPlanes()
  }

  getCrashedPlanes() {
    return this.state.showHiddenData ? this.biasEngine.getCrashedPlanes() : []
  }

  generateSuccessStory(): string {
    return VCAdvisor.generateSuccessStory(this.biasEngine.getSurvivedPlanes().length)
  }

  generateFailureExcuse(): string {
    return VCAdvisor.generateFailureExcuse(this.biasEngine.getCrashedPlanes().length)
  }

  generatePivotSuggestion(): VCQuote {
    const stats = this.getStats()
    const failureRate = stats.crashed / (stats.crashed + stats.survived) || 0
    return VCAdvisor.generatePivotSuggestion(failureRate)
  }

  resetGame(): void {
    this.biasEngine.reset()
    this.state = {
      phase: 'tutorial',
      armorPlacements: [],
      advisor: {
        currentQuote: VCAdvisor.generateQuote({
          armorRecommendations: [],
          confidence: 0,
          reasoning: "Ready for a fresh start!"
        }, 'general'),
        confidence: 0,
        mode: 'biased'
      },
      showHiddenData: false,
      missionCount: 0
    }
    this.notify()
  }
}