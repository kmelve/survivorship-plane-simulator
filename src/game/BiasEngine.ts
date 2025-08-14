import { Plane, DamagePoint } from './Plane.js'

export interface BiasAnalysis {
  armorRecommendations: ArmorPlacement[]
  confidence: number
  reasoning: string
}

export interface ArmorPlacement {
  x: number
  y: number
  priority: 'low' | 'medium' | 'high'
}

export class BiasEngine {
  private survivedPlanes: Plane[] = []
  private crashedPlanes: Plane[] = []

  addSurvivedPlane(plane: Plane): void {
    this.survivedPlanes.push(plane)
  }

  addCrashedPlane(plane: Plane): void {
    this.crashedPlanes.push(plane)
  }

  getSurvivedPlanes(): Plane[] {
    return [...this.survivedPlanes]
  }

  getCrashedPlanes(): Plane[] {
    return [...this.crashedPlanes]
  }

  generateBiasedAnalysis(): BiasAnalysis {
    if (this.survivedPlanes.length === 0) {
      return {
        armorRecommendations: [],
        confidence: 0,
        reasoning: "No data available yet. Send more planes!"
      }
    }

    const damageHeatmap = this.createDamageHeatmap(this.survivedPlanes)
    const recommendations = this.convertHeatmapToRecommendations(damageHeatmap)
    
    return {
      armorRecommendations: recommendations,
      confidence: Math.min(0.95, this.survivedPlanes.length * 0.1),
      reasoning: this.generateConfidentReasoning(recommendations.length)
    }
  }

  generateCorrectAnalysis(): BiasAnalysis {
    if (this.crashedPlanes.length === 0) {
      return {
        armorRecommendations: [],
        confidence: 0,
        reasoning: "Insufficient failure data for proper analysis"
      }
    }

    const criticalAreas = this.identifyCriticalAreas()
    
    return {
      armorRecommendations: criticalAreas,
      confidence: Math.min(0.99, this.crashedPlanes.length * 0.05),
      reasoning: "Based on analysis of failed missions, these areas are critical for survival"
    }
  }

  private createDamageHeatmap(planes: Plane[]): Map<string, number> {
    const heatmap = new Map<string, number>()
    
    planes.forEach(plane => {
      plane.damage.forEach(damage => {
        const key = `${Math.floor(damage.x / 10)}-${Math.floor(damage.y / 10)}`
        const weight = damage.severity === 'heavy' ? 3 : damage.severity === 'medium' ? 2 : 1
        heatmap.set(key, (heatmap.get(key) || 0) + weight)
      })
    })
    
    return heatmap
  }

  private convertHeatmapToRecommendations(heatmap: Map<string, number>): ArmorPlacement[] {
    const recommendations: ArmorPlacement[] = []
    
    heatmap.forEach((weight, key) => {
      const [x, y] = key.split('-').map(Number)
      recommendations.push({
        x: x * 10 + 5,
        y: y * 10 + 5,
        priority: weight > 5 ? 'high' : weight > 2 ? 'medium' : 'low'
      })
    })
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  private identifyCriticalAreas(): ArmorPlacement[] {
    const criticalZones: ArmorPlacement[] = [
      { x: 150, y: 100, priority: 'high' }, // Engine
      { x: 200, y: 120, priority: 'high' }, // Fuel tank
      { x: 180, y: 80, priority: 'medium' }, // Control surfaces
      { x: 120, y: 110, priority: 'medium' }, // Cockpit area
    ]
    
    return criticalZones
  }

  private generateConfidentReasoning(recommendationCount: number): string {
    const reasons = [
      `Based on ${this.survivedPlanes.length} successful missions, we've identified ${recommendationCount} key areas for armor enhancement.`,
      `Our data clearly shows patterns in the damage. These planes survived because they avoided critical hits!`,
      `With ${this.survivedPlanes.length} survivors analyzed, the pattern is unmistakable. Armor these damaged areas!`,
      `The evidence is right here - these ${this.survivedPlanes.length} planes made it back despite damage in these areas.`
    ]
    
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  getStats() {
    return {
      survived: this.survivedPlanes.length,
      crashed: this.crashedPlanes.length,
      survivalRate: this.survivedPlanes.length / (this.survivedPlanes.length + this.crashedPlanes.length) || 0
    }
  }

  reset(): void {
    this.survivedPlanes = []
    this.crashedPlanes = []
  }
}