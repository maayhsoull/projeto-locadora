/*************************************************************************************
 * Objetivo: Arquivo responsável pela configuração e padronização das mensagens da API
 * Data: 17/04/2026
 * Autor: May
 * Versão: 1.0 
 *************************************************************************************/

//Padronização de cabeçalho para retorno dos endpoints da API
const DEFAULT_MESSAGE = {
    api_description:    'API para gerenciar o controle de filmes',
    desenvolvedor:      'May Martins de Andrade',
    version:            '1.0.4.26',
    status:             Boolean,
    status_code:        Number,
    response:           {}
}

//Mensagens de erro da API
const ERROR_BAD_REQUEST = {
    status:         false,
    status_code:    400,
    message:        'Os dados enviados na requisição não estão corretos!'
}

const ERROR_INTERNAL_SERVER_MODEL = {
    status:         false,
    status_code:    500,
    message:        'Não foi possível processar a requisição por conta de erro na API [ERRO NA MODELAGEM DE DADOS].'
}

const ERROR_INTERNAL_SERVER_CONTROLLER = {
    status:         false,
    status_code:    500,
    message:        'Não foi possível processar a requisição por conta de erro na API [ERRO NA CONTROLLER DE DADOS].'
}

const ERROR_CONTENT_TYPE = {
    status:         false,
    status_code:    415,
    message:        'Não foi possível processar a requisição pois o formato de dados aceito pela API é somente JSON'
}

const ERROR_NOT_FOUND = {
    status:         false,
    status_code:    404,
    message:        'Não foi encontrado nenhum dado para retorno!'
}

//mensagens de sucesso da API
const SUCCESS_CREATED_ITEM = {
    status:         true,
    status_code:    201,
    message:        'Registro inserido com sucesso!'
}

//retornos para get 200
const SUCCESS_RESPONSE = {
    status:         true,
    status_code:    200
}

//returonos para put 200
const SUCCESS_UPDATED_ITEM = {
    status:         true,
    status_code:    200,
    message: 'Item atualizado com sucesso!'
}

//retorno para delete (200 ou 204)
const SUCCESS_DELETED_ITEM = {
    status:         true,
    status_code:    200,
    message: 'Registro excluido com sucesso!'
}


module.exports = {
    DEFAULT_MESSAGE,
    ERROR_BAD_REQUEST,
    ERROR_INTERNAL_SERVER_MODEL,
    SUCCESS_CREATED_ITEM,
    ERROR_CONTENT_TYPE,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_CONTROLLER,  
    SUCCESS_RESPONSE,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_DELETED_ITEM
    
}