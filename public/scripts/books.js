const bookDetail = document.getElementById('bookDetail');

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

const API_URL = "/api/books";

async function loadBook() {
    if (!bookId) {
        bookDetail.innerHTML = "<h2>No book selected</h2>";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${bookId}`);

        console.log("STATUS:", res.status);

        const book = await res.json();

        console.log("BOOK DATA:", book);

        if (!book || book.error) {
            bookDetail.innerHTML = "<h2>Book not found</h2>";
            return;
        }

        renderBook(book);

    } catch (err) {
        console.error("Failed to load book:", err);
        bookDetail.innerHTML = "<h2>Error loading book</h2>";
    }
}

function renderBook(book) {
    if (!bookDetail) {
        console.error("bookDetail element not found");
        return;
    }

    bookDetail.innerHTML = `
        <h2>${book.title || "No Title"}</h2>

        <div class="detail-section">
            <strong>Author:</strong> ${book.author || "Unknown"}
        </div>

        <div class="detail-section">
            <strong>Description:</strong><br>
            ${book.description || "No description available"}
        </div>

        <div class="detail-section">
            <strong>About the Author:</strong><br>
            ${book.author_bio || "No biography available"}
        </div>

        <div class="status-buttons">
            <button onclick="setStatus(${book.id}, 'reading')">Reading</button>
            <button onclick="setStatus(${book.id}, 'read')">Read</button>
            <button onclick="setStatus(${book.id}, 'want_to_read')">Want</button>
            <button onclick="addToList(${book.id})">Add to List</button>
        </div>
    `;
}

async function setStatus(bookId, status) {
    try {
        await fetch("/api/books/user-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: 1,
                book_id: bookId,
                status
            })
        });

        alert("Status updated!");

    } catch (err) {
        console.error(err);
    }
}

function addToList(id) {
    alert("Add to list coming soon");
}

loadBook();