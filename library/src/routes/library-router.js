const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const multer = require('multer');
const uidGenerator = require('node-unique-id-generator');
const axios = require('axios');

const library = {
    books: []
};

for (let y = 0; y < 8; y++) {
    const newBook = new Book(
        'Хорошая книга ' + (y + 1),
        'Книга была написана тогда, когда было все прекрасно',
        'Веселые люди',
        'yes',
        'https://placehold.it/640x480'
    );

    library.books.push(newBook);
}

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Библиотека',
        books: library.books
    });
});

router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Добавить книгу',
        action: '/create',
        book: {}
    });
});

router.get('/update/:id', (req, res) => {
    const { books } = library;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        res.render('update', {
            title: 'Обновить книгу',
            action: '/update/' + id,
            book: library.books[idx]
        });
    } else {
        res.status(404).redirect('/error/404');
    }
});

router.get('/:id', (req, res) => {
    const { books } = library;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (id === 'favicon.ico') return;

    axios.post(`http://localhost:1234/counter/${id}/incr`, {
    }).then(r => {
        axios.get(`http://localhost:1234/counter/${id}`)
            .then(response => response.data)
            .then(result => {
                const counter = result[id];
                if (idx !== -1) {
                    res.render('view', {
                        title: library.books[idx].title,
                        book: library.books[idx],
                        counter,
                        id
                    });
                } else {
                    res.status(404).redirect('/error/404');
                }
            });
    }).catch(error => {
        if (idx !== -1) {
            res.render('view', {
                title: library.books[idx].title,
                book: library.books[idx],
                id
            });
        } else {
            res.status(404).redirect('/error/404');
        }
        console.error(error);
    });
});

const unID = uidGenerator.generateUniqueId();

const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, 'books');
    },
    filename (req, file, cb) {
        cb(null, `${unID}.txt`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/plain') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploader = multer({ storage: storage, fileFilter: fileFilter });

router.post('/create', uploader.single('book-file'), (req, res) => {
    const { books } = library;
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    const fEx = true;

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fEx, unID);
    books.push(newBook);

    res.redirect('/');
});

const fileMiddleware = require('../middleware/uploader');

router.post('/update/:id', fileMiddleware.single('book-file'), (req, res) => {
    const { books } = library;
    const { title, description, authors, favorite, fileCover } = req.body;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title,
            description,
            authors,
            favorite,
            fileCover
        };
        res.redirect(`/${id}`);
    } else {
        res.status(404).redirect('/error/404');
    }
});

module.exports = router;
