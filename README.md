Water Tank Visualizer

Interactive frontend solution for the classic Water Tank / Trapping Rain Water interview problem.  
Given an array of non‑negative integers representing block heights, the app computes how many units of water are trapped between the blocks and visualizes it with an animated SVG.

--------------------------------------------------
Live Demo
--------------------------------------------------
Water Tank Visualizer (GitHub Pages):

https://adchayakumar.github.io/Water-Tank-Visualizer-/

--------------------------------------------------
Problem Statement
--------------------------------------------------
- Input: array of non‑negative integers representing block heights  
- Task: compute the total units of water stored between the blocks  
- Constraint: frontend‑only solution using Vanilla JavaScript + HTML/CSS  
- Example:  
  - Input:[1][2]
  - Output: 18 units of water

--------------------------------------------------
Features
--------------------------------------------------
- Pure HTML + CSS + JavaScript (no frameworks, no build step)
- Interactive input:
  - Chip list showing each block height
  - Slider + “Add” button to append new heights
  - Optional text box for comma‑separated input
- Animated SVG visualization:
  - Dark rectangles = blocks
  - Blue rectangles = trapped water with fill animation
  - X‑axis labels (block index)
  - Value labels on top of each non‑zero bar
- Trapping rain water algorithm:
  - Uses leftMax[i] and rightMax[i] arrays
  - Time complexity: O(n)
  - Space complexity: O(n)

--------------------------------------------------
Repository Structure
--------------------------------------------------
Code layout:

```text
.
├── index.html    # Page layout and containers
├── style.css     # UI styling and animations
└── script.js     # Input handling, algorithm, SVG rendering
```

--------------------------------------------------
Clone and Run Locally
--------------------------------------------------
Clone the repo:

```bash
git clone https://github.com/adchayakumar/Water-Tank-Visualizer-.git
cd Water-Tank-Visualizer-
```

Run in browser (any option):

Option 1 – open directly  
- Double‑click index.html and open in a modern browser

Option 2 – simple HTTP server (Python 3):

```bash
python -m http.server 8000
# then open http://localhost:8000 in the browser
```

--------------------------------------------------
Algorithm Overview
--------------------------------------------------
- Precompute:
  - leftMax[i] = maximum height from index 0 to i
  - rightMax[i] = maximum height from index i to n‑1
- Water above each index i:
  - water[i] = max( min(leftMax[i], rightMax[i]) - height[i], 0 )
- Total water:
  - totalWater = sum of water[i] for all i

--------------------------------------------------
Deployment
--------------------------------------------------
- Hosting: GitHub Pages
- Branch: main
- Build: static (no CI or build tools)
- Live URL:

https://adchayakumar.github.io/Water-Tank-Visualizer-/

--------------------------------------------------
Notes
--------------------------------------------------
- Built as part of an interview assignment
- Shows:
  - Understanding of the Water Tank / Trapping Rain Water problem
  - Ability to implement the algorithm
  - Ability to design a clean, interactive visualization using only HTML/CSS/JS

