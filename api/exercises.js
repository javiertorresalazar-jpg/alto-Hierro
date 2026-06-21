const exercises = require('./_lib/exercises-all');

module.exports = (req, res) => {
  const { level, scenario } = req.query;
  let result = exercises;
  if (scenario) result = result.filter((e) => e.scenario === scenario);
  if (level) result = result.filter((e) => e.level === level);
  res.json(result.map(({ solution, ...rest }) => rest));
};
