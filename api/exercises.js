const exercises = require('./_lib/exercises');

module.exports = (req, res) => {
  const { level } = req.query;
  const result = level
    ? exercises.filter((e) => e.level === level)
    : exercises;
  res.json(result.map(({ solution, ...rest }) => rest));
};
