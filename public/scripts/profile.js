let currentUser = JSON.parse(localStorage.getItem("user")) || null;

if (!currentUser) {
    window.location.href = "login.html";
}

function goHome() {
    window.location.href = "index.html";
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function showTab(tabId, btn) {
    const tabs = ["readingTab", "readTab", "wantTab"];

    tabs.forEach(id => {
        const tab = document.getElementById(id);
        if (tab) {
            tab.classList.add("hidden");
        }
    });

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.remove("hidden");
    }

    document.querySelectorAll(".tabs button").forEach(button => {
        button.classList.remove("active");
    });

    btn.classList.add("active");
}

function createEmptyCard(message) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = message;
    return card;
}

function createBookCard(book) {
    const card = document.createElement("div");
    card.classList.add("card");

    const title = document.createElement("div");
    title.classList.add("card-title");
    title.textContent = book.title || "Untitled Book";

    const author = document.createElement("div");
    author.classList.add("book-meta");
    author.textContent = book.author || book.author_name || "Unknown Author";

    const status = document.createElement("div");
    status.classList.add("book-meta");
    status.textContent = "Status: " + (book.status || "none");

    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(status);

    card.addEventListener("click", () => {
        window.location.href = `books.html?id=${book.id}`;
    });

    return card;
}

async function loadUserBooks(status, gridId) {
    const grid = document.getElementById(gridId);

    if (!grid) {
        console.error("Grid not found:", gridId);
        return 0;
    }

    grid.textContent = "";

    try {
        const res = await fetch(
            `/api/books/user-status/status/${currentUser.id}/${status}`
        );

        const data = await res.json();

        if (!res.ok) {
            console.error(`Failed to load ${status}:`, data);
            grid.appendChild(createEmptyCard("Could not load books."));
            return 0;
        }

        const books = Array.isArray(data) ? data : [];

        if (books.length === 0) {
            grid.appendChild(createEmptyCard("No books here yet."));
            return 0;
        }

        books.forEach(book => {
            grid.appendChild(createBookCard(book));
        });

        return books.length;

    } catch (err) {
        console.error(`Profile load error for ${status}:`, err);
        grid.appendChild(createEmptyCard("Error loading books."));
        return 0;
    }
}

async function loadProfile() {
    document.getElementById("username").textContent = currentUser.username;

    const readingCount = await loadUserBooks("reading", "readingGrid");
    const readCount = await loadUserBooks("read", "readGrid");
    const wantCount = await loadUserBooks("want_to_read", "wantGrid");

    document.getElementById("booksReadingCount").textContent = readingCount;
    document.getElementById("booksReadCount").textContent = readCount;
    document.getElementById("booksWantCount").textContent = wantCount;
}

window.goHome = goHome;
window.logout = logout;
window.showTab = showTab;

loadProfile();