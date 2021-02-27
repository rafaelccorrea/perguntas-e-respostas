const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

//Config Ejs 
app.set('view engine', 'ejs');
app.use(express.static('public'));

//bodyParser Dados do formulario
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

        
// Rotas

// Listando Perguntas Pagina Home
app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC']
 //Then criando a variavel pergunta que recebe o model de perguntas do banco.       
    ]}).then(perguntas => {
        res.render("index",{
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

//Buscando Titulo e Descricao
app.post("/pgsalvo", (req, res) =>{
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;
    //Buscando no input/ name =  os dados do campo
    Pergunta.create({
        //criando as variaveis que recebem esses dados.
        titulo: titulo,
        descricao: descricao
    }).then(() =>{
        res.redirect("/")
    })
});

//Buscando a pergunta no banco de dados pelo id...
app.get("/pergunta/:id", (req, res)=>{    
    let id = req.params.id
//Buscando no banco um pergunta que tem o id igual o id da rota
    Pergunta.findOne({
        where: {id: id}
//Then cria a variavel pergunta que sera usada no front-end        
    }).then(pergunta => {
//Se a pergunta for encontrada sera renderizado a pagina da pergunta, senao ira redirecionar para home pag        
        if(pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId:pergunta.id},
                order: [ 
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render('pergunta',{
                    pergunta:pergunta, 
                    respostas:respostas
            });

            });
        }else{
            res.redirect('/')
        }
    })
});


//Rota que salva as respostas das perguntas
app.post('/responder', (req, res) =>{
   //Buscando Resposta No formulario
    let corpo = req.body.corpo;
    let perguntaId = req.body.pergunta;

    //Buscando Info no banco
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{//Redirecionando A resposta com o id da pergunta
        res.redirect("/pergunta/" + perguntaId);
    })
});








// Database
connection.authenticate().then(()=>{
    console.log('Banco de dados Online!')
}).catch((msgError)=>{
    console.log(msgError)
});

//Servidor!
app.listen(8081, function() {
    console.log('Server On')
})