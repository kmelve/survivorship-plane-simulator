# Survivorship Bias Plane Simulator

A satirical web game that demonstrates survivorship bias through interactive WWII airplane armor analysis, complete with overconfident VC advisor commentary.

🎮 **[Play the Game](https://github.com/kmelve/survivorship-plane-simulator)** | 📖 **[Learn About Survivorship Bias](https://en.wikipedia.org/wiki/Survivorship_bias)**

## What is Survivorship Bias?

During WWII, the military wanted to add armor to planes but had limited weight capacity. They analyzed returning damaged aircraft to see where to place armor. The obvious choice? Armor the areas with the most bullet holes.

**But statistician Abraham Wald had a crucial insight**: The bullet holes showed where a plane *could* be hit and *still return*. The planes hit in other areas never came back to be analyzed.

This is **survivorship bias** - drawing conclusions from "successful" examples while ignoring the failures that didn't make it into your dataset.

## The Game Experience

### 🎯 Educational Gameplay
1. **Tutorial** - Learn about the historical context
2. **Analysis** - Study damaged planes that "successfully" returned
3. **Armor Placement** - Click to place armor where you see damage patterns
4. **Mission Launch** - Send planes with your armor configuration
5. **Results** - Celebrate the survivors (while ignoring casualties)
6. **Truth Revealed** - Discover the hidden crash data and your bias

### 💼 Satirical VC Commentary
Meet **Chad Ventura**, your overly confident aviation consultant who provides:
- Data-driven insights based on "successful" planes
- Startup-style pivots when strategies fail
- Confidence metrics that inversely correlate with actual knowledge
- Post-hoc explanations for every failure

## Features

- **Interactive Plane Visualization** - SVG-based aircraft with clickable damage points
- **Real-time Bias Simulation** - Watch survivorship bias affect your decisions
- **Educational Reveal** - Learn the correct analysis method
- **Responsive Design** - Works on desktop and mobile
- **Dark Aviation Theme** - Professional game aesthetic
- **Comprehensive Testing** - 39 unit tests covering game logic

## Technical Implementation

### Architecture
- **TypeScript + Vite** - Modern development stack
- **Component-based UI** - Modular, maintainable code structure  
- **State Management** - Reactive game engine with event subscriptions
- **SVG Graphics** - Crisp, scalable plane visualizations
- **CSS Grid/Flexbox** - Responsive layouts

### Game Logic
- **BiasEngine** - Simulates both biased and correct analyses
- **MissionSystem** - Handles combat simulation with armor effectiveness
- **VCAdvisor** - Generates contextual satirical commentary
- **PlaneFactory** - Creates and manages aircraft with damage systems

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production  
npm run build
```

## The Real-World Lesson

This game demonstrates a cognitive bias that affects:

- **Startups** - "Just copy successful companies!" (ignoring the failed ones)
- **Investing** - Focusing on unicorn success stories 
- **Product Development** - Only analyzing successful features
- **Career Advice** - "Do what successful people did!" 
- **Medical Research** - Studying survivors while missing critical failure cases

The lesson? **Always ask: "What am I not seeing? Where's the missing data?"**

## Historical Context

Abraham Wald's insight saved countless lives by armoring the *right* parts of aircraft. His work at the Statistical Research Group during WWII exemplifies how mathematical thinking can reveal counterintuitive truths.

The planes that came back shot full of holes represented the areas where you *didn't* need extra armor. The areas with few holes were the critical spots - because planes hit there didn't return to tell the tale.

## License

MIT License - Feel free to use this for educational purposes!

---

*"The most dangerous phrase in the language is: 'We've always done it this way.'"* - Not actually said by any plane that got shot down.

Built with ❤️ and a healthy skepticism of survivor bias.