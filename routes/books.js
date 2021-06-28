const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const multer = require('multer');
const path = require('path');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif'];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

// All Books Route
router.get('/', async (req, res) => {
  res.render('books/index');
});

// New Book Route
router.get('/new', (req, res) => {
  renderNewPage(res, new Book());
});

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;

  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description,
  });

  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect('books');
  } catch (error) {
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };

    if (hasError) params.errorMessage = 'Error Creating Book';
    res.render('books/new', params);
  } catch (error) {
    res.redirect('/books');
  }
}
module.exports = router;
