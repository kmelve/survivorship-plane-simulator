import { GameEngine, type GameState, type GamePhase } from '../GameEngine.js'

export class GameLayout {
  private gameEngine: GameEngine
  private container: HTMLElement
  private unsubscribe?: () => void

  constructor(gameEngine: GameEngine, container: HTMLElement) {
    this.gameEngine = gameEngine
    this.container = container
  }

  mount(): void {
    this.render()
    this.unsubscribe = this.gameEngine.subscribe(() => this.render())
  }

  unmount(): void {
    this.unsubscribe?.()
  }

  private render(): void {
    const state = this.gameEngine.getState()
    
    this.container.innerHTML = `
      <div class="game-layout">
        <header class="game-header">
          <h1 class="game-title">
            <span class="title-main">Survivorship Bias</span>
            <span class="title-sub">Plane Simulator</span>
          </h1>
          <div class="phase-indicator">
            ${this.renderPhaseIndicator(state.phase)}
          </div>
        </header>
        
        <div class="game-content">
          <main class="main-content">
            ${this.renderMainContent(state)}
          </main>
          
          <aside class="sidebar">
            ${this.renderSidebar(state)}
          </aside>
        </div>
      </div>
    `

    this.attachEventListeners(state)
  }

  private renderPhaseIndicator(currentPhase: GamePhase): string {
    const phases: { id: GamePhase; label: string; unlocked: boolean }[] = [
      { id: 'tutorial', label: 'Tutorial', unlocked: true },
      { id: 'analysis', label: 'Analysis', unlocked: true },
      { id: 'mission', label: 'Mission', unlocked: true },
      { id: 'results', label: 'Results', unlocked: this.gameEngine.getState().lastMissionResult !== undefined },
      { id: 'graveyard', label: 'Truth', unlocked: this.gameEngine.getStats().crashed > 0 }
    ]

    return phases.map(phase => `
      <button 
        class="phase-btn ${phase.id === currentPhase ? 'active' : ''} ${phase.unlocked ? '' : 'disabled'}"
        data-phase="${phase.id}"
        ${phase.unlocked ? '' : 'disabled'}
      >
        ${phase.label}
      </button>
    `).join('')
  }

  private renderMainContent(state: GameState): string {
    switch (state.phase) {
      case 'tutorial':
        return this.renderTutorial()
      case 'analysis':
        return this.renderAnalysis(state)
      case 'mission':
        return this.renderMission(state)
      case 'results':
        return this.renderResults(state)
      case 'graveyard':
        return this.renderGraveyard(state)
      default:
        return '<div>Unknown phase</div>'
    }
  }

  private renderTutorial(): string {
    return `
      <div class="tutorial-view">
        <div class="tutorial-content">
          <h2>Welcome to Survivorship Bias Plane Simulator</h2>
          <div class="tutorial-section">
            <h3>Your Mission</h3>
            <p>You're a hotshot aviation consultant hired to analyze WWII bomber damage patterns and recommend armor placement for future missions.</p>
          </div>
          
          <div class="tutorial-section">
            <h3>How to Play</h3>
            <ol>
              <li><strong>Analyze</strong> - Study damaged planes that returned from missions</li>
              <li><strong>Recommend</strong> - Place armor where you see damage patterns</li>
              <li><strong>Launch</strong> - Send new missions with your armor configuration</li>
              <li><strong>Learn</strong> - Discover the hidden truth about survivorship bias</li>
            </ol>
          </div>
          
          <div class="tutorial-section">
            <h3>The Challenge</h3>
            <p>Can you figure out the optimal armor placement? Or will you fall victim to one of the most common cognitive biases in data analysis?</p>
          </div>
          
          <button class="start-btn" data-action="start-game">
            Start Analyzing Data →
          </button>
        </div>
      </div>
    `
  }

  private renderAnalysis(state: GameState): string {
    const survivedPlanes = this.gameEngine.getSurvivedPlanes()
    
    return `
      <div class="analysis-view">
        <div class="analysis-header">
          <h2>Damage Pattern Analysis</h2>
          <p>Analyzing ${survivedPlanes.length} planes that successfully returned from missions</p>
        </div>
        
        <div class="analysis-content">
          <div class="plane-gallery" id="plane-gallery">
            ${this.renderPlaneGallery(survivedPlanes)}
          </div>
          
          <div class="armor-placement" id="armor-placement">
            ${this.renderArmorPlacement(state)}
          </div>
        </div>
        
        <div class="analysis-actions">
          <button class="launch-mission-btn" data-action="go-to-mission">
            Launch Mission with Current Armor →
          </button>
        </div>
      </div>
    `
  }

