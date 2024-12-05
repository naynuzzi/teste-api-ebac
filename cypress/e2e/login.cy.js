/// <reference types="cypress" />

describe('Login teste de API', () => {

    it('Deve fazer login com sucesso', () => {
        cy.request({
            method: 'POST',
            url: 'login',
            body: {
               "email": "nanyqA@qa.com.br",
               "password": "testeQA" ,
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Login realizado com sucesso')
            cy.log(response.body.authorization)
        })
    });

});
