# Survivorship Bias Plane Simulator - UI Implementation Plan

## Overview
Build a web-based game interface that demonstrates survivorship bias through an interactive plane armor recommendation system with satirical VC commentary.

## Stage 1: Core UI Architecture
**Goal**: Establish game state management and layout foundation
**Success Criteria**: 
- Game state flows between screens properly
- Layout adapts to different screen sizes
- Component architecture supports feature expansion
**Tests**: Can navigate between game phases, state persists correctly
**Status**: Not Started

### Components to Build:
- `GameEngine` - Central state management and game flow controller
- `GameLayout` - Main responsive layout container
- `GamePhases` - Navigation between analysis/mission/results phases

## Stage 2: Plane Visualization System  
**Goal**: Visual representation of planes and damage patterns
**Success Criteria**:
- Planes render with SVG/Canvas with damage points
- Damage visualization is clear and interactive
- Supports different plane types visually
**Tests**: Damage points appear correctly, plane types are distinguishable
**Status**: Not Started

### Components to Build:
- `PlaneRenderer` - SVG-based plane visualization
- `DamageOverlay` - Interactive damage point display
- `PlaneGallery` - Grid of survived planes for analysis

## Stage 3: VC Advisor Interface
**Goal**: Satirical advisor character with dynamic commentary
**Success Criteria**:
- Advisor appears with contextual quotes
- Confidence meter reflects analysis quality
- UI feels like a mock startup dashboard
**Tests**: Quotes change based on game state, advisor reacts to events
**Status**: Not Started

### Components to Build:
- `VCAdvisorPanel` - Main advisor interface with avatar/quotes
- `ConfidenceMeter` - Visual confidence indicator
- `QuoteDisplay` - Animated quote presentation
- `AdviceHistory` - Track of previous recommendations

## Stage 4: Mission Control & Analysis
**Goal**: Interactive mission launching and armor placement
**Success Criteria**:
- Can click to place armor on plane diagrams
- Mission parameters are configurable
- Results display clearly shows success/failure
**Tests**: Armor placement affects survival rates, missions execute correctly
**Status**: Not Started

### Components to Build:
- `ArmorPlacementTool` - Interactive armor positioning
- `MissionLauncher` - Mission configuration and launch
- `ResultsDisplay` - Mission outcome visualization
- `StatsPanel` - Current game statistics

## Stage 5: Hidden Truth & Polish
**Goal**: Reveal the survivorship bias and add game polish
**Success Criteria**:
- "Graveyard" view shows hidden crashed planes
- Tutorial explains the bias concept
- Game feels complete and educational
**Tests**: Hidden data reveals correctly, tutorial is clear
**Status**: Not Started

### Components to Build:
- `GraveyardView` - Hidden crash statistics
- `BiasReveal` - Educational explanation component
- `Tutorial` - Interactive game introduction
- `GameSummary` - End-game analysis and learning

## Technical Architecture

### State Management
```typescript
interface GameState {
  phase: 'tutorial' | 'analysis' | 'mission' | 'results' | 'graveyard'
  biasEngine: BiasEngine
  missionSystem: MissionSystem
  currentMission?: Mission
  armorPlacements: ArmorPlacement[]
  advisor: {
    currentQuote: VCQuote
    confidence: number
    mode: 'biased' | 'correct'
  }
}
```

### Component Hierarchy
```
GameEngine (state management)
├── GameLayout
│   ├── Header (game title, phase indicator)
│   ├── MainContent (phase-specific content)
│   │   ├── TutorialView
│   │   ├── AnalysisView
│   │   │   ├── PlaneGallery
│   │   │   ├── VCAdvisorPanel
│   │   │   └── ArmorPlacementTool
│   │   ├── MissionView
│   │   │   ├── MissionLauncher
│   │   │   └── LiveResults
│   │   ├── ResultsView
│   │   │   ├── ResultsDisplay
│   │   │   └── StatsPanel
│   │   └── GraveyardView
│   │       ├── CrashStatistics
│   │       └── BiasReveal
│   └── Sidebar
│       ├── PhaseNavigation
│       ├── QuickStats
│       └── AdviceHistory
```

### Styling Strategy
- **CSS Grid/Flexbox** for layouts
- **CSS Custom Properties** for theming
- **Animations** for plane movements, UI transitions
- **Responsive Design** mobile-first approach
- **Dark Theme** with aviation/military aesthetic

### Data Flow
1. User places armor → GameEngine updates armorPlacements
2. Launch mission → MissionSystem.executeMission()
3. Results → BiasEngine processes data
4. VCAdvisor generates new quotes
5. UI updates with new state

## Development Phases
1. **Phase 1-2**: Foundation (state + visualization) - 2-3 hours
2. **Phase 3-4**: Core gameplay (advisor + missions) - 3-4 hours  
3. **Phase 5**: Polish & education (graveyard + tutorial) - 2-3 hours

**Total Estimated Time**: 7-10 hours for intermediate developer

## Risk Mitigation
- Start with simple HTML/CSS, enhance with animations later
- Use existing game logic (already tested) 
- Build incrementally, test each component
- Fallback to simpler visualizations if SVG/Canvas proves complex