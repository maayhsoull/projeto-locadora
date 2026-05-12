/******************************************************************************************************
 * Objetivo: Arquivo responsável pela validação tratamento e manipulação de dados para o CRUD de filmes
 * data: 17/04/2026
 * Autor: May
 * Versão: 1.0 
 ******************************************************************************************************/

//import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//import do arquivo DAO para fazer o CRUD do filme no banco de dados
const filmeDAO = require('../../model/DAO/filme/filme.js')
    
//Se eu tenho 5 ações na model, tenho 5 ações na controller
//criar const com base no que há no DAO
//na controler validamos os dados, e na model manipulamos esses dados para enviar ao banco

//função para inserir um novo filme
//null e '' = diferença: null é uma variável vazia, já o '' é como se fosse um "espaço" em branco
const inserirNovoFilme = async function (filme, contentType) {
    
    //uma cópia da estrutura do json para que eu possa trabalhar com essa estrutura de forma local e não interferir na estrutura original
    //JSON.PARSE: converte o json numa string
    //JSON.STRINGFY: pega o valor do json para trabalhar como se fosse uma string
    //criando um clone do objeto JSON para manipular a sua estrutura local sem modificar a estrutura original
    let messageJSON = JSON.parse(JSON.stringify(config_message))

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let validar = await validarDados(filme)

            // se a função validar retornar um JSON de erro, iremos devolver ao app o erro. 
            if(validar){
                return validar // erro 400

            }else{
                //encaminha os dados do filme para o dao

                let result = await filmeDAO.insertFilme(filme)


                if(result){ // 201
                    filme.id = result // Criando o atributo id no JASON do filme e colocando o id gerado após o insert
                    messageJSON.DEFAULT_MESSAGE.status =        messageJSON.SUCCESS_CREATED_ITEM.status
                    messageJSON.DEFAULT_MESSAGE.status_code =   messageJSON.SUCCESS_CREATED_ITEM.status_code
                    messageJSON.DEFAULT_MESSAGE.message =       messageJSON.SUCCESS_CREATED_ITEM.message
                    messageJSON.DEFAULT_MESSAGE.response = filme

                }else{ // 500
                    return messageJSON.ERROR_INTERNAL_SERVER_MODEL //500 (MODEL)
                }
                return messageJSON.DEFAULT_MESSAGE
                
            }
        }else{
            return messageJSON.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return messageJSON.ERROR_INTERNAL_SERVER_CONTROLLER // 500 (CONTROLLER)
    }
}

//função para atualizar um filme 
const atualizarFilme = async function(filme, id, contentType){
    //sempre que for mandado o id. não é pelo body e sim pela url, não faz o update de id no banco, o id é um critério de busca, não é atualizavel
    //201 é apenas para post, pois não estamos inserindo uma pk nova 
    //sempre fazer uma lista do que a controller em que devolver
    let messageJSON = JSON.parse(JSON.stringify(config_message))

    try {
        //validação para verificar se o conteúdo do Body é um json
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //chama a função para buscar o filme e validar se o id está correto ,
            //se o id existe no banco de dados, e se o filme existe
            let resultBuscarFilme = await buscarFilme(id)

            if(resultBuscarFilme.status){
                //chama a função para validar os dados para alteração do filme (body)
                let validar = await validarDados(filme)

                if(!validar){
                    //adiciona um atributo id no json de filme para enviar ao dao um unico obj
                    filme.id = Number(id)
                    //chama a função para atualizar o filme no banco de dados
                    let result = await filmeDAO.updateFilme(filme)

                    if(result){
                        messageJSON.DEFAULT_MESSAGE.status      = messageJSON.SUCCESS_UPDATED_ITEM.status
                        messageJSON.DEFAULT_MESSAGE.status_code = messageJSON.SUCCESS_UPDATED_ITEM.status_code
                        messageJSON.DEFAULT_MESSAGE.message     = messageJSON.SUCCESS_UPDATED_ITEM.message
                        messageJSON.DEFAULT_MESSAGE.response    = filme

                        return messageJSON.DEFAULT_MESSAGE // 200 atualizado
                    }else{
                        return messageJSON.ERROR_INTERNAL_SERVER_MODEL // 500 (model)
                    }
                }else{
                    return validar //400 de validação dos campos 
                }
            }else{
                return resultBuscarFilme // 400(id inválido) 404 (não encontrado) ou 500
            }

        }else{
            return messageJSON.ERROR_CONTENT_TYPE // 415
        }
        
    } catch (error) {
        return messageJSON.ERROR_INTERNAL_SERVER_CONTROLLER //500 controller
    }

}

