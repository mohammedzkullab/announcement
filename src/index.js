import { getContrastColor, hospitalData } from "./hospitalData.js";
import "./styles.css";

document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("loginSection");
  const announcementSection = document.getElementById("announcementSection");

  // Check if user is already logged in
  if (sessionStorage.getItem("isLoggedIn")) {
    showAnnouncementSystem();
  }

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("loginError");

    // Array of valid users
    const users = [
      { username: "admin", password: "admin123" },
      { username: "user1", password: "pass123" },
      { username: "user2", password: "pass456" },
    ];

    // Find matching user
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("currentUser", user.username);
      showAnnouncementSystem();
      errorElement.textContent = ""; // Clear any error messages
    } else {
      errorElement.textContent = "Invalid username or password";
    }
  });

  function showAnnouncementSystem() {
    loginSection.style.display = "none";
    announcementSection.style.display = "block";
    initializeAnnouncementSystem();
  }

  function initializeAnnouncementSystem() {
    // Your existing announcement system initialization code
    const announcementTypes = document.getElementById("announcementTypes");
    let selectedButton = null;

    hospitalData.codes.forEach((code) => {
      const btn = document.createElement("button");
      btn.className = "announcement-btn";
      btn.dataset.codeId = code.id;
      btn.innerHTML = `${code.name}<span class="checkmark">✓</span>`;
      btn.style.backgroundColor = code.color;
      btn.style.color = getContrastColor(code.color);

      btn.addEventListener("click", () => {
        if (selectedButton) {
          selectedButton.classList.remove("selected");
        }
        if (selectedButton === btn) {
          selectedButton = null;
          selectedAnnouncement = null;
        } else {
          btn.classList.add("selected");
          selectedButton = btn;
          selectedAnnouncement = code;
        }
      });

      announcementTypes.appendChild(btn);
    });

    // Populate floors
    const floorSelect = document.getElementById("floorSelect");
    hospitalData.floors.forEach((floor) => {
      const option = new Option(floor.name, floor.id);
      floorSelect.add(option);
    });

    // Populate rooms
    const roomSelect = document.getElementById("roomSelect");
    hospitalData.rooms.forEach((room) => {
      const option = new Option(room.name, room.id);
      roomSelect.add(option);
    });

    // Add logout button
    const header = document.querySelector("#announcementSection h1");
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.className = "logout-btn";
    header.after(logoutBtn);

    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("isLoggedIn");
      announcementSection.style.display = "none";
      loginSection.style.display = "block";
      // Clear any existing data
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
      document.getElementById("loginError").textContent = "";
    });

    // Continue with the rest of your existing code...
    // (Floor select, room select, generate button functionality, etc.)
  }
});

async function textToSpeech(message) {
  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/R6nda3uM038xEEKi7GFl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": "sk_a77298d282580946e728a0691ade88b61969fe61ce90300f",
        },
        body: JSON.stringify({
          text: message,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the audio data as ArrayBuffer
    const audioData = await response.arrayBuffer();

    // Create blob directly from the ArrayBuffer
    const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Get the audio player container and audio element
    const audioPlayerContainer = document.getElementById(
      "audio-player-container"
    );
    const audioElement = document.getElementById("announcement-audio");

    // Set the audio source and show the player
    audioElement.src = audioUrl;
    audioPlayerContainer.style.display = "block";

    // Clean up the old audio URL when the audio is loaded
    audioElement.onloadeddata = () => {
      URL.revokeObjectURL(audioUrl);
      // audioElement.play();
    };

    return true;
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return false;
  }
}

const announcementBtns = document.querySelectorAll(".announcement-btn");
const floorSelect = document.getElementById("floorSelect");
const roomSelect = document.getElementById("roomSelect");
const generateBtn = document.getElementById("generateBtn");
const feedback = document.getElementById("feedback");
const jsonFeedback = document.getElementById("json-feedback");

let selectedAnnouncement = null;

generateBtn.addEventListener("click", async () => {
  const floor = floorSelect.value;
  const room = roomSelect.value;
  const customMessage = document.getElementById("customMessage").value;

  if (!selectedAnnouncement || !floor || !room) {
    alert("Please select an announcement type, floor, and room.");
    return;
  }

  // Construct the full announcement message
  const fullMessage = `Attention Please ! ${selectedAnnouncement.name} , for Floor ${floor}, Room ${room} . Please Note : ${customMessage}`;

  // Call the text-to-speech function
  try {
    const speechResult = await textToSpeech(fullMessage);
    if (!speechResult) {
      console.error("Failed to generate speech");
    }
  } catch (error) {
    console.error("Error generating speech:", error);
  }

  feedback.style.display = "block";
  feedback.innerHTML = `
            <h3>Announcement Generated:</h3>
            <p><strong>Type:</strong> ${selectedAnnouncement.name}</p>
            <p><strong>Code ID:</strong> ${selectedAnnouncement.id}</p>
            <p><strong>Priority:</strong> ${selectedAnnouncement.priority}</p>
            <p><strong>Floor:</strong> ${floor}</p>
            <p><strong>Room:</strong> ${room}</p>
            ${
              customMessage
                ? `<p><strong>Additional Message:</strong> ${customMessage}</p>`
                : ""
            }
            <p><strong>Status:</strong> Announcement has been sent to the hospital PA system.</p>
        `;
  jsonFeedback.style.display = "block";
  jsonFeedback.innerHTML = JSON.stringify({
    selectedAnnouncement: selectedAnnouncement.id,
    selectedFloor: floor,
    selectedRoom: room,
    customMessage: customMessage,
  });

  // ======= here to post data
  console.log({
    selectedAnnouncement: selectedAnnouncement.id,
    selectedFloor: floor,
    selectedRoom: room,
    customMessage: customMessage,
  });
  // testingSpeech();

  // Reset selections
  announcementBtns.forEach((btn) => btn.classList.remove("selected"));
  floorSelect.value = "";
  roomSelect.value = "";
  document.getElementById("customMessage").value = "";
  selectedAnnouncement = null; // Reset to null instead of empty string
});

export const playAudio = async ({ text, voiceId }) => {
  const response = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    { text },
    {
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.REACT_APP_ELEVENLABS_API_KEY,
      },
      responseType: "blob",
    }
  );

  const audio = new Audio(URL.createObjectURL(response.data));
  await audio.play();

  await new Promise((resolve) => {
    audio.addEventListener("ended", () => {
      resolve();
    });
  });
};
