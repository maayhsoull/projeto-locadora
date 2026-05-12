/******************************************************************************
objetivo: Arquivo responsável pelo CRUD no banco de dados mySQL na tabela atividade
data: 08/05/2026
autor: May
Versão: 1.0
*******************************************************************************/

/*
                                OBSERVAÇÕES
começar pelo insert, depois seguir com o select by id, depois select all, update, delete.
Pois assim da para reaproveitar funções na controller.

*/

//import da biblioteca para gerenciar o banco de dados Mysql no node.js
const knex = require('knex')

//import do arquivo de configuração para conexão com o bd mysql 
const knexConfig = require('../../database_config_knex/knexFile.js')

// criar a conexao com o banco de dados mysql
const knexConex = knex(knexConfig.development)

const insertAtividade = async function(atividade) {
    try {
        let sql =   `insert into tbl_atividades (nome)
                    values ('${atividade}')`
        
        let result = await knexConex.raw(sql) //roda o script no banco

        if (result){
            return result[0].insertId //retorna o id gerado no banco
        }else{
            return false
        }

    } catch (error) {
        return false
    }
    
}

const selectByIdAtividade = async function(id){
    try {
        let sql = `select * from tbl_atividades where id=${id}`
        let result = await knexConex.raw(sql)

        //validação para verificar se o retorno no BD é um array
        //se o scriptSQL ser erro, não devolve um array
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}

const selectAllAtividades = async function () {
    try {
        let sql = `select * from tbl_atividades order by id desc`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        return false
    }
    
}

const updateAtividade = async function(atividade) {
    try {
        let sql = `update tbl_atividades set
                        nome = '${atividade.nome}'
                    where id = ${atividade.id}`

        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}


module.exports = {
    insertAtividade,
    selectByIdAtividade,
    selectAllAtividades,
    updateAtividade
}