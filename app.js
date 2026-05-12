/*************************************************************************************
 * Objetivo: Arquivo responsável pela criação da API do projeto de locadora
 * Data: 17/04/2026
 * Autor: May
 * Versão: 1.0 
 *************************************************************************************/
/*
********* TESTES IMPORTANTES ************
    verificar se o body está correto no app;
    na controller colocar um console log para verificar se o atributo está correto;
    na controller verificar se os if estão digitados corretamente;
    verificar se o dao está correto
    verificar o script e bater no terminal para verificar se está correto. 
    copiar o script e verificar no sql se está correto

    erro no DAO, colocar o console catch e usar a variavel error
*/
//testando git
//Import das dependencias para criar a API 
const express    = require('express')
const cors       = require('cors')
const bodyParser = require('body-parser')

//Import das controllers do projeto
const controllerFilme = require('./controller/filme/controller_filme.js')
const controllerGenero = require('./controller/genero/controller_genero.js')
const controllerAtividades = require('./controller/atividades/controller_atividades.js')

//criando um obj para manipular o express
const app = express()

//criando um obj para manipular dados do bpdy da api em formato JSON
const bodyParserJSON = bodyParser.json()

//conjunto de permissões a serem aplicadas no CORS da API
const corsOptions = {
    origin: ['*'], //origem da requisição, podendo ser um ip ou um * que significa todos
    methods: 'GET, POST, PUT, DELETE, OPTIONS', //methods são os verbos que serão liberados na API (GET, POST, PUT, DELETE)
    allowedHeaders: ['Content-Type', 'Autorization'] //permissoes do cabeçalho do CORS
}

//configura as permissoes da API atraves do CORS 
app.use(cors(corsOptions))

//response -> retornos da API
//request -> chegada de dados na API


//ENDPOINTS
//endpoint para inserir um filme
app.post('/v1/senai/locadora/filme', bodyParserJSON, async function(request, response){
    //recebe o conteúdo dentro do body da requisição
    let dados = request.body
    //Recebe o contentType da requisisção para validar se é um json
    let contentType = request.headers['content-type']
    let result = await controllerFilme.inserirNovoFilme(dados,contentType)    
    response.status(result.status_code)
    response.json(result)

})

//endpoint para listar todos os filmes 
app.get('/v1/senai/locadora/filme', async function(request, response){
    let result = await controllerFilme.listarFilme()

    response.status(result.status_code)
    response.json(result)
})

//endpoint para buscar o filme pelo id
//todo o indentificador de registro (chave primaria PK) chega via parametro, qualquer outro atributo chega via query
app.get('/v1/senai/locadora/filme/:id', async function(request, response){
    //recebe o id via parametro
    let id = request.params.id

    let result = await controllerFilme.buscarFilme(id)

    response.status(result.status_code)
    response.json(result)
})

//endpoint para atualizar o filme pelo id 
//quando vamos fazer atualização existe 2 verbos, o put e o patch, ambos são para atualizar, a diferença é quando vamos fazer um update geral (generica) usa-se o put
//quando vamos fazer a atualização especifica usa-se o patch.
app.put('/v1/senai/locadora/filme/:id', bodyParserJSON, async function(request, response){

    // recebe o content type da requisição para validar se é json
    let contentType = request.headers['content-type']
    //recebe o id do registro a ser atualizado 
    let id = request.params.id
    //recebe os dados do body, que serão modificados no banco de dados
    let dados = request.body

    //mandar na mesma ordem que está a controller, não esquecer!!!!!!!
    //chama a função para atualizar o filme, devemos encaminhar as 3 variáveis na mesma sequencia
    //que a função foi criada na controller. 
    let result = await controllerFilme.atualizarFilme(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

//endpoint para deletar um filme pelo id 
app.delete('/v1/senai/locadora/filme/:id',  async function(request, response){
    let id = request.params.id
    let result = await controllerFilme.excluirFilme(id)

    response.status(result.status_code)
    response.json(result)
})

//###### GENERO #######
//endpoint para inserir um genero
app.post('/v1/senai/locadora/genero', bodyParserJSON, async function(request, response){
    //recebe o conteúdo dentro do body da requisição
    let dados = request.body
    //Recebe o contentType da requisisção para validar se é um json
    let contentType = request.headers['content-type']
    let result = await controllerGenero.inserirNovoGenero(dados, contentType)    
    
    response.status(result.status_code)
    response.json(result)
})

//endpoint para buscar o genero pelo id
app.get('/v1/senai/locadora/genero/:id', async function(request, response){
    //recebe o id via parametro
    let id = request.params.id

    let result = await controllerGenero.buscarGenero(id)

    response.status(result.status_code)
    response.json(result)
})

//endpoint para listar todos os generos 
app.get('/v1/senai/locadora/genero', async function(request, response){
    let result = await controllerGenero.listarGenero()

    response.status(result.status_code)
    response.json(result)
})

//endpoint para atualizar um genero
app.put('/v1/senai/locadora/genero/:id', bodyParserJSON, async function(request, response){

    // recebe o content type da requisição para validar se é json
    let contentType = request.headers['content-type']
    //recebe o id do registro a ser atualizado 
    let id = request.params.id
    //recebe os dados do body, que serão modificados no banco de dados
    let dados = request.body

    //mandar na mesma ordem que está a controller, não esquecer!!!!!!!
    //chama a função para atualizar o filme, devemos encaminhar as 3 variáveis na mesma sequencia
    //que a função foi criada na controller. 
    let result = await controllerGenero.atualizarGenero(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

//Endpoint para deletar um genero
app.delete('/v1/senai/locadora/genero/:id',  async function(request, response){
    let id = request.params.id
    let result = await controllerGenero.excluirGenero(id)

    response.status(result.status_code)
    response.json(result)
})

//###### ATIVIDADES #######

//endpoint para inserir um genero
app.post('/v1/senai/locadora/atividade', bodyParserJSON, async function(request, response){
    //recebe o conteúdo dentro do body da requisição
    let dados = request.body
    //Recebe o contentType da requisisção para validar se é um json
    let contentType = request.headers['content-type']
    let result = await controllerAtividades.inserirNovaAtividade(dados, contentType)    
    
    response.status(result.status_code)
    response.json(result)
})

//endpoint para buscar o atividade pelo id
app.get('/v1/senai/locadora/atividade/:id', async function(request, response){
    //recebe o id via parametro
    let id = request.params.id

    let result = await controllerAtividades.buscarAtividade(id)

    response.status(result.status_code)
    response.json(result)
})

//endpoint para listar todas as atividades
app.get('/v1/senai/locadora/atividade', async function(request, response){
    let result = await controllerAtividades.listarAtividades()

    response.status(result.status_code)
    response.json(result)
})

//endpoint para atualizar uma atividade
app.put('/v1/senai/locadora/atividade/:id', bodyParserJSON, async function(request, response){

    // recebe o content type da requisição para validar se é json
    let contentType = request.headers['content-type']
    //recebe o id do registro a ser atualizado 
    let id = request.params.id
    //recebe os dados do body, que serão modificados no banco de dados
    let dados = request.body

    //mandar na mesma ordem que está a controller, não esquecer!!!!!!!
    //chama a função para atualizar o filme, devemos encaminhar as 3 variáveis na mesma sequencia
    //que a função foi criada na controller. 
    let result = await controllerAtividades.atualizarAtividade(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})




//serve para inicializar a API para receber requisições 
app.listen(8080, function(){
    console.log('API funcionando e aguardando novas requisisções...')
})