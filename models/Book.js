const uidGenerator = require('node-unique-id-generator');
const fs = require('fs');
const path = require('path');

class Book {
    constructor (title = '', description = '', authors = '', favorite = '', fileCover = '', fileName = '', id = uidGenerator.generateUniqueId()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = id + '.txt';
        fs.writeFileSync(path.join('./books', this.fileName), this.id);
    }
}

module.exports = Book;
