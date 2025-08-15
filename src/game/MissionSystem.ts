import { type Plane, PlaneFactory, type DamagePoint } from './Plane.js'
import { BiasEngine } from './BiasEngine.js'

export interface Mission {
  id: string
  type: 'reconnaissance' | 'bombing' | 'escort'
  difficulty: number
  planeCount: number
  status: 'pending' | 'active' | 'completed'
}

export interface MissionResult {
  mission: Mission
  survivors: Plane[]
  casualties: Plane[]
  duration: number
}

export class MissionSystem {
  private missionCounter = 0
  private activeMissions = new Map<string, Mission>()
  private biasEngine: BiasEngine

  constructor(biasEngine: BiasEngine) {
    this.biasEngine = biasEngine
  }

  createMission(type: Mission['type'], difficulty: number, planeCount: number): Mission {
    const mission: Mission = {
      id: `mission-${++this.missionCounter}`,
      type,
      difficulty,
      planeCount,
      status: 'pending'
    }
    
    this.activeMissions.set(mission.id, mission)
    return mission
  }

  async executeMission(missionId: string, armorPlacements: Array<{x: number, y: number}>): Promise<MissionResult> {
    const mission = this.activeMissions.get(missionId)
    if (!mission) {
      throw new Error(`Mission ${missionId} not found`)
    }

    mission.status = 'active'
    const startTime = Date.now()

    const planes = this.generatePlanes(mission)
    const { survivors, casualties } = this.simulateCombat(planes, mission, armorPlacements)

    survivors.forEach(plane => this.biasEngine.addSurvivedPlane(plane))
    casualties.forEach(plane => this.biasEngine.addCrashedPlane(plane))

    mission.status = 'completed'
    const duration = Date.now() - startTime

    const result: MissionResult = {
      mission,
      survivors,
      casualties,
      duration
    }

    this.activeMissions.delete(missionId)
    return result
  }

  private generatePlanes(mission: Mission): Plane[] {
    const planes: Plane[] = []
    
    for (let i = 0; i < mission.planeCount; i++) {
      const planeTypes: Plane['type'][] = ['fighter', 'bomber', 'transport']
      const randomType = planeTypes[Math.floor(Math.random() * planeTypes.length)]
      const plane = PlaneFactory.createPlane(randomType, mission.id)
      planes.push(plane)
    }
    
    return planes
  }

  private simulateCombat(planes: Plane[], mission: Mission, armorPlacements: Array<{x: number, y: number}>): {survivors: Plane[], casualties: Plane[]} {
    const survivors: Plane[] = []
    const casualties: Plane[] = []

    planes.forEach(plane => {
      const survivalChance = this.calculateSurvivalChance(plane, mission, armorPlacements)
      const survived = Math.random() < survivalChance

      if (survived) {
        this.addRandomDamage(plane, mission.difficulty)
        PlaneFactory.markSurvived(plane)
        survivors.push(plane)
      } else {
        this.addFatalDamage(plane, armorPlacements)
        casualties.push(plane)
      }
    })

    return { survivors, casualties }
  }

  private calculateSurvivalChance(plane: Plane, mission: Mission, armorPlacements: Array<{x: number, y: number}>): number {
    let baseSurvival = 0.3

    if (plane.type === 'fighter') baseSurvival += 0.2
    if (plane.type === 'transport') baseSurvival -= 0.1

    baseSurvival -= mission.difficulty * 0.15

    const criticalAreas = [
      { x: 150, y: 100, importance: 0.4 }, // Engine
      { x: 200, y: 120, importance: 0.3 }, // Fuel tank
      { x: 180, y: 80, importance: 0.2 },  // Control surfaces
      { x: 120, y: 110, importance: 0.1 }  // Cockpit
    ]

    let armorBonus = 0
    criticalAreas.forEach(critical => {
      const isProtected = armorPlacements.some(armor => 
        Math.abs(armor.x - critical.x) < 20 && Math.abs(armor.y - critical.y) < 20
      )
      if (isProtected) {
        armorBonus += critical.importance * 0.5
      }
    })

    return Math.min(0.95, Math.max(0.05, baseSurvival + armorBonus))
  }

  private addRandomDamage(plane: Plane, difficulty: number): void {
    const damageCount = Math.floor(Math.random() * (difficulty + 1)) + 1
    
    for (let i = 0; i < damageCount; i++) {
      const x = Math.random() * 300
      const y = Math.random() * 200
      const severityRoll = Math.random()
      const severity: DamagePoint['severity'] = 
        severityRoll < 0.6 ? 'light' : 
        severityRoll < 0.9 ? 'medium' : 'heavy'
      
      PlaneFactory.addDamage(plane, x, y, severity)
    }
  }

  private addFatalDamage(plane: Plane, armorPlacements: Array<{x: number, y: number}>): void {
    const criticalHits = [
      { x: 150, y: 100 }, // Engine
      { x: 200, y: 120 }, // Fuel tank
      { x: 180, y: 80 },  // Control surfaces
    ]

    const unprotectedCritical = criticalHits.find(critical => 
      !armorPlacements.some(armor => 
        Math.abs(armor.x - critical.x) < 20 && Math.abs(armor.y - critical.y) < 20
      )
    )

    if (unprotectedCritical) {
      PlaneFactory.addDamage(plane, unprotectedCritical.x, unprotectedCritical.y, 'heavy')
    }

    this.addRandomDamage(plane, 2)
  }

  getActiveMissions(): Mission[] {
    return Array.from(this.activeMissions.values())
  }

  getMissionHistory(): Mission[] {
    return []
  }
}