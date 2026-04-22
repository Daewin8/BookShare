let books = [
    { title: "The Hobbit", status: "Completed" },
    { title: "1984", status: "Want to Read" },
    { title: "One Piece", status: "Completed" },
    { title: "Attack on Titan", status: "Reading" }
];

let lists = [
    { name: "Favorites", user: "Jay", books: [books[0], books[2]] }
];

let reviews = [
    "Great book!",
    "Loved the story"
];

function showPage(id) {
    ['booksPage', 'listsPage', 'profilePage'].forEach(p => document.getElementById(p).classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function showTab(tabId, btn) {
    ['profileTab', 'booksTab', 'wantTab', 'reviewsTab', 'listsTab'].forEach(t => document.getElementById(t).classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function renderProfile() {
    const readBooks = books.filter(b => b.status === 'Completed');
    const wantBooks = books.filter(b => b.status === 'Want to Read');

    document.getElementById('booksReadCount').textContent = readBooks.length;

    // favorites (first 4 for now)
    const favGrid = document.getElementById('favoriteGrid');
    favGrid.innerHTML = '';
    books.slice(0, 4).forEach(b => {
        favGrid.innerHTML += `<div class='card'>${b.title}</div>`;
    });

    const readGrid = document.getElementById('readGrid');
    readGrid.innerHTML = '';
    readBooks.forEach(b => {
        readGrid.innerHTML += `<div class='card'>${b.title}</div>`;
    });

    const wantGrid = document.getElementById('wantGrid');
    wantGrid.innerHTML = '';
    wantBooks.forEach(b => {
        wantGrid.innerHTML += `<div class='card'>${b.title}</div>`;
    });

    const reviewsDiv = document.getElementById('reviewsContainer');
    reviewsDiv.innerHTML = '';
    reviews.forEach(r => {
        reviewsDiv.innerHTML += `<div class='card'>${r}</div>`;
    });

    const userLists = document.getElementById('userListsGrid');
    userLists.innerHTML = '';
    lists.forEach(l => {
        userLists.innerHTML += `<div class='card'>${l.name}</div>`;
    });
}

renderProfile();