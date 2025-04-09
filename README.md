# Obstacle Jumping Game

A 2D platform game developed using modern React and TypeScript. Move the character on a horizontal plane, jump over obstacles, and collect points!

## Features

- Jump with the SPACE key
- Double jump capability
- Various powerups to collect:
  - Invisibility (pass through obstacles)
  - Slow Time (reduces obstacle speed)
  - Gun (shoot obstacles for points)
  - Small Obstacles (reduces obstacle size)
  - Double Points (score multiplier)
- Character customization with unlockable skins
- Score and high score system
- Difficulty increases over time

## Installation and Running

### Requirements

- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Controls

- `SPACE` or `↑`: Jump (press twice for double jump)
- `X` or `F`: Shoot (when gun powerup is active)
- `P`: Pause/resume game
- `R`: Restart game

## How to Play

1. Click the "Start Game" button or press R
2. Jump over obstacles using the SPACE key
3. Collect powerups to gain advantages
4. Earn 10 points for each obstacle passed
5. Unlock new character skins by increasing your total score
6. The game gets harder as your level increases

## Technologies Used

- React
- TypeScript
- Zustand (State Management)
- use-sound (Sound Effects)
- CSS Animations
- localStorage (Saving High Score and Unlocked Skins)

## License

This project is licensed under the MIT License.
