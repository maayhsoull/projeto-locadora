/******************************************************************************
objetivo: Arquivo responsável pelo CRUD no banco de dados mySQL na tabela filme
data: 15/04/2026
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

// Função para inserir dados na tabela de filme
const insertFilme = async function(filme){
    try {
        
        let sql = `insert into tbl_filme (	
                            nome, 
                            data_lancamento, 
                            duracao, 
                            sinopse, 
                            avaliacao, 
                            valor, 
                            capa
                            )
                    values ('${filme.nome}', 
                            '${filme.data_lancamento}',
                            '${filme.duracao}',
                            '${filme.sinopse}', 
                            if('${filme.avaliacao}' = '', null, '${filme.avaliacao}'), 
                            '${filme.valor}',
                            '${filme.capa}'
                    );`


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

//funçao para atualizar um filme existente na tabela
const updateFilme = async function(filme) {
    try {
        let sql = `update tbl_filme set
                        nome            = '${filme.nome}',
                        data_lancamento = '${filme.data_lancamento}',
                        duracao         = '${filme.duracao}',
                        sinopse         = '${filme.sinopse}',
                        avaliacao       = if('${filme.avaliacao}' = '', null, '${filme.avaliacao}'),
                        valor           = '${filme.valor}',
                        capa            = '${filme.capa}'              
                    where id = ${filme.id}`

        let result = await knexConex.raw(sql) 

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

//Função para retornar todos os dados da tabela de filmes
const selectAllfilme = async function() { //vai trazer todos os filmes, independente da quantidade
    try {
        //script para retornar todos os filmes 
        let sql = `select * from tbl_filme order by id desc` //order by para trazer em uma ordem em especifico //desc para trazer em ordem decrecente 
        //Executa no bando de dados o scriptSQL para retornar todos os filmes
        let result = await knexConex.raw(sql)

        //validação para verificar se o retorno no BD é um array
        //se o scriptSQL ser erro, não devolve um array
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

        // console.log(result)
    } catch (error) {
        return false
    }
}

//Função para retornar os dados do filme filtrando pelo id
const selectByIdFilme = async function(id){
    try {
        let sql = `select * from tbl_filme where id=${id}`
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

//Função para excluir um filme pelo ID 
const deleteFilme = async function(id){
    try {
        let sql = `delete from tbl_filme where id=${id}`

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
    insertFilme,
    updateFilme,
    selectAllfilme,
    selectByIdFilme,
    deleteFilme
}

// selectAllfilme()