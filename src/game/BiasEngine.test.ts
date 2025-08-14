import { describe, it, expect, beforeEach } from 'vitest'
import { BiasEngine } from './BiasEngine.js'
import { PlaneFactory } from './Plane.js'

describe('BiasEngine', () => {
  let biasEngine: BiasEngine

  beforeEach(() => {
    biasEngine = new BiasEngine()
  })

  describe('plane management', () => {
    it('should track survived planes', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      PlaneFactory.markSurvived(plane)
      
      biasEngine.addSurvivedPlane(plane)
      
      expect(biasEngine.getSurvivedPlanes()).toHaveLength(1)
      expect(biasEngine.getSurvivedPlanes()[0]).toEqual(plane)
    })

    it('should track crashed planes', () => {
      const plane = PlaneFactory.createPlane('bomber', 'mission-1')
      
      biasEngine.addCrashedPlane(plane)
      
      expect(biasEngine.getCrashedPlanes()).toHaveLength(1)
      expect(biasEngine.getCrashedPlanes()[0]).toEqual(plane)
    })

    it('should return copies of plane arrays', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      biasEngine.addSurvivedPlane(plane)
      
      const survived = biasEngine.getSurvivedPlanes()
      survived.push(PlaneFactory.createPlane('bomber', 'mission-2'))
      
      expect(biasEngine.getSurvivedPlanes()).toHaveLength(1)
    })
  })

  describe('generateBiasedAnalysis', () => {
    it('should return empty analysis when no data', () => {
      const analysis = biasEngine.generateBiasedAnalysis()
      
      expect(analysis.armorRecommendations).toHaveLength(0)
      expect(analysis.confidence).toBe(0)
      expect(analysis.reasoning).toContain('No data available')
    })

    it('should generate recommendations based on survived plane damage', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      PlaneFactory.addDamage(plane, 150, 100, 'heavy')
      PlaneFactory.markSurvived(plane)
      
      biasEngine.addSurvivedPlane(plane)
      const analysis = biasEngine.generateBiasedAnalysis()
      
      expect(analysis.armorRecommendations.length).toBeGreaterThan(0)
      expect(analysis.confidence).toBeGreaterThan(0)
      expect(analysis.reasoning).toContain('successful')
    })

    it('should increase confidence with more survived planes', () => {
      const plane1 = PlaneFactory.createPlane('fighter', 'mission-1')
      const plane2 = PlaneFactory.createPlane('bomber', 'mission-1')
      
      PlaneFactory.addDamage(plane1, 100, 100, 'medium')
      PlaneFactory.addDamage(plane2, 200, 150, 'light')
      PlaneFactory.markSurvived(plane1)
      PlaneFactory.markSurvived(plane2)
      
      biasEngine.addSurvivedPlane(plane1)
      const analysis1 = biasEngine.generateBiasedAnalysis()
      
      biasEngine.addSurvivedPlane(plane2)
      const analysis2 = biasEngine.generateBiasedAnalysis()
      
      expect(analysis2.confidence).toBeGreaterThan(analysis1.confidence)
    })

    it('should prioritize high-damage areas', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      PlaneFactory.addDamage(plane, 150, 100, 'heavy')
      PlaneFactory.addDamage(plane, 150, 100, 'heavy')
      PlaneFactory.addDamage(plane, 200, 200, 'light')
      PlaneFactory.markSurvived(plane)
      
      biasEngine.addSurvivedPlane(plane)
      const analysis = biasEngine.generateBiasedAnalysis()
      
      expect(analysis.armorRecommendations[0].priority).toBe('high')
    })
  })

  describe('generateCorrectAnalysis', () => {
    it('should return empty analysis when no crash data', () => {
      const analysis = biasEngine.generateCorrectAnalysis()
      
      expect(analysis.armorRecommendations).toHaveLength(0)
      expect(analysis.confidence).toBe(0)
      expect(analysis.reasoning).toContain('Insufficient failure data')
    })

    it('should identify critical areas based on crashes', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      PlaneFactory.addDamage(plane, 150, 100, 'heavy') // Engine area
      
      biasEngine.addCrashedPlane(plane)
      const analysis = biasEngine.generateCorrectAnalysis()
      
      expect(analysis.armorRecommendations.length).toBeGreaterThan(0)
      expect(analysis.reasoning).toContain('critical for survival')
    })

    it('should include known critical areas', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      biasEngine.addCrashedPlane(plane)
      
      const analysis = biasEngine.generateCorrectAnalysis()
      
      const hasEngineProtection = analysis.armorRecommendations.some(rec => 
        rec.x === 150 && rec.y === 100
      )
      expect(hasEngineProtection).toBe(true)
    })
  })

  describe('getStats', () => {
    it('should calculate survival rate correctly', () => {
      const survivor = PlaneFactory.createPlane('fighter', 'mission-1')
      const casualty = PlaneFactory.createPlane('bomber', 'mission-1')
      
      PlaneFactory.markSurvived(survivor)
      
      biasEngine.addSurvivedPlane(survivor)
      biasEngine.addCrashedPlane(casualty)
      
      const stats = biasEngine.getStats()
      
      expect(stats.survived).toBe(1)
      expect(stats.crashed).toBe(1)
      expect(stats.survivalRate).toBe(0.5)
    })

    it('should handle no planes case', () => {
      const stats = biasEngine.getStats()
      
      expect(stats.survived).toBe(0)
      expect(stats.crashed).toBe(0)
      expect(stats.survivalRate).toBe(0)
    })
  })

  describe('reset', () => {
    it('should clear all plane data', () => {
      const survivor = PlaneFactory.createPlane('fighter', 'mission-1')
      const casualty = PlaneFactory.createPlane('bomber', 'mission-1')
      
      biasEngine.addSurvivedPlane(survivor)
      biasEngine.addCrashedPlane(casualty)
      
      biasEngine.reset()
      
      expect(biasEngine.getSurvivedPlanes()).toHaveLength(0)
      expect(biasEngine.getCrashedPlanes()).toHaveLength(0)
      
      const stats = biasEngine.getStats()
      expect(stats.survived).toBe(0)
      expect(stats.crashed).toBe(0)
    })
  })
})