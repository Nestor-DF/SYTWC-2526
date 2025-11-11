describe('Página de inicio', () => {
    it('Carga la página de inicio y muestra los 3 espacios culturales', () => {

        // Navega a la home
        cy.visit('/')

        // Verifica que la página existe
        cy.get('[data-testid="home-page"]').should('exist')

        // Verifica que existe el contenedor principal
        cy.get('[data-testid="espacios-container"]').should('exist')

        // Verifica que existen exactamente 3 espacios
        cy.get('[data-testid^="espacio-wrapper"]').should('have.length', 3)

        // Comprueba que cada espacio cultural está presente
        cy.get('[data-testid="espacio-wrapper-1"]').should('exist')
        cy.get('[data-testid="espacio-wrapper-2"]').should('exist')
        cy.get('[data-testid="espacio-wrapper-3"]').should('exist')
    })
})
