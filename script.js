// ---------- Core logic ----------

function parseHeightsFromText(inputStr) {
  const rawParts = inputStr.split(",");
  const values = [];
  let hasInvalid = false;

  for (const part of rawParts) {
    const trimmed = part.trim();
    if (trimmed === "") continue;

    const num = Number(trimmed);
    if (Number.isNaN(num) || num < 0) {
      hasInvalid = true;
    } else {
      values.push(num);
    }
  }

  return { values, hasInvalid };
}

function computeTrappedWater(heights) {
  const n = heights.length;
  if (n === 0) return { total: 0, waterAt: new Array(0) };

  const leftMax = new Array(n);
  const rightMax = new Array(n);
  const waterAt = new Array(n).fill(0);

  leftMax[0] = heights[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
  }

  rightMax[n - 1] = heights[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
  }

  let total = 0;
  for (let i = 0; i < n; i++) {
    const w = Math.min(leftMax[i], rightMax[i]) - heights[i];
    if (w > 0) {
      waterAt[i] = w;
      total += w;
    }
  }

  return { total, waterAt };
}

// ---------- SVG drawing with animation + labels ----------

function drawVisualization(heights, waterAt) {
  const svg = document.getElementById("visualSvg");
  svg.innerHTML = "";

  if (heights.length === 0) return;

  const n = heights.length;
  const maxBar = Math.max(...heights);
  const maxWater = Math.max(...waterAt, 0);
  const maxH = Math.max(maxBar, maxWater + maxBar);

  const cellSize = 28;
  const paddingTopUnits = 2;       // top space for labels
  const xAxisUnits = 1.5;          // bottom space for x labels
  const width = n * cellSize + 40;
  const height = (maxH + paddingTopUnits + xAxisUnits) * cellSize;

  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  const offsetX = 20;
  const baseY = height - xAxisUnits * cellSize; // bottom of bars

  // grid lines
  for (let h = 0; h <= maxH + paddingTopUnits; h++) {
    const y = baseY - h * cellSize;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", y);
    line.setAttribute("x2", width);
    line.setAttribute("y2", y);
    line.setAttribute("class", "grid-line");
    svg.appendChild(line);
  }

  // ---------- bars + bar height labels ----------
  for (let i = 0; i < n; i++) {
    const barHeight = heights[i];

    for (let h = 0; h < barHeight; h++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", offsetX + i * cellSize);
      rect.setAttribute("y", baseY - (h + 1) * cellSize);
      rect.setAttribute("width", cellSize);
      rect.setAttribute("height", cellSize);
      rect.setAttribute("rx", 4);
      rect.setAttribute("ry", 4);
      rect.setAttribute("class", "bar");
      svg.appendChild(rect);
    }

    // bar height label
    if (barHeight > 0) {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = barHeight;
      const xCenter = offsetX + i * cellSize + cellSize / 2;
      const yTop = baseY - barHeight * cellSize - 6;

      text.setAttribute("x", xCenter);
      text.setAttribute("y", yTop);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#111827");
      text.setAttribute("font-size", "11px");
      text.setAttribute("font-weight", "600");
      svg.appendChild(text);
    }
  }

  // ---------- water with staggered animation ----------
  let delayIndex = 0;
  for (let i = 0; i < n; i++) {
    const barHeight = heights[i];
    const wHeight = waterAt[i];
    for (let w = 0; w < wHeight; w++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", offsetX + i * cellSize);
      rect.setAttribute("y", baseY - (barHeight + w + 1) * cellSize);
      rect.setAttribute("width", cellSize);
      rect.setAttribute("height", cellSize);
      rect.setAttribute("rx", 4);
      rect.setAttribute("ry", 4);
      rect.setAttribute("class", "water");
      svg.appendChild(rect);

      const localDelay = 50 * delayIndex;
      setTimeout(() => {
        rect.classList.add("visible");
      }, localDelay);

      delayIndex++;
    }
  }

  // ---------- X-axis index labels ----------
  for (let i = 0; i < n; i++) {
    const xCenter = offsetX + i * cellSize + cellSize / 2;
    const yLabel = baseY + 18;

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = i + 1; // 1-based index
    text.setAttribute("x", xCenter);
    text.setAttribute("y", yLabel);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#6b7280");
    text.setAttribute("font-size", "10px");
    svg.appendChild(text);
  }

  // optional axis label
  const axisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  axisLabel.textContent = "Block index";
  axisLabel.setAttribute("x", width / 2);
  axisLabel.setAttribute("y", height - 6);
  axisLabel.setAttribute("text-anchor", "middle");
  axisLabel.setAttribute("fill", "#9ca3af");
  axisLabel.setAttribute("font-size", "10px");
  svg.appendChild(axisLabel);
}

