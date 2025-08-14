export interface DamagePoint {
  x: number
  y: number
  severity: 'light' | 'medium' | 'heavy'
}

export interface Plane {
  id: string
  type: 'fighter' | 'bomber' | 'transport'
  survived: boolean
  damage: DamagePoint[]
  missionId: string
  returnTime?: number
}

export class PlaneFactory {
  private static planeCounter = 0

  static createPlane(type: Plane['type'], missionId: string): Plane {
    return {
      id: `plane-${++this.planeCounter}`,
      type,
      survived: false,
      damage: [],
      missionId,
    }
  }

  static addDamage(plane: Plane, x: number, y: number, severity: DamagePoint['severity']): void {
    plane.damage.push({ x, y, severity })
  }

  static markSurvived(plane: Plane): void {
    plane.survived = true
    plane.returnTime = Date.now()
  }
}