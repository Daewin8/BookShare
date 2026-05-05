# BookShare

https://uncg-my.sharepoint.com/:v:/g/personal/dtwilliams_uncg_edu/IQCGcegiyMGQSqP6x3UzS_DYAcw5FKI6av5HLGpzu0pG-NM?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=xTbCS3

BooKShare is a full-stack web application that lets users browse, add, edit, delete, and track books. Users can create an account, log in, view a shared book library, add books to their personal reading shelves, and organize books by status: Reading, Read, or Want to Read.

The app is designed for readers who want a simple way to keep track of books they have read or plan to read.
---

Deployed App URL

bookshare-production-c641.up.railway.app

---

GitHub Repository

PASTE YOUR GITHUB URL HERE

Setup Instructions

1. Clone the repository

2. Install dependencies

npm install

3. Create a .env file

Create a .env file in the root of the project and add your PostgreSQL database URL:

DATABASE_URL=your_postgresql_connection_string_here

Do not push the .env file to GitHub.

4. Start the server

npm start

5. Open the app locally

http://localhost:3000

Design
I honestly chose Vanilla JavaScript mainly because it was a little earier for me understand, I tend to be a little slow when it comes to some code but doing it more gave me a better understand how client-side rendering works without relying on a framework.

For the backend, I used Node.js and Express.js because Express provides a simple way to build API routes and connect the frontend to the database. I organized the backend using separate route files and controller functions so the app would be easier to manage as it grew.

I chose PostgreSQL for the database because the app has relational data. Users, books, and user-specific book statuses are connected. The books table stores the global book database, the users table stores account information, and the user_books table connects users to books while storing each user’s reading status.

The user_books table has a unique constraint on user_id and book_id. This prevents one user from having multiple statuses for the same book. If a user changes a book from Reading to Read, the app updates the existing row instead of creating a duplicate.

I used the Google Books API because it makes the Add Book page more useful. Instead of typing every field manually, users can search for a book and autofill information like the title, author, and description.

Challenges

One of the biggest challenges was making the profile page show the correct books for each user. The profile page depends on the logged-in user ID and the reading status routes. I had to make sure the frontend was calling the correct routes and that the backend returned arrays of books that the profile page could render.Another challenge was deciding what features to keep. I originally wanted favorites and custom lists, but because of time, I simplified the project.

Learning Outcomes

This project I learned how to debug problems using the browser console, network tab, backend terminal errors, and database records. This helped me figure out whether a problem was happening in the frontend, backend, or database. I learned how authentication works at a basic level by creating signup, login, and logout functionality. I also learned how to hash passwords with bcrypt before saving them to the database. Finally, I learned about deployment and environment variables. I deployed the app using Railway and learned that sensitive information like the database URL should not be pushed to GitHub.

Future Work

With more time, I would add:

Favorite books as a separate shelf
Custom user-created book lists
Public user profile pages
Book reviews and ratings
Book cover images from the Google Books API
Better authentication using sessions or JWTs
User permissions so only certain users can edit or delete global books
Improved styling and accessibility
More detailed profile statistics
Better error messages and loading states
