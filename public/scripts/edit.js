const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

const form = document.getElementById("editBookForm");

const API_URL = "/api/books";

// -------------------------
// INIT
// -------------------------
loadBookForEdit();

// -------------------------
async function loadBookForEdit() {
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

        document.getElementById("title").value = book.title || "";
        document.getElementById("author_name").value = book.author || book.author_name || "";
        document.getElementById("description").value = book.description || "";

    } catch (err) {
        console.error("Error loading book:", err);
        alert("Could not load book.");
        window.location.href = "index.html";
    }
}

// -------------------------
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedBook = {
        title: document.getElementById("title").value.trim(),
        author_name: document.getElementById("author_name").value.trim(),
        description: document.getElementById("description").value.trim()
    };

    if (!updatedBook.title) {
        alert("Title is required.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${bookId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedBook)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Failed to update book.");
            return;
        }

        alert("Book updated!");
        window.location.href = `books.html?id=${bookId}`;

    } catch (err) {
        console.error("Error updating book:", err);
        alert("Something went wrong updating the book.");
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