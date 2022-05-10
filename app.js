// Book Class: Represent A Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI Class : handle UI Tasks
class UI {
  static displayBooks() {

    const books = Store.getbook();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><button class="btn btn-danger btn-sm delete">X</button></td>
        `;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    // Vanish in 3 sec
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}
// Store Class: Handle Storage

class Store {
  static getbook() {
    let books;
    if(localStorage.getItem('books') === null){
        books = [];
    }
    else{
        books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }
  static addbook(book) {
    const books = Store.getbook();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getbook();

    books.forEach((book, index) => {
        if(book.isbn === isbn){
            books.splice(index, 1);
        }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event : Display book
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event : Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // Prevent Acutal submit
  e.preventDefault();
  // Get Form value
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // Validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please Fill all the fields", "danger");
  } else {
    // Instatiat book
    const book = new Book(title, author, isbn);

    // Add Book To UI
    UI.addBookToList(book);

    // Add book to store
    Store.addbook(book);

    // show Success Message
    UI.showAlert("Book added", "success");

    // Clear Fields
    UI.clearFields();
  }
});

// Event : Remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
  // Deleted from UI
  UI.deleteBook(e.target);

  // Remove Book from Store 
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show Removed Message
  UI.showAlert("Book Removed", "success");
});
