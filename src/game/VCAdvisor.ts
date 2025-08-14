import { BiasAnalysis } from './BiasEngine.js'

export interface VCQuote {
  text: string
  context: 'success' | 'failure' | 'pivot' | 'general'
  confidence: number
}

export class VCAdvisor {
  private static quotes = {
    success: [
      "Just look at the data! These planes clearly know how to execute.",
      "Pattern recognition is everything. These survivors have cracked the code.",
      "You can't argue with results. These are our unicorn planes!",
      "The market has spoken - these configurations are product-market fit.",
      "This is what we call 'defensible differentiation' in the armor space."
    ],
    failure: [
      "They just didn't have the grit to push through the tough times.",
      "Probably a leadership issue. The pilot wasn't committed enough.",
      "Market timing is everything. They launched in the wrong window.",
      "Classic execution failure. The strategy was sound.",
      "They needed to pivot faster. Agility is key in this space.",
      "Not enough runway. Should have raised a bigger Series A."
    ],
    pivot: [
      "Maybe we should focus on pilot training instead of armor.",
      "Have we considered the route optimization play?",
      "Perhaps the real opportunity is in mission planning software.",
      "What if we disrupted the entire aviation space with AI?",
      "The future is obviously autonomous planes. Humans are the problem."
    ],
    general: [
      "In my experience backing 200+ aviation startups...",
      "When I was at McKinsey, we had a framework for this.",
      "The most successful planes I've seen have three key traits...",
      "It's all about the network effects in air superiority.",
      "You need to think 10x, not 10% better armor placement."
    ]
  }

  static generateQuote(analysis: BiasAnalysis, context: VCQuote['context'] = 'general'): VCQuote {
    const quotes = this.quotes[context]
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    
    return {
      text: randomQuote,
      context,
      confidence: analysis.confidence
    }
  }

  static generateSuccessStory(survivorCount: number): string {
    const stories = [
      `"I've seen ${survivorCount} planes make it back using this exact strategy. The data doesn't lie."`,
      `"In my portfolio, the top ${survivorCount} performing aircraft all shared these characteristics."`,
      `"This reminds me of when ${survivorCount} companies in my cohort all succeeded by following similar patterns."`,
      `"The pattern is clear - ${survivorCount} successful missions can't be wrong about armor placement."`
    ]
    
    return stories[Math.floor(Math.random() * stories.length)]
  }

  static generateFailureExcuse(crashCount: number): string {
    const excuses = [
      "Those pilots clearly didn't understand the vision.",
      "They probably deviated from the recommended flight path.",
      "Market conditions were obviously different for those missions.",
      "They needed better co-founders... I mean, co-pilots.",
      "Classic case of premature scaling. Should have started with cargo runs.",
      "They didn't have the right advisory board. Need more aviation experts."
    ]
    
    return excuses[Math.floor(Math.random() * excuses.length)]
  }

  static generatePivotSuggestion(failureRate: number): VCQuote {
    if (failureRate > 0.8) {
      return {
        text: "Maybe we're thinking about this all wrong. What if the real opportunity is in parachute technology?",
        context: 'pivot',
        confidence: 0.9
      }
    } else if (failureRate > 0.6) {
      return {
        text: "Have we considered the subscription model? Armor-as-a-Service could be huge.",
        context: 'pivot',
        confidence: 0.7
      }
    } else {
      return {
        text: "We just need to iterate faster. More A/B testing on armor configurations.",
        context: 'general',
        confidence: 0.5
      }
    }
  }

  static generateConfidenceStatement(confidence: number): string {
    if (confidence > 0.8) {
      return "I'm extremely confident in this analysis. The data is bulletproof."
    } else if (confidence > 0.6) {
      return "The trends are becoming clear. We're seeing strong signals in the data."
    } else if (confidence > 0.3) {
      return "Early indicators suggest this approach has potential."
    } else {
      return "We need more data points, but I'm seeing some interesting patterns."
    }
  }
}