import { describe, it, expect } from 'vitest'
import { VCAdvisor, type VCQuote } from './VCAdvisor.js'
import { type BiasAnalysis } from './BiasEngine.js'

describe('VCAdvisor', () => {
  const mockAnalysis: BiasAnalysis = {
    armorRecommendations: [
      { x: 100, y: 100, priority: 'high' }
    ],
    confidence: 0.75,
    reasoning: 'Test reasoning'
  }

  describe('generateQuote', () => {
    it('should generate quote with correct context and confidence', () => {
      const quote = VCAdvisor.generateQuote(mockAnalysis, 'success')
      
      expect(quote.context).toBe('success')
      expect(quote.confidence).toBe(0.75)
      expect(typeof quote.text).toBe('string')
      expect(quote.text.length).toBeGreaterThan(0)
    })

    it('should use general context by default', () => {
      const quote = VCAdvisor.generateQuote(mockAnalysis)
      
      expect(quote.context).toBe('general')
    })

    it('should generate different quotes for different contexts', () => {
      const successQuote = VCAdvisor.generateQuote(mockAnalysis, 'success')
      const failureQuote = VCAdvisor.generateQuote(mockAnalysis, 'failure')
      const pivotQuote = VCAdvisor.generateQuote(mockAnalysis, 'pivot')
      
      expect(successQuote.context).toBe('success')
      expect(failureQuote.context).toBe('failure')
      expect(pivotQuote.context).toBe('pivot')
      
      // Quotes should be contextually appropriate
      expect(successQuote.text).not.toBe(failureQuote.text)
    })

    it('should generate valid quotes for all contexts', () => {
      const contexts: VCQuote['context'][] = ['success', 'failure', 'pivot', 'general']
      
      contexts.forEach(context => {
        const quote = VCAdvisor.generateQuote(mockAnalysis, context)
        expect(quote.text).toBeTruthy()
        expect(quote.context).toBe(context)
      })
    })
  })

  describe('generateSuccessStory', () => {
    it('should include survivor count in story', () => {
      const story = VCAdvisor.generateSuccessStory(5)
      
      expect(story).toContain('5')
      expect(typeof story).toBe('string')
      expect(story.length).toBeGreaterThan(0)
    })

    it('should generate different stories for different counts', () => {
      const story1 = VCAdvisor.generateSuccessStory(3)
      const story2 = VCAdvisor.generateSuccessStory(7)
      
      expect(story1).toContain('3')
      expect(story2).toContain('7')
    })

    it('should handle zero survivors', () => {
      const story = VCAdvisor.generateSuccessStory(0)
      
      expect(story).toContain('0')
      expect(typeof story).toBe('string')
    })
  })

  describe('generateFailureExcuse', () => {
    it('should generate excuse for failures', () => {
      const excuse = VCAdvisor.generateFailureExcuse(10)
      
      expect(typeof excuse).toBe('string')
      expect(excuse.length).toBeGreaterThan(0)
    })

    it('should be different from success stories', () => {
      const excuse = VCAdvisor.generateFailureExcuse(5)
      const story = VCAdvisor.generateSuccessStory(5)
      
      expect(excuse).not.toBe(story)
    })

    it('should work with different crash counts', () => {
      const excuse1 = VCAdvisor.generateFailureExcuse(1)
      const excuse2 = VCAdvisor.generateFailureExcuse(100)
      
      expect(typeof excuse1).toBe('string')
      expect(typeof excuse2).toBe('string')
    })
  })

  describe('generatePivotSuggestion', () => {
    it('should suggest dramatic pivot for high failure rate', () => {
      const pivot = VCAdvisor.generatePivotSuggestion(0.9)
      
      expect(pivot.context).toBe('pivot')
      expect(pivot.confidence).toBeGreaterThan(0.8)
      expect(pivot.text).toBeTruthy()
    })

    it('should suggest moderate pivot for medium failure rate', () => {
      const pivot = VCAdvisor.generatePivotSuggestion(0.7)
      
      expect(pivot.context).toBe('pivot')
      expect(pivot.confidence).toBeGreaterThan(0.6)
      expect(pivot.confidence).toBeLessThanOrEqual(0.8)
    })

    it('should suggest iteration for low failure rate', () => {
      const pivot = VCAdvisor.generatePivotSuggestion(0.3)
      
      expect(pivot.context).toBe('general')
      expect(pivot.confidence).toBeLessThanOrEqual(0.6)
    })

    it('should handle edge cases', () => {
      const pivot0 = VCAdvisor.generatePivotSuggestion(0)
      const pivot1 = VCAdvisor.generatePivotSuggestion(1)
      
      expect(pivot0.text).toBeTruthy()
      expect(pivot1.text).toBeTruthy()
      expect(pivot1.context).toBe('pivot')
    })
  })

  describe('generateConfidenceStatement', () => {
    it('should show high confidence for high values', () => {
      const statement = VCAdvisor.generateConfidenceStatement(0.9)
      
      expect(statement).toContain('confident')
      expect(statement.toLowerCase()).toContain('confident')
    })

    it('should show uncertainty for low values', () => {
      const statement = VCAdvisor.generateConfidenceStatement(0.2)
      
      expect(statement.toLowerCase()).toContain('data')
    })

    it('should provide appropriate statements for all confidence levels', () => {
      const confidences = [0.1, 0.4, 0.7, 0.95]
      
      confidences.forEach(confidence => {
        const statement = VCAdvisor.generateConfidenceStatement(confidence)
        expect(typeof statement).toBe('string')
        expect(statement.length).toBeGreaterThan(0)
      })
    })

    it('should handle edge cases', () => {
      const statement0 = VCAdvisor.generateConfidenceStatement(0)
      const statement1 = VCAdvisor.generateConfidenceStatement(1)
      
      expect(typeof statement0).toBe('string')
      expect(typeof statement1).toBe('string')
    })
  })
})