// ---------- Chip-based input management ----------

function syncTextFromChips(chips) {
  const textInput = document.getElementById("heightsInput");
  textInput.value = chips.join(",");
}

function renderChips(chips) {
  const container = document.getElementById("chipList");
  container.innerHTML = "";
  chips.forEach((value, index) => {
    const chip = document.createElement("div");
    chip.className = "chip";

    const span = document.createElement("span");
    span.textContent = value;

    const btn = document.createElement("button");
    btn.textContent = "×";
    btn.title = "Remove";
    btn.addEventListener("click", () => {
      chips.splice(index, 1);
      renderChips(chips);
      syncTextFromChips(chips);
    });

    chip.appendChild(span);
    chip.appendChild(btn);
    container.appendChild(chip);
  });
}

// ---------- Wiring UI ----------

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("heightSlider");
  const sliderValue = document.getElementById("sliderValue");
  const addBtn = document.getElementById("addHeightBtn");
  const resetBtn = document.getElementById("resetDefaultBtn");
  const clearBtn = document.getElementById("clearAllBtn");
  const textInput = document.getElementById("heightsInput");
  const computeBtn = document.getElementById("computeBtn");
  const resultText = document.getElementById("resultText");
  const errorEl = document.getElementById("errorText");

  // internal chip state
  let chips = [0, 4, 0, 0, 0, 6, 0, 6, 4, 0];

  renderChips(chips);
  syncTextFromChips(chips);

  slider.addEventListener("input", () => {
    sliderValue.textContent = slider.value;
  });

  addBtn.addEventListener("click", () => {
    const val = Number(slider.value);
    chips.push(val);
    renderChips(chips);
    syncTextFromChips(chips);
    errorEl.textContent = "";
  });

  resetBtn.addEventListener("click", () => {
    chips = [0, 4, 0, 0, 0, 6, 0, 6, 4, 0];
    renderChips(chips);
    syncTextFromChips(chips);
    errorEl.textContent = "";
  });

  clearBtn.addEventListener("click", () => {
    chips = [];
    renderChips(chips);
    syncTextFromChips(chips);
    errorEl.textContent = "";
    resultText.textContent = "Total water: -";
    drawVisualization([], []);
  });

  // keep chips synced when user types manually
  textInput.addEventListener("change", () => {
    const { values } = parseHeightsFromText(textInput.value);
    chips = values;
    renderChips(chips);
    // do not compute automatically here; wait for button
  });

  function handleCompute() {
    const { values: heights, hasInvalid } = parseHeightsFromText(textInput.value);

    if (heights.length === 0) {
      errorEl.textContent = "Please enter at least one non‑negative number.";
      resultText.textContent = "Total water: -";
      drawVisualization([], []);
      return;
    }

    if (hasInvalid) {
      errorEl.textContent = "Some values were ignored (only numbers ≥ 0 are used).";
    } else {
      errorEl.textContent = "";
    }

    const { total, waterAt } = computeTrappedWater(heights);
    resultText.textContent = `Total water: ${total} units`;
    drawVisualization(heights, waterAt);
  }

  computeBtn.addEventListener("click", handleCompute);

  // first render
  handleCompute();
});
