const Sequelize = require('sequelize');
const db = require('../../config/database.config');


const Notes = db.define('notes', {
    title: { type: Sequelize.STRING },
    date: { type: Sequelize.DATE },
});

module.exports = Notes;