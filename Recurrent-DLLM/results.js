const results = {
  "Base": {
    "0.5": {
      "baseline": [
        7.42,
        10.16,
        17.06,
        60.88,
        48.0,
        77.67
      ],
      "csrr": [
        17.58,
        17.58,
        33.59,
        70.66,
        66.67,
        81.0
      ]
    },
    "1": {
      "baseline": [
        6.25,
        11.72,
        16.68,
        64.75,
        52.0,
        80.33
      ],
      "csrr": [
        18.36,
        21.88,
        37.38,
        79.23,
        71.33,
        82.67
      ]
    }
  },
  "Instruct": {
    "0.5": {
      "baseline": [
        17.19,
        13.67,
        68.31,
        76.04,
        83.67,
        85.67
      ],
      "csrr": [
        28.52,
        24.22,
        70.58,
        78.54,
        86.0,
        86.0
      ]
    },
    "1": {
      "baseline": [
        23.44,
        21.48,
        70.43,
        78.62,
        87.0,
        86.67
      ],
      "csrr": [
        38.28,
        29.3,
        74.0,
        83.47,
        89.0,
        89.0
      ]
    }
  }
};
const controls = document.querySelector(".controls");
const benchmarks = ["Countdown", "GSM8K", "SVAMP"];
function updateScores() {
  const backbone = document.getElementById("backbone").value;
  const tokens = Number(document.getElementById("length").value);
  const fraction = Number(document.getElementById("budget").value);
  const values = results[backbone][fraction];
  const cells = document.querySelectorAll("#scores tr");
  for (const [i, benchmark] of benchmarks.entries()) {
    const index = 2 * i + (tokens === 256 ? 1 : 0);
    const baseline = values.baseline[index];
    const csrr = values.csrr[index];
    const difference = csrr - baseline;
    const row = cells[i];
    row.cells[0].textContent = benchmark;
    row.cells[1].textContent = baseline.toFixed(2) + "%";
    row.cells[2].textContent = csrr.toFixed(2) + "%";
    row.cells[1].dataset.score = "baseline";
    row.cells[1].style.setProperty("--fraction", baseline / 100);
    row.cells[2].dataset.score = "csrr";
    row.cells[2].style.setProperty("--fraction", csrr / 100);
    row.cells[3].textContent = (difference > 0 ? "+" : "") + difference.toFixed(2);
  }
  document.getElementById("setting").textContent =
    "LLaDA-8B-" + backbone + " · " + tokens + " tokens · " + tokens * fraction + " NFE";
}
controls.addEventListener("change", updateScores);
controls.hidden = false;
updateScores();

const viewer = document.getElementById("figure-viewer");
if (typeof viewer.showModal === "function") {
  const heading = document.getElementById("figure-title");
  const enlarged = document.getElementById("figure-detail");
  const original = document.getElementById("full-figure");
  for (const link of document.querySelectorAll("a[data-title]")) {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      heading.textContent = link.dataset.title;
      enlarged.src = link.href;
      enlarged.alt = link.querySelector("img")?.alt ?? link.dataset.title;
      original.href = link.href;
      viewer.showModal();
    });
  }
  document.getElementById("close-viewer").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (event) => {
    if (event.target !== viewer) return;
    const {top, right, bottom, left} = viewer.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
      viewer.close();
    }
  });
}
