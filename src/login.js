import { users } from "./users.js";

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("loginError");

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Store login state
    sessionStorage.setItem("isLoggedIn", "true");
    // Redirect to announcement page
    window.location.href = "./announcement.html";
  } else {
    errorElement.textContent = "Invalid username or password";
  }
});
