import { describe, it, expect, beforeEach } from 'vitest'
import { PlaneFactory } from './Plane.js'

describe('PlaneFactory', () => {
  beforeEach(() => {
    // Reset counter for predictable test results
    (PlaneFactory as any).planeCounter = 0
  })

  describe('createPlane', () => {
    it('should create a plane with unique ID and correct properties', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      
      expect(plane).toEqual({
        id: 'plane-1',
        type: 'fighter',
        survived: false,
        damage: [],
        missionId: 'mission-1'
      })
    })

    it('should increment plane IDs for each new plane', () => {
      const plane1 = PlaneFactory.createPlane('bomber', 'mission-1')
      const plane2 = PlaneFactory.createPlane('transport', 'mission-2')
      
      expect(plane1.id).toBe('plane-1')
      expect(plane2.id).toBe('plane-2')
    })

    it('should support all plane types', () => {
      const fighter = PlaneFactory.createPlane('fighter', 'mission-1')
      const bomber = PlaneFactory.createPlane('bomber', 'mission-1')
      const transport = PlaneFactory.createPlane('transport', 'mission-1')
      
      expect(fighter.type).toBe('fighter')
      expect(bomber.type).toBe('bomber')
      expect(transport.type).toBe('transport')
    })
  })

  describe('addDamage', () => {
    it('should add damage point to plane', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      
      PlaneFactory.addDamage(plane, 100, 50, 'medium')
      
      expect(plane.damage).toHaveLength(1)
      expect(plane.damage[0]).toEqual({
        x: 100,
        y: 50,
        severity: 'medium'
      })
    })

    it('should add multiple damage points', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      
      PlaneFactory.addDamage(plane, 100, 50, 'light')
      PlaneFactory.addDamage(plane, 200, 75, 'heavy')
      
      expect(plane.damage).toHaveLength(2)
      expect(plane.damage[1]).toEqual({
        x: 200,
        y: 75,
        severity: 'heavy'
      })
    })

    it('should support all damage severities', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      
      PlaneFactory.addDamage(plane, 0, 0, 'light')
      PlaneFactory.addDamage(plane, 1, 1, 'medium')
      PlaneFactory.addDamage(plane, 2, 2, 'heavy')
      
      expect(plane.damage[0].severity).toBe('light')
      expect(plane.damage[1].severity).toBe('medium')
      expect(plane.damage[2].severity).toBe('heavy')
    })
  })

  describe('markSurvived', () => {
    it('should mark plane as survived', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      
      PlaneFactory.markSurvived(plane)
      
      expect(plane.survived).toBe(true)
      expect(plane.returnTime).toBeTypeOf('number')
      expect(plane.returnTime).toBeGreaterThan(0)
    })

    it('should set return time when marking as survived', () => {
      const plane = PlaneFactory.createPlane('fighter', 'mission-1')
      const beforeTime = Date.now()
      
      PlaneFactory.markSurvived(plane)
      
      const afterTime = Date.now()
      expect(plane.returnTime).toBeGreaterThanOrEqual(beforeTime)
      expect(plane.returnTime).toBeLessThanOrEqual(afterTime)
    })
  })
})