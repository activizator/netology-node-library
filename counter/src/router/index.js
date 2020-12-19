const express = require('express');
const router = express.Router();
const fs = require('fs');
const stor = __dirname + '/stor.json';

router.get('/counter/:bookId', (req, res) => {
    const { bookId } = req.params;
    fs.readFile(stor, 'utf8', (error, data) => {
        if (error) {
            console.log(error);
            console.log(`Не могу открыть указанный файл ${stor}`);
            process.exit(-1);
        } else {

            try {
                let jsonData = JSON.parse(data);
                let bookData = {};
                bookData[bookId] = jsonData[bookId];
                res.status(200);
                res.json( bookData );
            } catch(err) {
                console.log(data);
                console.log('Неверный формат данных в анализируемом файле');
                process.exit(-1);
            }

        }  
    });
});

router.post('/counter/:bookId/incr', (req, res) => {
    const { bookId } = req.params;
    fs.readFile(stor, 'utf8', (error, data) => {
        if (error) {
            console.log(error);
            console.log(`Не могу открыть указанный файл ${stor}`);
            process.exit(-1);
        } else {

            try {
                let jsonData = JSON.parse(data);
                let count = jsonData[bookId] ? parseInt(jsonData[bookId]) + 1 : 1;
                let bookData = {};
                bookData[bookId] = count;
                jsonData[bookId]= count;
                fs.writeFileSync(stor, JSON.stringify(jsonData));
                res.status(200);
                res.json( bookData );
            } catch(err) {
                console.log(data);
                console.log('Неверный формат данных в анализируемом файле');
                process.exit(-1);
            }

        }  
    });
});

module.exports = router;