  private renderMission(state: GameState): string {
    if (state.currentMission) {
      return `
        <div class="mission-view">
          <div class="mission-active">
            <h2>Mission in Progress...</h2>
            <div class="mission-spinner"></div>
            <p>Planes are currently engaged in combat operations.</p>
            <p>Mission ID: ${state.currentMission.id}</p>
          </div>
        </div>
      `
    }

    return `
      <div class="mission-view">
        <div class="mission-setup">
          <h2>Mission Configuration</h2>
          
          <div class="mission-params">
            <div class="param-group">
              <label for="difficulty">Mission Difficulty:</label>
              <select id="difficulty">
                <option value="1">Easy - Training Run</option>
                <option value="2" selected>Medium - Standard Operation</option>
                <option value="3">Hard - Deep Territory</option>
                <option value="4">Extreme - Suicide Mission</option>
              </select>
            </div>
            
            <div class="param-group">
              <label for="plane-count">Number of Planes:</label>
              <select id="plane-count">
                <option value="5">5 planes</option>
                <option value="10" selected>10 planes</option>
                <option value="15">15 planes</option>
                <option value="20">20 planes</option>
              </select>
            </div>
          </div>
          
          <div class="armor-summary">
            <h3>Current Armor Configuration</h3>
            <p>${state.armorPlacements.length} armor pieces placed</p>
            ${state.armorPlacements.length === 0 ? '<p class="warning">⚠️ No armor placed - planes will be vulnerable!</p>' : ''}
          </div>
          
          <button class="launch-btn" data-action="launch-mission">
            🚀 Launch Mission
          </button>
        </div>
      </div>
    `
  }

  private renderResults(state: GameState): string {
    if (!state.lastMissionResult) {
      return '<div>No mission results available</div>'
    }

    const result = state.lastMissionResult
    const stats = this.gameEngine.getStats()
    
    return `
      <div class="results-view">
        <div class="results-header">
          <h2>Mission Results</h2>
          <div class="results-summary">
            <div class="result-stat">
              <span class="stat-number survivors">${result.survivors.length}</span>
              <span class="stat-label">Survived</span>
            </div>
            <div class="result-stat">
              <span class="stat-number casualties">${result.casualties.length}</span>
              <span class="stat-label">Lost</span>
            </div>
            <div class="result-stat">
              <span class="stat-number">${Math.round(result.survivors.length / result.mission.planeCount * 100)}%</span>
              <span class="stat-label">Success Rate</span>
            </div>
          </div>
        </div>
        
        <div class="results-content">
          <div class="survived-planes">
            <h3>Planes That Made It Back</h3>
            <div class="plane-gallery">
              ${this.renderPlaneGallery(result.survivors)}
            </div>
          </div>
        </div>
        
        <div class="results-actions">
          <button class="analyze-again-btn" data-action="analyze-again">
            📊 Analyze New Data
          </button>
          ${stats.crashed > 0 ? `
            <button class="reveal-truth-btn" data-action="reveal-truth">
              🔍 What Really Happened?
            </button>
          ` : ''}
        </div>
      </div>
    `
  }

  private renderGraveyard(_state: GameState): string {
    const crashedPlanes = this.gameEngine.getCrashedPlanes()
    
    return `
      <div class="graveyard-view">
        <div class="graveyard-header">
          <h2>The Hidden Truth</h2>
          <p class="bias-explanation">
            You've been analyzing only the planes that <em>survived</em>. 
            Here's what you couldn't see - the ${crashedPlanes.length} planes that never made it back.
          </p>
        </div>
        
        <div class="bias-reveal">
          <div class="crashed-planes">
            <h3>The Silent Evidence (${crashedPlanes.length} planes)</h3>
            <div class="plane-gallery graveyard">
              ${this.renderPlaneGallery(crashedPlanes, true)}
            </div>
          </div>
          
          <div class="correct-analysis">
            <h3>The Correct Analysis</h3>
            ${this.renderCorrectAnalysis()}
          </div>
        </div>
        
        <div class="lesson">
          <h3>The Survivorship Bias Lesson</h3>
          <p>
            During WWII, Abraham Wald figured this out: bullet holes in returning planes showed where a plane 
            <em>could</em> be hit and still fly. The places without holes were the critical areas - 
            because planes hit there didn't come back to be counted.
          </p>
          <p>
            You fell for the same trap that catches entrepreneurs, investors, and analysts every day: 
            only looking at the "successful" examples while ignoring the failures.
          </p>
        </div>
        
        <div class="graveyard-actions">
          <button class="reset-btn" data-action="reset-game">
            🔄 Try Again (With This Knowledge)
          </button>
        </div>
      </div>
    `
  }

