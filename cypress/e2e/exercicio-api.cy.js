/// <reference types="cypress" />
import contratos from '../contratos/usuarios.contrato'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {
  let token
  before(() => {
      cy.token('nanyqA@qa.com.br', 'testeQA')
        .then(tkn => { token = tkn })
  });
  beforeEach(() => {
    let nome = 'Usuario EBAC editado' + Math.floor(Math.random() * 1000)
    let email = faker.internet.email()
    let senha = faker.internet.password()
    let admin = faker.datatype.boolean()
  });

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contratos.validateAsync(response.body)
    })
   
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method:'GET',
      url: 'usuarios'
    }).should((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let nome = 'Usuario EBAC' + Math.floor(Math.random() * 1000);
    let email = nome.toLowerCase().replace(' ', '') + '@test.com';  
    let senha = 'senha123';  
    cy.request({
      method: 'POST',
      url: 'usuarios',  
      body: {
        "nome": nome,
        "email": email,
        "password": senha,
        "administrador": "true"
      }
    }).should((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Cadastro realizado com sucesso');  
    });
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      havers: {authorization: token},
      body: {
        "nome": 'Nayara Marques Nuzzi',
        "email": 'nayQa@qa.com.br',
        "password": "testeQA",
        "administrador": "true"
      },failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal('Este email já está sendo usado')
      
    })
    
  });

  it.only('Deve editar um usuário previamente cadastrado', () => {
    let nome = 'Usuario EBAC edit' + Math.floor(Math.random() * 1000);
    cy.alizarUsuario(token, nome, email, senha, admin)
     .then(response => {
       let id = response.body._id
       cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        headers: {authorization: token},
        body: {
          "nome": nome,
          "email": email,
          "password": "testeQA",
          "administrador": "true"
        }
      }).should(response => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      });
    });
    
  });
    
  it.only('Deve deletar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario(token, nome, email, senha, admin)
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`,
          headers: {authorization: token}
        }).then(response => {
          expect(response.body.message).to.equal('Registro excluído com sucesso')
          expect(response.status).to.equal(200)
        })
      })
     
  });
 

  it('Deve cadastrar um usuário utilizando o compomente com sucesso', () => {
      
      cy.cadastrarUsuario(token, nome, email, senha, admin.toString())
      .then(response => {
        let id = response.body._id
      }).should((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      })
  })

});