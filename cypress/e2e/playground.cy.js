/// <reference types="cypress" />

describe('Cypress Playground', () => {
    
    beforeEach('Acessar site cypress playground', () => {
        cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
    });
    
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
    });

    it('shows signature preview check', () => {
        const message = 'Diego chegou aqui para escrever um texto e clicar no button check e uncheck';
        cy.get('#signature-textarea-with-checkbox').type(message);
        cy.get('#signature-checkbox').check();
        cy.get('#signature-triggered-by-check').should('have.text', message);
        cy.get('#signature-checkbox').uncheck();
        cy.contains('#signature-triggered-by-check', message).should('not.exist');
    });

    it('ckeck on off', () => {
        cy.contains('#on-off', 'ON').should('be.visible');
        cy.get('#off').check();
        cy.contains('#on-off', 'OFF').should('be.visible');
        cy.contains('#on-off', 'ON').should('not.exist');
        cy.get('#on').check();
        cy.contains('#on-off', 'ON').should('be.visible');
        cy.contains('#on-off', 'OFF').should('not.exist');
    });

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
    });

    it('uploads a file and asserts the correct file name appears as a paragraph', () => {
        cy.get('#file-upload').selectFile('./cypress/fixtures/example.json');
        cy.contains('#file', 'The following file has been selected for upload: example.json').should('be.visible');
    });

    it('click a button and triggers a request', () =>   {
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1').as('getTodo');
        cy.contains('button', 'Get TODO').click();
        cy.wait('@getTodo').its('response.statusCode').should('be.equal', 200);

        cy.contains('li', 'TODO ID: 1').should('be.visible');
        cy.contains('li', 'Title: delectus aut autem').should('be.visible');
        cy.contains('li', 'Completed: false').should('be.visible');
        cy.contains('li', 'User ID: 1').should('be.visible');
    });

    it('clicks a button and triggers a stubbed request', () => {
        const todo = require('../fixtures/todo');

        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1', {fixture: 'todo' }).as('getTodo');
        cy.contains('button', 'Get TODO').click();
        cy.wait('@getTodo').its('response.statusCode').should('be.equal', 200);

        cy.contains('li', `TODO ID: ${todo.id}`).should('be.visible');
        cy.contains('li', `Title: ${todo.title}`).should('be.visible');
        cy.contains('li', `Completed: ${todo.completed}`).should('be.visible');
        cy.contains('li', `User ID: ${todo.userId}`).should('be.visible');
    });

    it('clicks a button and simulates an API failure', () => {
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1', { statusCode: 500 }).as('serverFailure');
        cy.contains('button', 'Get TODO').click();
        cy.wait('@serverFailure').its('response.statusCode').should('be.equal', 500);

        cy.contains('.error',  'Oops, something went wrong. Refresh the page and try again.').should('be.visible');
    });

    it('clicks a button and simulates a network failure', () => {
        cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1', { forceNetworkError: true }).as('networkError');
        cy.contains('button', 'Get TODO').click();
        cy.wait('@networkError');

        cy.contains('span',  'Oops, something went wrong. Check your internet connection, refresh the page, and try again.').should('be.visible');
    });

    it('makes an HTTP request and asesrts on the retirned status code', () => {
        cy.request('GET', 'https://jsonplaceholder.typicode.com/todos/1').its('status').should('be.equal', 200);
    });


    Cypress._.times(10, index => {
        it(`selects ${index + 1} out of 10`, () => {
            cy.get('#level').invoke('val', index + 1).trigger('change');
            cy.contains('p', `You're on level: ${index + 1}`).should('be.visible');
        });
    });

    it('select a date and asserts the correct date has been displayed', () => {
        cy.get('#date').type('2024-08-24').blur();

        cy.contains('p', "The date you've selected is: 2024-08-24").should('be.visible');
    });

    it('types a password based on a protected varaible', () => {
        cy.get('#password').type(Cypress.env('password'), {log: false});

        cy.get('#show-password-checkbox').check();

        cy.get('#password-input input[type="password"]').should('not.exist');
        cy.get('#password-input input[type="text"]').should('be.visible').and('have.value', Cypress.env('password'));

        cy.get('#show-password-checkbox').uncheck();

        cy.get('#password-input input[type="password"]').should('be.visible');
        cy.get('#password-input input[type="text"]').should('not.exist');
    });

    it.only('counts the number of animals in a list', () => {
        cy.get('ul#animals li').should('have.length', 5);
    });
})