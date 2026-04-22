const form = document.getElementById('bookForm');
const bookGrid = document.getElementById('bookGrid');
const listsGrid = document.getElementById('listsGrid');
const singleListGrid = document.getElementById('singleListGrid');
const listTitle = document.getElementById('listTitle');

let books = [
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    status: "Completed",
    rating: 5
  },
  {
    title: "Attack on Titan Vol. 1",
    author: "Hajime Isayama",
    status: "Reading",
    rating: 4
  },
  {
    title: "1984",
    author: "George Orwell",
    status: "Want to Read",
    rating: ""
  },
  {
    title: "One Piece Vol. 1",
    author: "Eiichiro Oda",
    status: "Completed",
    rating: 5
  },
  {
    title: "Harry Potter",
    author: "J.K. Rowling",
    status: "Reading",
    rating: 4
  }
];

// SAMPLE LIST DATA
let lists = [
  {
    name: "Favorites",
    user: "Jay",
    books: [books[0], books[3]]
  },
  {
    name: "Must Reads",
    user: "Alex",
    books: [books[2], books[4]]
  },
  {
    name: "Currently Reading",
    user: "Sam",
    books: [books[1]]
  },
  {
    name: "Top Manga",
    user: "Chris",
    books: [books[1], books[3]]
  }
];

function showPage(pageId) {
    document.getElementById('booksPage').classList.add('hidden');
    document.getElementById('listsPage').classList.add('hidden');
    document.getElementById('singleListPage').classList.add('hidden');

    document.getElementById(pageId).classList.remove('hidden');
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        status: document.getElementById('status').value,
        rating: document.getElementById('rating').value
    };

    books.push(book);
    lists[0].books.push(book);

    renderBooks();
    renderLists();
    form.reset();
});

function renderBooks() {
    bookGrid.innerHTML = '';

    books.forEach(book => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
        <div class="title">${book.title}</div>
        <div class="meta">${book.author}</div>
        <div class="meta">Status: ${book.status}</div>
        <div class="meta">Rating: ${book.rating || 'N/A'}</div>
      `;

        bookGrid.appendChild(card);
    });
}

function renderLists() {
    listsGrid.innerHTML = '';

    lists.forEach((list, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
        <div class="title">${list.name}</div>
        <div class="meta">By: ${list.user}</div>
        <div class="meta">Books: ${list.books.length}</div>
      `;

        card.onclick = () => openList(index);

        listsGrid.appendChild(card);
    });
}

function openList(index) {
    const list = lists[index];

    listTitle.textContent = list.name;
    singleListGrid.innerHTML = '';

    list.books.forEach(book => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
        <div class="title">${book.title}</div>
        <div class="meta">${book.author}</div>
      `;

        singleListGrid.appendChild(card);
    });

    showPage('singleListPage');
}

renderBooks();
renderLists();