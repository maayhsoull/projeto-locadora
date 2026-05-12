/******************************************************************************************************
 * Objetivo: Arquivo responsável pela validação tratamento e manipulação de dados para o CRUD de genero
 * data: 06/05/2026
 * Autor: May
 * Versão: 1.0 
 ******************************************************************************************************/

//import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//import do arquivo DAO para fazer o CRUD do filme no banco de dados
const generoDAO = require('../../model/DAO/genero/genero.js')

const inserirNovoGenero = async function(genero, contentType){
    let messageJSON = JSON.parse(JSON.stringify(config_message))
    try {
        if(String(contentType).toLowerCase() == 'application/json'){

            let validar = await validarDados(genero)

            if(validar){
                
                return validar
                
            }else{

                let result = await generoDAO.insertGenero(genero)
                

                if(result){
                    genero.id = result
                    messageJSON.DEFAULT_MESSAGE.status =        messageJSON.SUCCESS_CREATED_ITEM.status
                    messageJSON.DEFAULT_MESSAGE.status_code =   messageJSON.SUCCESS_CREATED_ITEM.status_code
                    messageJSON.DEFAULT_MESSAGE.message =       messageJSON.SUCCESS_CREATED_ITEM.message
                    messageJSON.DEFAULT_MESSAGE.response = genero
                }else{
                    return messageJSON.ERROR_INTERNAL_SERVER_MODEL // 500(MODEL)
                }

                return messageJSON.DEFAULT_MESSAGE
            }
        }else{
            return messageJSON.ERROR_CONTENT_TYPE //415 pois se o formato estiver errado ele retorna erro
        }   
        
    } catch (error) {
        return messageJSON.ERROR_INTERNAL_SERVER_CONTROLLER //500 erro na controller
    }
}

const atualizarGenero = async function(genero, id, contentType){

    let messageJSON = JSON.parse(JSON.stringify(config_message))
    
    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarGenero = await buscarGenero(id)

            if(resultBuscarGenero.status){

                let validar = await validarDados(genero)

                if(!validar){
                    genero.id = Number(id)

                    let result = await generoDAO.updateGenero(genero)

                    if(result){
                        messageJSON.DEFAULT_MESSAGE.status      = messageJSON.SUCCESS_UPDATED_ITEM.status
                        messageJSON.DEFAULT_MESSAGE.status_code = messageJSON.SUCCESS_UPDATED_ITEM.status_code
                        messageJSON.DEFAULT_MESSAGE.message     = messageJSON.SUCCESS_UPDATED_ITEM.message
                        messageJSON.DEFAULT_MESSAGE.response    = genero

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
        return messageJSON.ERROR_INTERNAL_SERVER_CONTROLLER //erro na controller
    }

}

const listarGenero = async function() {
    let messageJSON = JSON.parse(JSON.stringify(config_message))

    try {
        //chama a função do dao para retornar a lista de todos os filmes 
        let result = await generoDAO.selectAllGenero()

        //Validação para verificar se o DAO conseguiu processar os dados
        if(result){
            //validação para verificar se existe conteúdo no array
            if(result.length > 0){
                messageJSON.DEFAULT_MESSAGE.status = messageJSON.SUCCESS_RESPONSE.status
                messageJSON.DEFAULT_MESSAGE.status_code = messageJSON.SUCCESS_RESPONSE.status_code
                messageJSON.DEFAULT_MESSAGE.response.count = result.length
                messageJSON.DEFAULT_MESSAGE.response.genero = result

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

const buscarGenero = async function(id) {

    let messageJSON = JSON.parse(JSON.stringify(config_message))
    try {
        if( id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0){
            messageJSON.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return messageJSON.ERROR_BAD_REQUEST //400
        }else{
            let result = await generoDAO.selectByIdGenero(id)

            if(result){
                if(result.length > 0){//resultado do select se tiver algo vai ter algo maior que zero 
                                        //isto é se o banco encotrou algo 
                    messageJSON.DEFAULT_MESSAGE.status = messageJSON.SUCCESS_RESPONSE.status
                    messageJSON.DEFAULT_MESSAGE.status_code = messageJSON.SUCCESS_RESPONSE.status_code
                    messageJSON.DEFAULT_MESSAGE.response.genero = result

                    return messageJSON.DEFAULT_MESSAGE // 200
                }else{
                    return messageJSON.ERROR_NOT_FOUND // 404
                }
            }else{
                return messageJSON.ERROR_INTERNAL_SERVER_MODEL // 500 (model)
            }
        }
    } catch (error) {
        return messageJSON.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }    
    
}

const excluirGenero = async function(id) {

    let messageJSON = JSON.parse(JSON.stringify(config_message))

    try {
        let resultBudcarId = await buscarGenero(id)

        if(resultBudcarId.status){
            let result = await generoDAO.deleteGenero(id)

            //validação da model
            if(result){
                return messageJSON.SUCCESS_DELETED_ITEM
            }else{
                return messageJSON.ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            return resultBudcarId // 400 ou 404 ou 500
        }
        
    } catch (error) {
        return messageJSON.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
    
}

const validarDados = async function(genero){

    let messageJSON = JSON.parse(JSON.stringify(config_message))
    
    //validação do atributo nome (status 400)
    if(genero.nome == undefined || String(genero.nome).replaceAll(' ', '') == '' || genero.nome == null || genero.nome.length > 30){
        messageJSON.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST // 400
    }else{
        return false
    }

}

module.exports = {
    inserirNovoGenero,
    buscarGenero,
    listarGenero,
    atualizarGenero,
    excluirGenero
}