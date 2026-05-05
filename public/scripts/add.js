const form = document.getElementById("addBookForm");
const resultsDiv = document.getElementById("results");

const API_URL = "/api/books";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const authorName = document.getElementById("author_name").value.trim();

    if (!title) {
        alert("Title is required");
        return;
    }

    const book = {
        title: title,
        description: description,
        author_name: authorName
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(book)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Failed to add book");
            return;
        }

        alert("Book added!");
        window.location.href = "index.html";

    } catch (err) {
        console.error("Error adding book:", err);
        alert("Something went wrong while adding the book.");
    }
});

async function searchGoogleBooks() {
    const query = document.getElementById("googleSearch").value.trim();

    if (!query) {
        alert("Enter a book title or author to search.");
        return;
    }

    try {
        const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
        );

        const data = await res.json();

        renderResults(data.items || []);

    } catch (err) {
        console.error("Google Books error:", err);
        alert("Could not search Google Books.");
    }
}

function renderResults(books) {
    resultsDiv.textContent = "";

    if (books.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No results found.";
        resultsDiv.appendChild(empty);
        return;
    }

    books.forEach(item => {
        const info = item.volumeInfo || {};

        const card = document.createElement("div");
        card.classList.add("google-book-card");

        const title = document.createElement("h4");
        title.textContent = info.title || "No title";

        const author = document.createElement("p");
        author.textContent = "Author: " + getAuthorName(info);

        const description = document.createElement("p");
        description.textContent = shortenText(info.description || "No description available.", 180);

        const btn = document.createElement("button");
        btn.textContent = "Use this book";

        btn.addEventListener("click", () => {
            fillForm(info);
        });

        card.appendChild(title);
        card.appendChild(author);
        card.appendChild(description);
        card.appendChild(btn);

        resultsDiv.appendChild(card);
    });
}

function fillForm(info) {
    document.getElementById("title").value = info.title || "";
    document.getElementById("description").value = info.description || "";
    document.getElementById("author_name").value = getAuthorName(info);

    alert("Book info added to form. Click Add Book to save it.");
}

function getAuthorName(info) {
    if (info.authors && info.authors.length > 0) {
        return info.authors.join(", ");
    }

    return "Unknown Author";
}

function shortenText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }

    return text.slice(0, maxLength) + "...";
}

function goBack() {
    window.location.href = "index.html";
}

function goHome() {
    window.location.href = "index.html";
}

window.searchGoogleBooks = searchGoogleBooks;
window.goBack = goBack;
window.goHome = goHome;