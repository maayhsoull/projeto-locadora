/******************************************************************************
objetivo: Arquivo responsável pelo CRUD no banco de dados mySQL na tabela genero
data: 06/05/2026
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

//função para gerar script de insert no banco
const insertGenero = async function(genero){
    try {
            //script que será enviado para o banco através da variável sql
        let sql =  `insert into tbl_genero (nome)
                    values ('${genero.nome}');`

        //vai execurar o scriptSQL no banco de dados
        let result = await knexConex.raw(sql)

        if(result)
            //retorna o id gerado no banco
            return result[0].insertId
        else
            return false

    } catch (error) {
        // console.log(error)
        return false        
    }
}

//função para gerar o script de update no banco 
const updateGenero = async function(genero){
    try {
        let sql =  `update tbl_genero set
                        nome = '${genero.nome}'
                    where id = ${genero.id}`

        //vai execurar o scriptSQL no banco de dados
        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

//função para gerar o script de select by id no banco
const selectByIdGenero = async function(id){
    try {
        let sql = `select * from tbl_genero where id=${id}`
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

//função para gerar o script de select no banco
const selectAllGenero = async function () { // retorna todos os filmes
    try {

        let sql = `select * from tbl_genero order by id desc` //order by para trazer em uma ordem em especifico //desc para trazer em ordem decrecente 

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

const deleteGenero = async function(id) {
    try {
        let sql = `delete from tbl_genero where id=${id}`

        let result = await knexConex.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        return false
    }
    
}


module.exports = {
    insertGenero,
    updateGenero,
    selectByIdGenero,
    selectAllGenero,
    deleteGenero
}