  private renderSidebar(state: GameState): string {
    return `
      <div class="sidebar-content">
        ${this.renderVCAdvisor(state)}
        ${this.renderQuickStats(state)}
      </div>
    `
  }

  private renderVCAdvisor(state: GameState): string {
    const quote = state.advisor.currentQuote
    const confidence = Math.round(state.advisor.confidence * 100)
    
    return `
      <div class="vc-advisor">
        <div class="advisor-header">
          <div class="advisor-avatar">💼</div>
          <div class="advisor-info">
            <h3>Chad Ventura</h3>
            <p>Aviation Consultant & Former McKinsey Partner</p>
          </div>
        </div>
        
        <div class="confidence-meter">
          <div class="confidence-label">Confidence Level</div>
          <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${confidence}%"></div>
          </div>
          <div class="confidence-value">${confidence}%</div>
        </div>
        
        <div class="quote-display">
          <blockquote>
            "${quote.text}"
          </blockquote>
          <div class="quote-context">#${quote.context}</div>
        </div>
      </div>
    `
  }

  private renderQuickStats(state: GameState): string {
    const stats = this.gameEngine.getStats()
    
    return `
      <div class="quick-stats">
        <h3>Mission Statistics</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">${stats.survived}</span>
            <span class="stat-label">Survivors</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${state.showHiddenData ? stats.crashed : '?'}</span>
            <span class="stat-label">Losses</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${state.missionCount}</span>
            <span class="stat-label">Missions</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${state.armorPlacements.length}</span>
            <span class="stat-label">Armor Pieces</span>
          </div>
        </div>
      </div>
    `
  }

  private renderPlaneGallery(planes: any[], isGraveyard = false): string {
    if (planes.length === 0) {
      return '<div class="no-planes">No planes to display</div>'
    }

    return planes.slice(0, 8).map((plane) => `
      <div class="plane-card ${isGraveyard ? 'crashed' : ''}">
        <div class="plane-diagram">
          ${this.renderPlaneSVG(plane, isGraveyard)}
        </div>
        <div class="plane-info">
          <div class="plane-id">${plane.id}</div>
          <div class="plane-type">${plane.type}</div>
          <div class="damage-count">${plane.damage.length} hits</div>
        </div>
      </div>
    `).join('')
  }

  private renderPlaneSVG(plane: any, isGraveyard = false): string {
    const damagePoints = plane.damage.map((d: any) => `
      <circle 
        cx="${d.x}" 
        cy="${d.y}" 
        r="${d.severity === 'heavy' ? 6 : d.severity === 'medium' ? 4 : 2}"
        class="damage-point ${d.severity}"
        fill="${d.severity === 'heavy' ? '#ff4444' : d.severity === 'medium' ? '#ff8844' : '#ffaa44'}"
      />
    `).join('')

    return `
      <svg width="200" height="120" viewBox="0 0 200 120">
        <!-- Plane outline -->
        <path d="M 20 60 L 180 60 L 170 45 L 160 30 L 140 25 L 60 25 L 40 30 L 30 45 Z" 
              fill="${isGraveyard ? '#666' : '#d0d0d0'}" 
              stroke="${isGraveyard ? '#333' : '#999'}" 
              stroke-width="2"/>
        <!-- Wings -->
        <path d="M 80 25 L 80 10 L 120 10 L 120 25" 
              fill="${isGraveyard ? '#666' : '#d0d0d0'}" 
              stroke="${isGraveyard ? '#333' : '#999'}" 
              stroke-width="2"/>
        <path d="M 80 95 L 80 110 L 120 110 L 120 95" 
              fill="${isGraveyard ? '#666' : '#d0d0d0'}" 
              stroke="${isGraveyard ? '#333' : '#999'}" 
              stroke-width="2"/>
        
        ${damagePoints}
      </svg>
    `
  }

