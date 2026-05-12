/**********************************************************************************************************
 * Objetivo: Arquivo responsável pela validação tratamento e manipulação de dados para o CRUD de atividades
 * data: 06/05/2026
 * Autor: May
 * Versão: 1.0 
 *********************************************************************************************************/

//import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//import do arquivo DAO para fazer o CRUD do filme no banco de dados
const atividadesDAO = require('../../model/DAO/atividades/atividades.js')

const inserirNovaAtividade = async function(atividade, contentType){
    let messageJSON = JSON.parse(JSON.stringify(config_message))
    try {
        if(String(contentType).toLowerCase() == 'application/json'){

            let validar = await validarDados(atividade)

            if(validar){
                
                return validar
                
            }else{

                let result = await atividadesDAO.insertAtividade(atividade)
                

                if(result){
                    atividade.id = result
                    messageJSON.DEFAULT_MESSAGE.status =        messageJSON.SUCCESS_CREATED_ITEM.status
                    messageJSON.DEFAULT_MESSAGE.status_code =   messageJSON.SUCCESS_CREATED_ITEM.status_code
                    messageJSON.DEFAULT_MESSAGE.message =       messageJSON.SUCCESS_CREATED_ITEM.message
                    messageJSON.DEFAULT_MESSAGE.response = atividade
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

const buscarAtividade = async function(id) {

    let messageJSON = JSON.parse(JSON.stringify(config_message))
    try {
        if( id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0){
            messageJSON.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return messageJSON.ERROR_BAD_REQUEST //400
        }else{
            let result = await atividadesDAO.selectByIdAtividade(id)

            if(result){
                if(result.length > 0){//resultado do select se tiver algo vai ter algo maior que zero 
                                        //isto é se o banco encotrou algo 
                    messageJSON.DEFAULT_MESSAGE.status = messageJSON.SUCCESS_RESPONSE.status
                    messageJSON.DEFAULT_MESSAGE.status_code = messageJSON.SUCCESS_RESPONSE.status_code
                    messageJSON.DEFAULT_MESSAGE.response.atividade = result

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

const listarAtividades = async function(){

    let messageJSON = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await atividadesDAO.selectAllAtividades()
        
        if(result){
            if(result.length > 0){
                messageJSON.DEFAULT_MESSAGE.status = messageJSON.SUCCESS_RESPONSE.status
                messageJSON.DEFAULT_MESSAGE.status_code = messageJSON.SUCCESS_RESPONSE.status_code
                messageJSON.DEFAULT_MESSAGE.response.count = result.length
                messageJSON.DEFAULT_MESSAGE.response.atividade = result

                return messageJSON.DEFAULT_MESSAGE
            }else{
                return messageJSON.ERROR_NOT_FOUND
            }

        }else{
            return messageJSON.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return messageJSON.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarAtividade = async function(atividade, id,contentType){
    
    let messageJSON = JSON.parse(JSON.stringify(config_message))

    try {
        //no update a primeira validação necessária
        //a se fazer é verificar se o que chegou é um json
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarAtividade = await buscarAtividade(id)

            if(resultBuscarAtividade.status){
                let validar = await validarDados(atividade)

                if(!validar){
                    atividade.id = Number(id)

                    let result = await atividadesDAO.updateAtividade(atividade)

                    if(result){

                        messageJSON.DEFAULT_MESSAGE.status      = messageJSON.SUCCESS_UPDATED_ITEM.status
                        messageJSON.DEFAULT_MESSAGE.status_code = messageJSON.SUCCESS_UPDATED_ITEM.status_code
                        messageJSON.DEFAULT_MESSAGE.message     = messageJSON.SUCCESS_UPDATED_ITEM.message
                        messageJSON.DEFAULT_MESSAGE.response    = atividade

                        return messageJSON.DEFAULT_MESSAGE // 200 atualizado

                    }else{
                        return messageJSON.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else{
                    return validar
                }
            }else{
                return resultBuscarAtividade
            }
        }else{
            return messageJSON.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        return messageJSON.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const validarDados = async function(atividade){

    let messageJSON = JSON.parse(JSON.stringify(config_message))
    
    //validação do atributo nome (status 400)
    if(atividade.nome == undefined || String(atividade.nome).replaceAll(' ', '') == '' || atividade.nome == null || atividade.nome.length > 50){
        messageJSON.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return messageJSON.ERROR_BAD_REQUEST // 400
    }else{
        return false
    }

}



module.exports = {
    inserirNovaAtividade,
    buscarAtividade,
    listarAtividades,
    atualizarAtividade
}