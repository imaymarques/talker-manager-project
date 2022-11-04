module.exports = (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  const validate = /^([\w.%+-]+)@([\w-]+\.)+([\w]{3})$/i;
  const emailValidate = validate.test(email);
  if (emailValidate === false) {
    return res.status(400)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' });
      }
      next();
};