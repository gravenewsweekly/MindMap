const API_KEY = "$2a$10$hD20YlzI1bEJMqaE.tDxd.imtTczoppQFIcla6eeIb41HJAHJZ1wK";
const BIN_ID = "67e095c58960c979a5771bc0";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function getUsers() {
    const response = await fetch(BIN_URL, {
        headers: { "X-Master-Key": API_KEY }
    });
    const data = await response.json();
    return data.record.users;
}

async function updateUsers(users) {
    await fetch(BIN_URL, {
        method: "PUT",
        headers: {
            "X-Master-Key": API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ users })
    });
}

// SIGN UP FUNCTION
async function register(event) {
    event.preventDefault();
    let username = document.getElementById("signup-username").value;
    let password = document.getElementById("signup-password").value;

    let users = await getUsers();
    if (users.find(u => u.username === username)) {
        alert("Username already exists!");
        return;
    }

    users.push({ username, password, bio: "", picture: "" });
    await updateUsers(users);

    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html";
}

// LOGIN FUNCTION
async function login(event) {
    event.preventDefault();
    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    let users = await getUsers();
    let user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert("Invalid credentials!");
        return;
    }

    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html";
}

// LOAD PROFILE ON INDEX
async function loadIndex() {
    let username = localStorage.getItem("loggedInUser");
    if (username) {
        document.getElementById("signup-btn").style.display = "none";
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("user-menu").style.display = "block";
        document.getElementById("username-display").innerText = username;
    }
}

// EDIT PROFILE
async function loadProfile() {
    let username = localStorage.getItem("loggedInUser");
    if (!username) window.location.href = "login.html";

    let users = await getUsers();
    let user = users.find(u => u.username === username);
    document.getElementById("edit-username").value = user.username;
    document.getElementById("bio").value = user.bio || "";
}

async function saveProfile(event) {
    event.preventDefault();
    let username = localStorage.getItem("loggedInUser");
    let bio = document.getElementById("bio").value;

    let users = await getUsers();
    let user = users.find(u => u.username === username);
    user.bio = bio;

    await updateUsers(users);
    alert("Profile updated!");
    window.location.href = "index.html";
}

async function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", loadIndex);
