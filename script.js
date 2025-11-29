// Grab elements
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const soundwave = document.getElementById("soundwave");

let audioCtx, analyser, source, dataArray, bufferLength, animationId;

// Create bars for visualization
function createBars(numBars = 64) {
  soundwave.innerHTML = ""; // clear existing
  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    soundwave.appendChild(bar);
  }
}

// Setup AudioContext + Analyser
function setupAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 128;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }
}

// Animate bars with audio data
function animateBars() {
  if (!audio.paused && !audio.ended) {
    analyser.getByteFrequencyData(dataArray);
    const bars = document.querySelectorAll(".bar");

    bars.forEach((bar, i) => {
      const height = dataArray[i] / 2;
      bar.style.height = `${height}px`;
    });
  } else {
    // Reset bars when paused or stopped
    document.querySelectorAll(".bar").forEach(bar => {
      bar.style.height = "4px";
    });
  }

  animationId = requestAnimationFrame(animateBars);
}

// Handle play/pause button
playBtn.addEventListener("click", () => {
  setupAudioContext();

  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸ Pause";
    createBars();
    animateBars();
  } else {
    audio.pause();
    playBtn.textContent = "▶ Play My Beat";
  }
});

// Reset button & bars when audio ends
audio.addEventListener("ended", () => {
  playBtn.textContent = "▶ Play My Beat";
  document.querySelectorAll(".bar").forEach(bar => {
    bar.style.height = "4px";
  });
});
