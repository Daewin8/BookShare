const form = document.getElementById('bookForm');
const grid = document.getElementById('bookGrid');
const searchBar = document.getElementById("globalSearch");

let allBooks = [];

const API_URL = "/api/books";

async function loadBooks() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        allBooks = data;
        renderBooks(allBooks);

    } catch (err) {
        console.error("Error loading books:", err);
    }
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const book = {
    title: document.getElementById('title').value,
    description: "",
    author_id: null 
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(book)
    });

    form.reset();
    loadBooks();

  } catch (err) {
    console.error("Error adding book:", err);
  }
});

function renderBooks(books) {
    grid.innerHTML = '';

    books.forEach(book => {
        const card = document.createElement('div');
        card.classList.add('book-card');

        card.innerHTML = `
            <div class="book-title" onclick="openBookPage(${book.id})" style="cursor:pointer;">
                ${book.title}
            </div>

            <div class="book-meta">${book.author || "Unknown Author"}</div>
            <div class="book-meta">${book.description || "No Description Available"}</div>

            <div class="actions">
                <button onclick="markAsRead(${book.id})">Read</button>
                <button onclick="addToList(${book.id}, 'reading')">Reading</button>
                <button onclick="addToList(${book.id}, 'want_to_read')">Want</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function openBookPage(id) {
    window.location.href = "books.html?id=" + id;
}

function goToAddPage() {
    window.location.href = "add.html";
}

function markAsRead(bookId) {
    fetch("/api/books/user-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: 1,
            book_id: bookId,
            status: "read"
        })
    })
    .then(() => {
        alert("Marked as read!");
    })
    .catch(err => console.error(err));
}

async function addToList(bookId, status) {
    try {
        await fetch("/api/books/user-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: 1,
                book_id: bookId,
                status: status
            })
        });

        alert("Added to " + status);

    } catch (err) {
        console.error("Error updating status:", err);
    }
}

searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        renderBooks(allBooks);
        return;
    }

    const filtered = allBooks.filter(book => {
        return (
            book.title?.toLowerCase().includes(query) ||
            book.author?.toLowerCase().includes(query) ||
            book.description?.toLowerCase().includes(query)
        );
    });

    renderBooks(filtered);
});

loadBooks();