const API_KEY = "$2a$10$hD20YlzI1bEJMqaE.tDxd.imtTczoppQFIcla6eeIb41HJAHJZ1wK";
const BIN_ID = "67e095c58960c979a5771bc0";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function getUsers() {
    const response = await fetch(BIN_URL, { headers: { "X-Master-Key": API_KEY } });
    const data = await response.json();
    return data.record.users;
}

async function updateUsers(users) {
    await fetch(BIN_URL, {
        method: "PUT",
        headers: { "X-Master-Key": API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ users }),
    });
}

// Sign Up
async function signUp(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    let users = await getUsers();
    if (users.some(u => u.username === username)) return alert("Username already taken");

    users.push({ username, password, bio: "", picture: "", usernameEdited: false });
    await updateUsers(users);

    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html";
}

// Login
async function login(event) {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    let users = await getUsers();
    let user = users.find(u => u.username === username && u.password === password);
    if (!user) return alert("Invalid credentials");

    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html";
}

// Show Logged-in User on Homepage
async function checkLogin() {
    let username = localStorage.getItem("loggedInUser");
    if (!username) return;

    document.getElementById("signup-btn").style.display = "none";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("user-menu").style.display = "block";
    document.getElementById("username-display").innerText = username;
}

// Logout
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

// Open Edit Profile Page
async function editProfile() {
    let username = localStorage.getItem("loggedInUser");
    let users = await getUsers();
    let user = users.find(u => u.username === username);
    if (!user) return;

    let newUsername = prompt("Enter new username (Only once, leave blank to keep current):", user.username);
    let newBio = prompt("Enter your bio:", user.bio);
    let newPic = prompt("Enter profile picture URL:", user.picture);

    if (newUsername && user.usernameEdited) {
        alert("Username can only be changed once!");
        return;
    }

    user.bio = newBio || user.bio;
    user.picture = newPic || user.picture;
    
    if (newUsername && !user.usernameEdited) {
        user.username = newUsername;
        user.usernameEdited = true;
        localStorage.setItem("loggedInUser", newUsername);
    }

    await updateUsers(users);
    alert("Profile updated successfully!");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", checkLogin);
