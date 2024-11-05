/// <reference types="cypress" />

describe('Cypress Playground', () => {
    
    beforeEach('Acessar site cypress playground', () => {
        cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
    })
    
    it('shows a prmotional banner', () => {
        cy.get('#promotional-banner').should(('be.visible'));
    });

    it('clicks the subscribe button and shows a success message', () => {
        cy.contains('button', 'Subscribe').click();
        cy.get('#success').should('be.visible')
        cy.get('#success').should('have.text', "You've been successfully subscribed to our newsletter.");
    });

    it('sign here', () => {
        const message = 'Diego chegou aqui para escrever um texto';
        cy.get('#signature-textarea').type(message);
        cy.get('#signature').should('be.visible')
        cy.get('#signature').should('have.text', message);
    })

    it('shows signature preview check', () => {
        const message = 'Diego chegou aqui para escrever um texto e clicar no button check e uncheck';
        cy.get('#signature-textarea-with-checkbox').type(message);
        cy.get('#signature-checkbox').check();
        cy.get('#signature-triggered-by-check').should('have.text', message);
        cy.get('#signature-checkbox').uncheck();
        cy.contains('#signature-triggered-by-check', message).should('not.exist');
    })

    it('ckeck on off', () => {
        cy.contains('#on-off', 'ON').should('be.visible');
        cy.get('#off').check();
        cy.contains('#on-off', 'OFF').should('be.visible');
        cy.contains('#on-off', 'ON').should('not.exist');
        cy.get('#on').check();
        cy.contains('#on-off', 'ON').should('be.visible');
        cy.contains('#on-off', 'OFF').should('not.exist');
    })

    it('select options', () => {
        cy.contains('#select-selection', "You haven't selected a type yet.").should(('be.visible'));
        cy.get('#selection-type').select('Basic');
        cy.contains('#select-selection', "You've selected: BASIC").should('be.visible');
    });

    it('multi selection options', () => {
        const fruitSelect = [
            'apple',
            'cherry',
            'elderberry'
        ];  
        
        cy.contains('#fruits-paragraph', "You haven't selected any fruit yet.").should('be.visible');
        cy.get('#fruit').select(fruitSelect);
        cy.contains('#fruits-paragraph', `You've selected the following fruits: ${fruitSelect.join(', ')}`).should('be.visible');
    })

    it.only('uploads a file and asserts the correct file name appears as a paragraph', () => {
        cy.get('#file-upload').selectFile('./cypress/fixtures/example.json');
        cy.contains('#file', 'The following file has been selected for upload: example.json').should('be.visible');
    })

})