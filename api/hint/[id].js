const exercises = require('../_lib/exercises-all');

module.exports = (req, res) => {
  const ex = exercises.find((e) => e.id === parseInt(req.query.id));
  if (!ex) return res.status(404).json({ error: 'Ejercicio no encontrado' });
  res.json({ solution: ex.solution });
};
