// Une los ejercicios de todos los escenarios en una sola lista
const tienda = require('./exercises').map((e) => ({ ...e, scenario: 'tienda' }));
const biblioteca = require('./exercises-biblioteca');
const hospital = require('./exercises-hospital');
const banco = require('./exercises-banco');

module.exports = [...tienda, ...biblioteca, ...hospital, ...banco];
