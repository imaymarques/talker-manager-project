const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { funcCrypto } = require('./crypto');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validateRate');
const validateAuthorization = require('./middlewares/validateAuthorization');
// const { query } = require('express');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const tPath = path.resolve(__dirname, './talker.json');

app.get('/talker', async (_req, res) => {
  const talkers = await fs.readFile(tPath, 'utf-8');
  const info = talkers ? JSON.parse(talkers) : [];
  return res.status(200).json(info);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile(tPath, 'utf-8');
  const data = JSON.parse(talkers);
  const getId = data.find((el) => el.id === Number(id));
  if (!getId) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(200).json(getId);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const { email, password } = req.body;
  
  if ([email, password].includes(undefined)) {
  return res.status(401).json({ message: 'Campos ausentes!' });
  }
  
  const token = funcCrypto();
  
  return res.status(200).json({ token });
});

app.post('/talker', validateAuthorization, validateTalk, validateName, validateAge,
  validateWatchedAt, validateRate, async (req, res) => {
    const talker = req.body;
    const info = await fs.readFile(tPath, 'utf-8');
    const parse = JSON.parse(info);
    const talkerID = parse[parse.length - 1].id + 1;
    const newTalkers = { id: talkerID, ...talker };
    const newFile = [...parse, newTalkers];
    await fs.writeFile(tPath, JSON.stringify(newFile));
    return res.status(201).json(newTalkers);
});

// app.put('/books/:id', async (req, res) => {
//   const { id } = req.params;
//   const booksJson = await fs.readFile(booksFile, 'utf-8');
//   const books = JSON.parse(booksJson);
//   const newBooksFile = books
//     .map((book) => (book.id === id ? { id: book.id, ...req.body } : book));
//   const response = newBooksFile[id - 1];
//   await fs.writeFile(booksFile, JSON.stringify(newBooksFile));
//   res.status(200).json(response);
// });

app.put('/talker/:id', validateAuthorization, validateName, validateAge, validateTalk,
  validateRate, validateWatchedAt, async (req, res) => {
    const { id } = req.params;
    const talkers = await fs.readFile(tPath, 'utf-8');
    const data = JSON.parse(talkers);
    const newTalkers = data
      .map((talker) => (talker.id === Number(id) ? { id: talker.id, ...req.body } : talker));
    const response = newTalkers[id - 1];
    await fs.writeFile(tPath, JSON.stringify(newTalkers));
    res.status(200).json(response);
  });

app.delete('/talker/:id', validateAuthorization, async (req, res) => {
  const { id } = req.params;
  const info = await fs.readFile(tPath, 'utf-8');
  const parse = JSON.parse(info);
  const idFiltered = parse.find((el) => el.id !== Number(id));
  await fs.writeFile(tPath, JSON.stringify(idFiltered));
  return res.sendStatus(204);
});

// app.get('/talker/search', validateAuthorization, async (req, res) => {
//   const { q } = req.query;
//   const info = await fs.readFile(tPath, 'utf-8');
//   const parse = JSON.parse(info);
// })

module.exports = {
  tPath,
};