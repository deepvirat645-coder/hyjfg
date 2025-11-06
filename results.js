// === Party Data & Slogans ===
const parties = [
  {
    name: "NDA",
    slogan: "Namaste Bhaiyo and bahno fir ek baar NDA sarkar",
  },
  {
    name: "Mahagathbandhan",
    slogan: "Hat Burbak Lalu Bina Chalu E bihar na hoi",
  },
  {
    name: "Jansuwraj",
    slogan: "Jo koiyo nhi kiya U hm karab",
  },
  {
    name: "JJD",
    slogan: "Ka ho bauwa thik ba",
  },
  {
    name: "Others",
    slogan: "Tata, ByBy, khatam",
  },
];

// === Load Votes ===
const STORAGE_KEY = "bihar_votes_data";

function loadVotes() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

// === Draw Chart ===
function drawChart(votes) {
  const ctx = document.getElementById("voteChart");
  const labels = Object.keys(votes);
  const data = Object.values(votes);
  const totalVotes = data.reduce((a, b) => a + b, 0);
  const percentages = data.map((v) =>
    totalVotes ? ((v / totalVotes) * 100).toFixed(1) : 0
  );

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "% of Votes",
          data: percentages,
          borderWidth: 2,
          backgroundColor: [
            "#007bff",
            "#ff5733",
            "#ffc107",
            "#28a745",
            "#6c757d",
          ],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Vote Percentage (%)" },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}

// === Display Winner & Speak Slogan ===
function showWinner(votes) {
  const entries = Object.entries(votes);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const winner = sorted[0][0];
  const winnerData = parties.find((p) => p.name === winner);
  const slogan = winnerData ? winnerData.slogan : "";

  const section = document.getElementById("winnerSection");
  section.innerHTML = `
    <h3>🏆 Winning Party: <span class="highlight">${winner}</span></h3>
    <p class="slogan">"${slogan}"</p>
    <button id="speakBtn" class="vote-btn" style="margin-top:10px;">🔊 Hear Slogan</button>
  `;

  // Add manual button to trigger speech (ensures user interaction)
  document.getElementById("speakBtn").addEventListener("click", () => {
    speakSlogan(slogan);
  });

  // Optionally auto-speak after a small delay (some browsers allow it)
  setTimeout(() => {
    speakSlogan(slogan);
  }, 800);
}

function speakSlogan(slogan) {
  // Stop any previous speech
  window.speechSynthesis.cancel();

  if (!("speechSynthesis" in window)) {
    alert("❌ Speech synthesis not supported in your browser.");
    return;
  }

  const msg = new SpeechSynthesisUtterance(slogan);
  msg.lang = "hi-IN"; // or "en-IN" if Hindi isn’t supported
  msg.rate = 0.9;
  msg.pitch = 1;

  // Try to pick an Indian voice if available
  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find(
    (v) => v.lang === "hi-IN" || v.lang === "en-IN"
  );
  if (indianVoice) msg.voice = indianVoice;

  // Speak after ensuring voices are loaded
  if (voices.length === 0) {
    // some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      const voicesNow = window.speechSynthesis.getVoices();
      const voice = voicesNow.find(
        (v) => v.lang === "hi-IN" || v.lang === "en-IN"
      );
      if (voice) msg.voice = voice;
      window.speechSynthesis.speak(msg);
    };
  } else {
    window.speechSynthesis.speak(msg);
  }
}