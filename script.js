// === Party Data ===
const parties = [
  {
    name: "NDA",
    img: "https://upload.wikimedia.org/wikipedia/commons/7/79/NDA_logo.png",
    slogan: "Namaste Bhaiyo and bahno fir ek baar NDA sarkar",
  },
  {
    name: "Mahagathbandhan",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/66/Indian_National_Congress_flag.svg",
    slogan: "Hat Burbak Lalu Bina Chalu E bihar na hoi",
  },
  {
    name: "Jansuwraj",
    img: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Flag_of_a_political_party.svg",
    slogan: "Jo koiyo nhi kiya U hm karab",
  },
  {
    name: "JJD",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/33/Flag_of_India.svg",
    slogan: "Ka ho bauwa thik ba",
  },
  {
    name: "Others",
    img: "https://upload.wikimedia.org/wikipedia/commons/8/84/Unknown_person_icon.svg",
    slogan: "Tata, ByBy, khatam",
  },
];

// === DOM Elements ===
const partyList = document.getElementById("partyList");
const cancelVoteBtn = document.getElementById("cancelVoteBtn");
const showResultsBtn = document.getElementById("showResultsBtn");
const userVoteStatus = document.getElementById("userVoteStatus");

// === Local Storage Keys ===
const STORAGE_KEY = "bihar_votes_data";
const USER_VOTE_KEY = "bihar_user_vote";

// === Load Votes or Initialize ===
function loadVotes() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);

  const initialVotes = {};
  parties.forEach((p) => (initialVotes[p.name] = 0));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialVotes));
  return initialVotes;
}

// === Save Votes ===
function saveVotes(votes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
}

// === Render Party Cards ===
function renderParties() {
  partyList.innerHTML = "";
  parties.forEach((party) => {
    const div = document.createElement("div");
    div.className = "party";
    div.innerHTML = `
      <img src="${party.img}" alt="${party.name}" />
      <h3>${party.name}</h3>
      <button class="vote-btn" onclick="vote('${party.name}')">Vote</button>
    `;
    partyList.appendChild(div);
  });
}

// === Vote Function ===
function vote(partyName) {
  const userVote = localStorage.getItem(USER_VOTE_KEY);
  if (userVote) {
    alert("You have already voted! Cancel your vote to change it.");
    return;
  }

  const votes = loadVotes();
  votes[partyName]++;
  saveVotes(votes);
  localStorage.setItem(USER_VOTE_KEY, partyName);
  updateStatus();
  alert(`✅ Thank you! You voted for ${partyName}`);
}

// === Cancel Vote Function ===
cancelVoteBtn.addEventListener("click", () => {
  const userVote = localStorage.getItem(USER_VOTE_KEY);
  if (!userVote) {
    alert("You have not voted yet!");
    return;
  }

  const votes = loadVotes();
  if (votes[userVote] > 0) votes[userVote]--;
  saveVotes(votes);
  localStorage.removeItem(USER_VOTE_KEY);
  updateStatus();
  alert("❌ Your vote has been cancelled.");
});

// === Show Results ===
showResultsBtn.addEventListener("click", () => {
  window.location.href = "results.html";
});

// === Update User Status ===
function updateStatus() {
  const userVote = localStorage.getItem(USER_VOTE_KEY);
  if (userVote) {
    userVoteStatus.textContent = `You voted for: ${userVote}`;
  } else {
    userVoteStatus.textContent = "You haven't voted yet.";
  }
}

// === Initialize ===
renderParties();
updateStatus();