const express = require('express');
const router = express.Router();
const path = require('path');
const { Book } = require('../models');
const fileMiddleware = require('../middleware/uploader');
const multer = require('multer');
const formParser = multer();

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

router.post('/user/login', (req, res) => {
    const info = { id: 1, mail: 'test@mail.ru' };
    res.status(201);
    res.json(info);
});

router.get('/books/', (req, res) => {
    const { books } = library;
    res.json(books);
});

router.get('/books/:id', (req, res) => {
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

router.post('/books/', formParser.single('body'), (req, res) => {
    const { books } = library;
    const { title, description, authors, favorite, fileCover, fileName } = req.body;

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName);
    books.push(newBook);

    res.json(newBook);
});

router.put('/books/:id', formParser.single('body'), (req, res) => {
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

router.delete('/books/:id', (req, res) => {
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

router.post('/books/:id/upload-book', fileMiddleware.single('book-file'), (req, res) => {
    if (req.file) {
        const { path } = req.file;
        res.json(path);
    } else {
        res.json(null);
    }
});

router.get('/books/:id/download-book', (req, res) => {
    const { id } = req.params;
    res.download(path.join('./books', `${id}.txt`), `${id}.txt`, err => {
        if (err) {
            res.status(404).json();
        }
    });
});

module.exports = router;