  private renderArmorPlacement(state: GameState): string {
    return `
      <div class="armor-placement-section">
        <h3>Armor Placement</h3>
        <p>Click on the plane diagram below to place armor pieces</p>
        
        <div class="armor-canvas" id="armor-canvas">
          <svg width="300" height="180" viewBox="0 0 300 180">
            <!-- Plane outline for armor placement -->
            <path d="M 30 90 L 270 90 L 255 67 L 240 45 L 210 37 L 90 37 L 60 45 L 45 67 Z" 
                  fill="#f0f0f0" 
                  stroke="#999" 
                  stroke-width="2"/>
            <!-- Wings -->
            <path d="M 120 37 L 120 15 L 180 15 L 180 37" 
                  fill="#f0f0f0" 
                  stroke="#999" 
                  stroke-width="2"/>
            <path d="M 120 143 L 120 165 L 180 165 L 180 143" 
                  fill="#f0f0f0" 
                  stroke="#999" 
                  stroke-width="2"/>
            
            ${state.armorPlacements.map((armor, index) => `
              <circle 
                cx="${armor.x}" 
                cy="${armor.y}" 
                r="8"
                class="armor-piece ${armor.priority}"
                fill="${armor.priority === 'high' ? '#00aa00' : armor.priority === 'medium' ? '#aaaa00' : '#aa8800'}"
                stroke="#333"
                stroke-width="2"
                data-armor-index="${index}"
              />
            `).join('')}
          </svg>
        </div>
        
        <div class="armor-controls">
          <button class="clear-armor-btn" data-action="clear-armor">Clear All Armor</button>
          <div class="armor-count">
            ${state.armorPlacements.length} pieces placed
          </div>
        </div>
      </div>
    `
  }

  private renderCorrectAnalysis(): string {
    const correctAnalysis = this.gameEngine.getCorrectAnalysis()
    
    return `
      <div class="correct-analysis-content">
        <p><strong>Critical Areas to Protect:</strong></p>
        <ul>
          ${correctAnalysis.armorRecommendations.map(rec => `
            <li>Position (${rec.x}, ${rec.y}) - ${rec.priority} priority</li>
          `).join('')}
        </ul>
        <p class="analysis-reasoning">${correctAnalysis.reasoning}</p>
      </div>
    `
  }

  private attachEventListeners(_state: GameState): void {
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const action = target.dataset.action

      switch (action) {
        case 'start-game':
          this.gameEngine.setPhase('analysis')
          break
        case 'go-to-mission':
          this.gameEngine.setPhase('mission')
          break
        case 'launch-mission':
          this.handleLaunchMission()
          break
        case 'analyze-again':
          this.gameEngine.setPhase('analysis')
          break
        case 'reveal-truth':
          this.gameEngine.setPhase('graveyard')
          break
        case 'reset-game':
          this.gameEngine.resetGame()
          break
        case 'clear-armor':
          this.gameEngine.clearArmorPlacements()
          break
      }

      const phase = target.dataset.phase as GamePhase
      if (phase && !(target as HTMLButtonElement).disabled) {
        this.gameEngine.setPhase(phase)
      }

      if (target.classList.contains('armor-piece')) {
        const index = parseInt(target.dataset.armorIndex || '0')
        this.gameEngine.removeArmorPlacement(index)
      }
    })

    const armorCanvas = this.container.querySelector('#armor-canvas svg')
    if (armorCanvas) {
      armorCanvas.addEventListener('click', (e) => {
        const mouseEvent = e as MouseEvent
        const rect = armorCanvas.getBoundingClientRect()
        const x = ((mouseEvent.clientX - rect.left) / rect.width) * 300
        const y = ((mouseEvent.clientY - rect.top) / rect.height) * 180
        
        this.gameEngine.addArmorPlacement({
          x: Math.round(x),
          y: Math.round(y),
          priority: 'medium'
        })
      })
    }
  }

  private handleLaunchMission(): void {
    const difficultySelect = this.container.querySelector('#difficulty') as HTMLSelectElement
    const planeCountSelect = this.container.querySelector('#plane-count') as HTMLSelectElement
    
    const difficulty = parseInt(difficultySelect?.value || '2')
    const planeCount = parseInt(planeCountSelect?.value || '10')
    
    this.gameEngine.launchMission(difficulty, planeCount)
  }
}