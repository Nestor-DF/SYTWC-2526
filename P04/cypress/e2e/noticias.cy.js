describe('Página Noticias', () => {

    it('Carga la página de noticias y muestra el componente Noticia', () => {

        cy.visit('/noticias', {
            onBeforeLoad(win) {
                // Mock de location.state para que tenga customId
                win.history.replaceState({ customId: 'esp-1' }, '', '/noticias')
            }
        })

        // Contenedor principal
        cy.get('[data-testid="noticias-container"]').should('exist')
    })

})
