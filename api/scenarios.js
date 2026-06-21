const scenarios = require('./_lib/scenarios');

// Devuelve los escenarios disponibles (sin exponer el schema interno)
module.exports = (req, res) => {
  res.json(scenarios.map(({ schema, ...rest }) => rest));
};
