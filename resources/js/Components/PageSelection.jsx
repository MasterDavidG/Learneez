import React, { useState, useEffect } from 'react';
import api from '../api';

const PageSelection = ({ onPageSelected }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [pages, setPages] = useState([]);
  
  useEffect(() => {
    api.get('/textbooks')
      .then(response => setBooks(response.data))
      .catch(error => console.error("Error fetching books:", error));
  }, []);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    api.get(`/pages?book_id=${book.id}`)
      .then(response => setPages(response.data))
      .catch(error => console.error("Error fetching pages:", error));
  };

  return (
    <div className="page-selection">
      <h2>Select a Book and Page</h2>
      <div className="book-list">
        <h3>Books</h3>
        {books.map(book => (
          <button key={book.id} onClick={() => handleBookSelect(book)}>
            {book.title}
          </button>
        ))}
      </div>
      {selectedBook && (
        <div className="page-list">
          <h3>Pages in {selectedBook.title}</h3>
          {pages.map(page => (
            <button key={page.id} onClick={() => onPageSelected(page)}>
              Page {page.page_number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageSelection;
