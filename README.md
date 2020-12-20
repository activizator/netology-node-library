# netology-node-library

## Учебное приложение «библиотека»:

https://act-my-lib.herokuapp.com/

## Запросы для MongoDB:

Запрос для вставки данных о двух книгах в коллекцию books:

```javascript
db.books.insertMany([
    {
      title: "t1",
      description: "d1",
      authors: "a1"
    },
    {
      title: "t2",
      description: "d2",
      authors: "a2"
    }
]);
```

Запрос для поиска полей документов коллекции books по полю title:

```javascript
db.books.find( { title: /title/ } );
```

Запрос для редактирования полей: description и authors коллекции books по _id записи:

```javascript
db.books.updateOne(
    { _id : ObjectId("5fddfe01ccedf60040244336") },
    { $set: { description: "d22", authors: "a22" } }
);
```

*Каждый документ коллекции books должен содержать следующую структуру данных:

```javascript
{
  title: "string",
  description: "string",
  authors: "string"
}
```

