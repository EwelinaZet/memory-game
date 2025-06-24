# Memory Card Game

This is a classic memory card game built with Vue.js 3. The goal is to find all matching pairs of cards on the board. The game features a seed-based card generation system, persistent game state using `localStorage`, and a responsive design that works on desktop, tablets, and mobile devices.

## Features

- **Classic Memory Gameplay**: Find all pairs of cards to complete a level.
- **Persistent State**: Your game progress (level, cards, stats) is saved in your browser's `localStorage`, so you can continue where you left off.
- **Seedable Card Generation**: Start a game with a specific "seed" to get the same card layout every time. This is great for challenging friends! If you don't provide a seed, a random one is generated.
- **Responsive Design**: The game layout adapts to different screen sizes, ensuring a great experience on any device.
- **Sound Effects**: Includes sound effects for card flips and level completion using Howler.js.
- **Canvas-based Rendering**: Cards are rendered on an HTML `<canvas>` for smooth animations and interactive effects like parallax on mouse hover.

## Tech Stack

- **Frontend**: [Vue.js 3](https://vuejs.org/) (with Composition API and `<script setup>`)
- **State Management**: [Pinia](https://pinia.vuejs.org/) (though lightly used)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: SCSS
- **Audio**: [Howler.js](https://howlerjs.com/) for sound effects.
- **Testing**: [Vitest](https://vitest.dev/) for unit tests.
- **Linting & Formatting**: ESLint and Prettier.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 22 or higher) and [npm](https://www.npmjs.com/) installed on your system.

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone <repository-url>
    cd memory-game
    ```

2.  Install the project dependencies using npm:
    ```sh
    npm install
    ```

### Running the Application

To start the development server, run the following command:

```sh
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## How to Play

1.  When you first open the game, you can enter a "seed" or leave it blank for a random game.
2.  Click the "Start" button to begin.
3.  Click on a card to flip it over.
4.  Click on a second card to see if it's a match.
5.  If the cards match, they will be removed from the board.
6.  If they don't match, they will be flipped back over.
7.  The game is won when all pairs have been found. You will then advance to the next level.
8.  Your progress is saved automatically, so you can close the browser and come back later to continue your game.

## Project Structure

Here is a brief overview of the key components of the project:

-   `src/App.vue`: The main application component that handles the initial seed input and loads the game board.
-   `src/components/GameBoard.vue`: The core component for the game logic. It manages the game state, card creation, level progression, and saving/loading from `localStorage`.
-   `src/components/GameCard.vue`: Renders a single card using `<canvas>`. It handles the card's appearance, flip animations, and parallax effects.
-   `src/components/GameStats.vue`: Displays game statistics such as the current level, number of attempts, and elapsed time.
-   `src/types/memory.ts`: Contains TypeScript type definitions for the main data structures used in the game, such as `Card` and `GameStats`.
-   `src/utils/generatePrng.ts`: A utility for generating a pseudo-random number generator based on a seed, used for shuffling cards consistently.
