const form = document.getElementById("addBookForm");

const API_URL = "/api/books";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const authorIdInput = document.getElementById("author_id").value;

    const book = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        author_id: authorIdInput ? parseInt(authorIdInput) : null
    };

    console.log("SENDING BOOK:", book);

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(book)
        });

        console.log("STATUS:", res.status);

        const data = await res.json();
        console.log("RESPONSE:", data);

        if (!res.ok) {
            alert("Failed to add book");
            return;
        }

        alert("Book added!");
        window.location.href = "index.html";

    } catch (err) {
        console.error("ERROR:", err);
    }
});

function goBack() {
    window.location.href = "index.html";
}