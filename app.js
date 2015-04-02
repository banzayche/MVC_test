// Подключаем модуль експресс
var express = require('express');
// Подключаем модуль боди-парсер
var bodyParser = require('body-parser');
// делаем переменную ссылкой на модуль экспресс
var app = express();

// массив с начальными моделями
var books = [
    {
        title: 'task1',
        done: false,
        type: 'home',
        id: 0
    },
    {
        title: 'task2',
        done: false,
        type: 'home',
        id: 1
    },
    {
        title: 'task3',
        done: false,
        type: 'job',
        id: 2
    },
    {
        title: 'task4',
        done: false,
        type: 'job',
        id: 3
    },
    {
        title: 'task5',
        done: false,
        type: 'education',
        id: 4
    },
    {
        title: 'task6',
        done: false,
        type: 'education',
        id: 5
    },
    {
        title: 'task7',
        done: false,
        type: 'education',
        id: 6
    },
    {
        title: 'task8',
        done: false,
        type: 'home',
        id: 7
    },
];
// переменная в которой происходит подсчет айди
var nextId = books.length;
// Указывается какую статическую дерикторию использовать по умолчанию
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Ниже мы говорим, если наш реквест не запрашивает статические ресурсы, то он отдаст index.html
app.use(function (req, res, next) {
    // если запросим статические ресурсы - то отдаст их
    if(req.url.indexOf("/api") === 0 ||
        req.url.indexOf("/bower-components") === 0 ||
        req.url.indexOf("/scripts") === 0) {
        return next();
    }
    // иначе - вернет следующий файл
    res.sendFile(__dirname + '/public/index.html');
});

// указывается работа с каким массивом будет проводиться, что будет отдаваться если запрашивается массив
app.get('/api/books', function(req, res) {
    res.json(books);
});
// что будет отдаваться если запрашивается с айди
app.get('/api/books/:id', function(req, res) {
    var book = books.filter(function(book) { return book.id == req.params.id; })[0];

    if(!book) {
        res.statusCode = 404;
        return res.json({ msg: "Book does not exist" });
    }

    res.json(book);
});

// ПОСТ - это создание новых моделей на сервере
// новая - если нет айди, это по умолчанию
app.post('/api/books', function(req, res) {
    if(!req.body.title || !req.body.type) {
        res.statusCode = 400;
        return res.json({ msg: "Invalid params sent" });
    }

    var newBook = {
        title: req.body.title,
        done: req.body.done,
        type: req.body.type,
        id: nextId++,
    };

    books.push(newBook);

    res.json(newBook);
});

// ПУТ - это изменение уже существующих на сервере моделей
app.put('/api/books/:id', function(req, res) {
    if(!req.body.title || !req.body.type) {
        res.statusCode = 400;
        return res.json({ msg: "Invalid params sent" });
    }

    var book = books.filter(function(book) { return book.id == req.params.id; })[0];

    if(!book) {
        res.statusCode = 404;
        return res.json({ msg: "Book does not exist" });
    }

    book.title = req.body.title;
    book.done = req.body.done;
    book.type = req.body.type;
    book.id = req.body.id;

    res.json(book);
});

// Соответственно - удаление
app.delete('/api/books/:id', function(req, res) {
    var book = books.filter(function(book) { return book.id == req.params.id; })[0];

    if(!book) {
        res.statusCode = 404;
        return res.json({ msg: "Book does not exist" });
    }

    books.splice(books.indexOf(book), 1);

    res.statusCode = 204;
    res.send({});
});

// адресс порта
app.listen(8100);