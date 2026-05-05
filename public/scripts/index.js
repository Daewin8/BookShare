let currentUser = JSON.parse(localStorage.getItem("user")) || null;

const grid = document.getElementById("bookGrid");
const searchBar = document.getElementById("globalSearch");

let allBooks = [];

const API_URL = "/api/books";

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
    updateNavbar();
    window.location.href = "index.html";
}

async function getBookStatus(bookId) {
    if (!currentUser) return null;

    try {
        const res = await fetch(
            `/api/books/user-status/book/${currentUser.id}/${bookId}`
        );

        if (!res.ok) {
            console.error("Failed to get book status:", await res.text());
            return null;
        }

        const data = await res.json();
        return data?.status || null;

    } catch (err) {
        console.error("Error getting book status:", err);
        return null;
    }
}

async function setStatus(bookId, status) {
    if (!currentUser) {
        alert("Login required");
        window.location.href = "login.html";
        return;
    }

    try {
        const existing = await getBookStatus(bookId);

        if (existing === status) {
            await fetch("/api/books/user-status", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    book_id: bookId
                })
            });

            await loadBooks();
            return;
        }

        // Otherwise set/update status
        await fetch("/api/books/user-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: currentUser.id,
                book_id: bookId,
                status
            })
        });

        await loadBooks();

    } catch (err) {
        console.error("Error setting status:", err);
    }
}

async function loadBooks() {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) {
            console.error("Failed to load books:", await res.text());
            return;
        }

        const data = await res.json();
        allBooks = Array.isArray(data) ? data : [];

        await renderBooks(allBooks);

    } catch (err) {
        console.error("Error loading books:", err);
    }
}

async function renderBooks(books) {
    grid.textContent = "";

    for (const book of books) {
        const card = document.createElement("div");
        card.classList.add("book-card");

        const title = document.createElement("div");
        title.classList.add("book-title");
        title.textContent = book.title || "Untitled Book";
        title.style.cursor = "pointer";
        title.addEventListener("click", () => openBookPage(book.id));

        const author = document.createElement("div");
        author.classList.add("book-meta");
        author.textContent = book.author || book.author_name || "Unknown Author";

        const statusText = document.createElement("div");
        statusText.classList.add("book-meta");

        const currentStatus = await getBookStatus(book.id);

        if (currentUser) {
            statusText.textContent = "Status: " + (currentStatus || "none");
        } else {
            statusText.textContent = "Login to track this book";
        }

        const actions = document.createElement("div");
        actions.classList.add("actions");

        const statuses = [
            { label: "Read", value: "read" },
            { label: "Reading", value: "reading" },
            { label: "Want", value: "want_to_read" }
        ];

        statuses.forEach(item => {
            const btn = document.createElement("button");
            btn.textContent = item.label;

            if (currentStatus === item.value) {
                btn.classList.add("active-status");
            }

            btn.addEventListener("click", () => {
                setStatus(book.id, item.value);
            });

            actions.appendChild(btn);
        });

        card.appendChild(title);
        card.appendChild(author);
        card.appendChild(statusText);
        card.appendChild(actions);

        grid.appendChild(card);
    }
}

searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        renderBooks(allBooks);
        return;
    }

    const filtered = allBooks.filter(book =>
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.author_name?.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query)
    );

    renderBooks(filtered);
});

function openBookPage(id) {
    window.location.href = "books.html?id=" + id;
}

function goToLogin() {
    window.location.href = "login.html";
}

function goToProfile() {
    window.location.href = "profile.html";
}

function goToAddPage() {
    window.location.href = "add.html";
}

function goToHome() {
    window.location.href = "index.html";
}

window.logout = logout;
window.goToLogin = goToLogin;
window.goToProfile = goToProfile;
window.goToAddPage = goToAddPage;
window.goToHome = goToHome;

updateNavbar();
loadBooks();