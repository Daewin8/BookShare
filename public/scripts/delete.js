const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

const deleteMessage = document.getElementById("deleteMessage");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const API_URL = "/api/books";

let currentBook = null;

// -------------------------
// INIT
// -------------------------
loadBookForDelete();

// -------------------------
async function loadBookForDelete() {
    if (!bookId) {
        alert("No book selected.");
        window.location.href = "index.html";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${bookId}`);
        const book = await res.json();

        if (!res.ok) {
            alert(book.error || "Book not found.");
            window.location.href = "index.html";
            return;
        }

        currentBook = book;
        deleteMessage.textContent =
            `Are you sure you want to delete "${book.title}" from the global database? This cannot be undone.`;

    } catch (err) {
        console.error("Error loading book:", err);
        alert("Could not load book.");
        window.location.href = "index.html";
    }
}

// -------------------------
confirmDeleteBtn.addEventListener("click", async () => {
    if (!currentBook) return;

    try {
        const res = await fetch(`${API_URL}/${bookId}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Failed to delete book.");
            return;
        }

        alert("Book deleted!");
        window.location.href = "index.html";

    } catch (err) {
        console.error("Error deleting book:", err);
        alert("Something went wrong deleting the book.");
    }
});

// -------------------------
function goBack() {
    window.location.href = `books.html?id=${bookId}`;
}

function goHome() {
    window.location.href = "index.html";
}

window.goBack = goBack;
window.goHome = goHome;