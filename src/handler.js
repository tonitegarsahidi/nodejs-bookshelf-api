const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');
const { responseFormat, responseFormatFail } = require('./responseFormat');

/** ==========================================================================
 * TAMBAHKAN BUKU BARU
 * ==========================================================================
 */
const addBookshelfHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Input Validation first is here
  // Jika tidak ada nama
  if (!name) {
    const response = h.response(
      responseFormatFail('fail', 'Gagal menambahkan buku. Mohon isi nama buku'),
    );
    response.code(400);
    return response;
  }
  // Jika pageCount kurang dari readPage
  if (pageCount < readPage) {
    const response = h.response(
      responseFormatFail('fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'),
    );
    response.code(400);
    return response;
  }

  const finished = readPage === pageCount;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBookshelf = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  bookshelf.push(newBookshelf);

  // jika sukses menambahkan
  const isSuccess = bookshelf.filter((eachBookshelf) => eachBookshelf.id === id).length > 0;

  if (isSuccess) {
    const response = h.response(
      responseFormat('success', 'Buku berhasil ditambahkan', { bookId: id }),
    );
    response.code(201);
    return response;
  }

  const response = h.response(
    responseFormat('fail', 'Buku gagal ditambahkan', {}),
  );
  response.code(500);
  return response;

};

/** ==========================================================================
 * DAPATKAN SEMUA BUKU YANG ADA
 * ==========================================================================
 */
const getAllBookshelfHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let bookFiltered = bookshelf;
  // Filer 
  if (name) {
    bookFiltered = bookFiltered.filter((checkBook) => (
      checkBook.name.toUpperCase().includes(name.toUpperCase())
    ));
  }
  if (reading) {
    bookFiltered = bookFiltered.filter((checkBook) => (
      checkBook.reading
    ));
  }
  if (finished) {
    bookFiltered = bookFiltered.filter((checkBook) => (
      finished >= 1 ? checkBook.readPage === checkBook.pageCount
        : checkBook.readPage !== checkBook.pageCount
    ));
  }

  const books = bookFiltered.map((eachBookshelf) => ({
    id: eachBookshelf.id, name: eachBookshelf.name, publisher: eachBookshelf.publisher,
  }));

  return responseFormat('success', '', { books });
};

/** ==========================================================================
 * DAPATKAN SEBUAH BUKU BERDASARKAN ID DENGAN DETAIL
 * ==========================================================================
 */
const getBookshelfByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = bookshelf.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    const response = h.response(
      responseFormat('success', 'Buku Ketemu', { book }),
    );
    response.code(200);
    return response;
  }

  const response = h.response(
    responseFormatFail('fail', 'Buku tidak ditemukan'),
  );
  response.code(404);
  return response;
};

/** ==========================================================================
 * UPDATE DATA BUKU BERDASARKAN YANG TERSEDIA
 * ==========================================================================
 */
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Input Validation first is here
  // Jika tidak ada nama
  if (!name) {
    const response = h.response(
      responseFormatFail('fail', 'Gagal memperbarui buku. Mohon isi nama buku'),
    );
    response.code(400);
    return response;
  }
  // Jika pageCount kurang dari readPage
  if (pageCount < readPage) {
    const response = h.response(
      responseFormatFail('fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'),
    );
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();

  const index = bookshelf.findIndex((bookshelfFind) => bookshelfFind.id === id);
  const finished = readPage === pageCount;

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };
    const response = h.response(
      responseFormat('success', 'Buku berhasil diperbarui', { bookId: id }),
    );
    response.code(200);
    return response;
  }

  const response = h.response(
    responseFormatFail('fail', 'Gagal memperbarui buku. Id tidak ditemukan'),
  );
  response.code(404);
  return response;

};

/** ==========================================================================
 * UPDATE DATA BUKU BERDASARKAN YANG TERSEDIA
 * ==========================================================================
 */
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = bookshelf.findIndex((bookFind) => bookFind.id === id);
  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response(
      responseFormat('success', 'Buku berhasil dihapus', { bookId: id }),
    );
    response.code(200);
    return response;
  }

  const response = h.response(
    responseFormatFail('fail', 'Buku gagal dihapus. Id tidak ditemukan'),
  );
  response.code(404);
  return response;

};

module.exports = {
  addBookshelfHandler,
  getAllBookshelfHandler,
  getBookshelfByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
