#cria o database do projeto de filmes
create database db_filmes_2026_a;

#ativa o uso do database de filmes
use db_filmes_2026_a;

#cria a tabela de filme
create table tbl_filme(
	id 				int not null primary key auto_increment,
	nome 			varchar(80) not null,
    data_lancamento date not null,
    ducarao 		time not null,
    sinopse			text not null,
    avaliacao		decimal(3,2) default null,
    valor			decimal(5,2) not null default 0,
    capa			varchar(255)
);

show tables;

#ordem dos valores é a mesma ordem dos atributos
#todos os valores deverão ser inseridos entre aspas, exceto atributos do tipo inteiro
#Inserir dados

insert into tbl_filme (	nome, 
						data_lancamento, 
                        ducarao, 
                        sinopse, 
                        avaliacao, 
                        valor, 
                        capa
						)
values ('Super Mario Galaxy: O filme', 
		'2026-04-02', 
        '01:39:00', 
        'Uma nova aventura leva Mario a enfrentar um inédito e ameaçador super vilão. Em Super Mario Galaxy: O Filme, 
		 o bigodudo encanador italiano e seus aliados embarcam numa aventura galáctica repleta de ação e momentos 
         emocionantes depois de salvar o Reino dos Cogumelos.', 
         '3',
         '50.70',
         'https://br.web.img3.acsta.net/c_310_420/img/5b/ea/5bea1aeac3323aeaaf82449a34fafbbf.jpg'
		);
        
        
alter table tbl_filme
	change column ducarao duracao time;
    
select * from tbl_filme;

delete from tbl_filme where id > 0;

#cria a tabela de genero
create table tbl_genero(
	id 				int not null primary key auto_increment,
	nome 			varchar(30) not null
);

#Inserir dados
insert into tbl_genero (nome)
values ('terror');

select * from tbl_genero;

insert into tbl_genero (nome)
values ('suspense');

update tbl_genero set
					nome = 'teste update banco'
                    where id = 13;

create table tbl_atividade(
	id 				int not null primary key auto_increment,
	nome 			varchar(50) not null
);