//função para retorar todos os filmes  
const listarFilme = async function(){
    let messageJSON = JSON.parse(JSON.stringify(config_message))

    try {
        //chama a função do dao para retornar a lista de todos os filmes 
        let result = await filmeDAO.selectAllfilme()

        //Validação para verificar se o DAO conseguiu processar os dados
        if(result){
            //validação para verificar se existe conteúdo no array
            if(result.length > 0){
                messageJSON.DEFAULT_MESSAGE.status = messageJSON.SUCCESS_RESPONSE.status
                messageJSON.DEFAULT_MESSAGE.status_code = messageJSON.SUCCESS_RESPONSE.status_code
                messageJSON.DEFAULT_MESSAGE.response.count = result.length
                messageJSON.DEFAULT_MESSAGE.response.filme = result

                return messageJSON.DEFAULT_MESSAGE //200 devolve dados do filme 
            }else{
                return messageJSON.ERROR_NOT_FOUND
            }
        }else{
            return messageJSON.ERROR_INTERNAL_SERVER_MODEL //500 (model)
        }
        
    } catch (error) {
        return messageJSON.ERROR_INTERNAL_SERVER_CONTROLLER //500 (CONTROLLER)
    }
}

//função para buscar um filme pelo id
const buscarFilme = async function(id){
    let messageJSON = JSON.parse(JSON.stringify(config_message))

    try {
        //validação para garantir que o id seja válido 
        if( id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0){
            messageJSON.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return messageJSON.ERROR_BAD_REQUEST
        }else{
            let result = await filmeDAO.selectByIdFilme(id)

            if(result){
                if(result.length > 0){
                    messageJSON.DEFAULT_MESSAGE.status = messageJSON.SUCCESS_RESPONSE.status
                    messageJSON.DEFAULT_MESSAGE.status_code = messageJSON.SUCCESS_RESPONSE.status_code
                    messageJSON.DEFAULT_MESSAGE.response.filme = result

                    return messageJSON.DEFAULT_MESSAGE // 200
                }else{
                    return messageJSON.ERROR_NOT_FOUND // 404
                }
            }else{
                return messageJSON.ERROR_INTERNAL_SERVER_MODEL // 500 (model)
            }
        }
        
    } catch (error) {
        return messageJSON.ERROR_INTERNAL_SERVER_CONTROLLER //500 (CONTROLLER)
    }
}

//função para excluir um filme
const excluirFilme = async function(id){
    let messageJSON = JSON.parse(JSON.stringify(config_message))

    try {
        //validação do erro 400 e 404
        let resultBuscarID = await buscarFilme(id)
        // validação para verificar se o status é verdadeiro(se existe o filme)
        if(resultBuscarID.status){
            //chamar a função do dao para excluir o filme 
            let result = await filmeDAO.deleteFilme(id)

            if(result){
                return messageJSON.SUCCESS_DELETED_ITEM //200 (registro excluido)
            }else{
                return messageJSON.ERROR_INTERNAL_SERVER_MODEL//erro 500 model
            }

        }else{
            return resultBuscarID // 400 ou 404 ou 500
        }
        
    } catch (error) {
        return messageJSON.ERROR_INTERNAL_SERVER_CONTROLLER // 500 controller
    }
}

//função para validar todos os dados de filme(obrigatorios, quantidade de caracteres, etc...)
const validarDados = async function(filme){

    let messageJSON = JSON.parse(JSON.stringify(config_message))

    //Validação de dados para os atributos do filme (status 400)
    if(filme.nome == undefined || String(filme.nome).replaceAll(' ', '') == '' || filme.nome == null ||  filme.nome.length > 80){
        messageJSON.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400                                                                    //diferente de 10 por não pode ter menos ou mais
    }else if(filme.data_lancamento == undefined || filme.data_lancamento == '' || filme.data_lancamento == null ||  filme.data_lancamento.length != 10){
        messageJSON.ERROR_BAD_REQUEST.field = '[DATA_LANCAMENTO] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400
    }else if(filme.duracao == undefined || filme.duracao == '' || filme.duracao == null ||  filme.duracao.length <= 5){
        messageJSON.ERROR_BAD_REQUEST.field = '[DURAÇÃO] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400
    }else if( filme.sinopse == undefined || String(filme.sinopse).replaceAll(' ', '') == '' || filme.sinopse == null){
        messageJSON.ERROR_BAD_REQUEST.field = '[SINOPSE] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400
    }else if(isNaN(filme.avaliacao) || filme.avaliacao.length > 3){
        messageJSON.ERROR_BAD_REQUEST.field = '[AVALIAÇÃO] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400
    }else if( filme.valor == undefined || filme.valor == '' || filme.valor == null || isNaN(filme.valor) || filme.valor.split('.')[0].length > 3){
        messageJSON.ERROR_BAD_REQUEST.field = '[VALOR] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST //400
    }else if(filme.capa.length > 255){
        messageJSON.ERROR_BAD_REQUEST.field = '[CAPA] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST
    }else{
        return false
    }
}

module.exports = {
    inserirNovoFilme,
    validarDados,
    listarFilme,
    buscarFilme,
    atualizarFilme,
    excluirFilme
}