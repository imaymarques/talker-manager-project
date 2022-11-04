const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { funcCrypto } = require('./crypto');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');

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
