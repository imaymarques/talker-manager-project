module.exports = (req, res, next) => {
  const { watchedAt } = req.body.talk;
  const date = /(\d{2})\/?(\d{2})?\/(\d{4})/;
  const validate = date.test(watchedAt);
  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!validate) {
    return res.status(400).json({ message: 
      'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
  return next();
};
