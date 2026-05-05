let currentUser = JSON.parse(localStorage.getItem("user")) || null;

const bookDetail = document.getElementById("bookDetail");
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

const API_URL = "/api/books";

// -------------------------
// INIT
// -------------------------
updateNavbar();
loadBook();

// -------------------------
// NAVBAR
// -------------------------
function updateNavbar() {
    const loginBtn = document.getElementById("loginBtn");
    const profileBtn = document.getElementById("profileBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!loginBtn || !profileBtn || !logoutBtn) return;

    if (currentUser) {
        loginBtn.style.display = "none";
        profileBtn.style.display = "inline-block";
        logoutBtn.style.display = "inline-block";
    } else {
        loginBtn.style.display = "inline-block";
        profileBtn.style.display = "none";
        logoutBtn.style.display = "none";
    }
}

function logout() {
    localStorage.removeItem("user");
    currentUser = null;
    window.location.href = "index.html";
}

// -------------------------
// LOAD BOOK
// -------------------------
async function loadBook() {
    if (!bookDetail) return;

    if (!bookId) {
        showMessage("No book selected");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${bookId}`);

        if (!res.ok) {
            showMessage("Failed to load book");
            return;
        }

        const book = await res.json();

        if (!book) {
            showMessage("Book not found");
            return;
        }

        renderBook(book);

    } catch (err) {
        console.error("Error loading book:", err);
        showMessage("Error loading book");
    }
}

// -------------------------
function showMessage(text) {
    bookDetail.textContent = "";

    const msg = document.createElement("h2");
    msg.textContent = text;

    bookDetail.appendChild(msg);
}

// -------------------------
async function getBookStatus(bookId) {
    if (!currentUser) return null;

    try {
        const res = await fetch(
            `/api/books/user-status/book/${currentUser.id}/${bookId}`
        );

        if (!res.ok) return null;

        const data = await res.json();
        return data?.status || null;

    } catch (err) {
        console.error("Error getting book status:", err);
        return null;
    }
}

// -------------------------
async function renderBook(book) {
    bookDetail.textContent = "";

    const title = document.createElement("h2");
    title.textContent = book.title || "No Title";

    const author = document.createElement("div");
    author.classList.add("detail-section");
    author.textContent = "Author: " + (book.author || book.author_name || "Unknown Author");

    const description = document.createElement("div");
    description.classList.add("detail-section");
    description.textContent = book.description || "No description available";

    const statusBox = document.createElement("div");
    statusBox.classList.add("detail-section");

    const currentStatus = await getBookStatus(book.id);

    if (currentUser) {
        statusBox.textContent = "Your Status: " + (currentStatus || "none");
    } else {
        statusBox.textContent = "Login to track this book";
    }

    const statusButtons = createStatusButtons(book.id, currentStatus);
    const manageButtons = createManageButtons(book.id);
    const usersSection = await createOtherUsersSection(book.id);

    bookDetail.appendChild(title);
    bookDetail.appendChild(author);
    bookDetail.appendChild(description);
    bookDetail.appendChild(statusBox);
    bookDetail.appendChild(statusButtons);
    bookDetail.appendChild(manageButtons);
    bookDetail.appendChild(usersSection);
}

// -------------------------
function createStatusButtons(bookId, currentStatus) {
    const buttons = document.createElement("div");
    buttons.classList.add("status-buttons");

    const statuses = [
        { label: "Read", value: "read" },
        { label: "Reading", value: "reading" },
        { label: "Want to Read", value: "want_to_read" }
    ];

    statuses.forEach(item => {
        const btn = document.createElement("button");
        btn.textContent = item.label;

        if (currentStatus === item.value) {
            btn.classList.add("active-status");
        }

        btn.addEventListener("click", () => {
            setStatus(bookId, item.value);
        });

        buttons.appendChild(btn);
    });

    return buttons;
}

// -------------------------
function createManageButtons(bookId) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("manage-buttons");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit Book";
    editBtn.addEventListener("click", () => {
        window.location.href = `edit.html?id=${bookId}`;
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Book";
    deleteBtn.classList.add("delete-button");
    deleteBtn.addEventListener("click", () => {
        window.location.href = `delete.html?id=${bookId}`;
    });

    wrapper.appendChild(editBtn);
    wrapper.appendChild(deleteBtn);

    return wrapper;
}

// -------------------------
async function setStatus(bookId, status) {
    if (!currentUser) {
        alert("You must log in first!");
        window.location.href = "login.html";
        return;
    }

    try {
        const existingStatus = await getBookStatus(bookId);

        if (existingStatus === status) {
            await fetch("/api/books/user-status", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    book_id: bookId
                })
            });

            await loadBook();
            return;
        }

        await fetch("/api/books/user-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: currentUser.id,
                book_id: bookId,
                status
            })
        });

        await loadBook();

    } catch (err) {
        console.error("Error setting status:", err);
    }
}

// -------------------------
async function createOtherUsersSection(bookId) {
    const usersSection = document.createElement("div");
    usersSection.classList.add("detail-section");

    const usersTitle = document.createElement("strong");
    usersTitle.textContent = "Other Users:";
    usersSection.appendChild(usersTitle);

    const users = await loadOtherUsers(bookId);

    if (!users.length) {
        const empty = document.createElement("div");
        empty.textContent = "No users yet";
        usersSection.appendChild(empty);
    } else {
        users.forEach(user => {
            const userLine = document.createElement("div");
            userLine.textContent = `${user.username} - ${user.status}`;
            usersSection.appendChild(userLine);
        });
    }

    return usersSection;
}

async function loadOtherUsers(bookId) {
    try {
        const res = await fetch(`/api/books/book-users/${bookId}`);

        if (!res.ok) return [];

        const data = await res.json();
        return Array.isArray(data) ? data : [];

    } catch (err) {
        console.error("Error loading other users:", err);
        return [];
    }
}

// -------------------------
function goBack() {
    window.location.href = "index.html";
}

function goHome() {
    window.location.href = "index.html";
}

function goToLogin() {
    window.location.href = "login.html";
}

function goToProfile() {
    window.location.href = "profile.html";
}

window.logout = logout;
window.goBack = goBack;
window.goHome = goHome;
window.goToLogin = goToLogin;
window.goToProfile = goToProfile;