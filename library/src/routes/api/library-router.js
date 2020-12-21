const express = require('express');
const router = express.Router();
const path = require('path');
const { Book } = require('../../models');
const fileMiddleware = require('../../middleware/uploader');
const multer = require('multer');
const formParser = multer();
const axios = require('axios');

const library = {
    books: []
};

for (let y = 0; y < 5; y++) {
    const newBook = new Book(
        'Хорошая книга ' + y,
        'Книга была написана тогда, когда было все прекрасно',
        'Веселые люди',
        'yes',
        'http://placehold.it/200x300',
        'goodbook.txt'
    );

    library.books.push(newBook);
}

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

    axios.post(`http://localhost:1234/counter/${id}/incr`, {
    }).then(r => {
      
        axios.get(`http://localhost:1234/counter/${id}`)
        .then(response => response.data)
        .then(result => {
            counter = result[id];
            if (idx !== -1) {
                let book = books[idx];
                book.counter = counter;
                res.json(book);
            } else {
                res.status(404);
                res.json('books | not found');
            }
        }); 

    }).catch(error => {
        if (idx !== -1) {
            res.json(books[idx]);
        } else {
            res.status(404);
            res.json('books | not found');
        }
      console.error(error);
    });

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
