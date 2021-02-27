const Sequelize = require('sequelize');
//Criando a Tabela Resposta no Banco de Dados
//Com Relacionamento de tabelas Respostas e Perguntas 
const connection = require('./database');
const Pergunta = require('./pergunta');

const Resposta = connection.define("respostas", {

    corpo:{
    
        type: Sequelize.TEXT,
        allowNull: false

    },

    perguntaId:{
        
        type: Sequelize.INTEGER,
        allowNull: false
        
    }
});

Resposta.sync({force: false});

module.exports = Resposta;