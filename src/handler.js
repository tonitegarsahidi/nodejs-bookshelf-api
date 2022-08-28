const bookshelf = require('./bookshelf');
const nanoid = require('nanoid');

const addBookshelfHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  console.log('Book Name', name);
  console.log('Book Year', year);
  console.log('Book Author', author);
  console.log('Book Summary', summary);
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

};

module.exports = { addBookshelfHandler };
