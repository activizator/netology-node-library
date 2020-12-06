#!/usr/bin/env node

const express = require('express');
const formData = require('express-form-data');
const cors = require('cors');
const { Book } = require('./models');

const app = express();
app.use(formData.parse());
app.use(cors());

const library = {
  books: []
};

const newBook0 = new Book(
  'Первая хорошая книга',
  'Книга была написана тогда, когда было все прекрасно',
  'Веселые люди',
  'yes',
  'http://placehold.it/200x300',
  'goodbook.txt'
);

library.books.push(newBook0);

const newBook1 = new Book(
  'Еще одна хорошая книга',
  'Книга была написана тогда, когда было все отлично',
  'Веселые и хорошие люди',
  'yes',
  'http://placehold.it/200x300',
  'goodbook2.txt'
);

library.books.push(newBook1);

app.post('/api/user/login', (req, res) => {
  const info = { id: 1, mail: 'test@mail.ru' };
  res.status(201);
  res.json(info);
});

app.get('/api/books/', (req, res) => {
  const { books } = library;
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json('books | not found');
  }
});

app.post('/api/books/', (req, res) => {
  const { books } = library;
  const { title, description, authors, favorite, fileCover, fileName } = req.body;

  const newBook = new Book(title, description, authors, favorite, fileCover, fileName);
  books.push(newBook);

  res.json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const { books } = library;
  const { title, description, authors, favorite, fileCover, fileName } = req.body;
  const { id } = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName
    };
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json('books | not found');
  }
});

app.delete('/api/books/:id', (req, res) => {
  const { books } = library;
  const { id } = req.params;
  const idx = books.findIndex(el => el.id === id);

  if (idx !== -1) {
    books.splice(idx, 1);
    res.json(true);
  } else {
    res.status(404);
    res.json('books | not found');
  }
});

app.listen(3000);
