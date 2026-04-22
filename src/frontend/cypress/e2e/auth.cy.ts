describe('Authentification Flow', () => {
  const testUser = {
    name: "Test User",
    email: "test@gmail.com",
    password: "password123"
  }

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('can register a new user', () => {
    cy.visit('/register')

    cy.get('input[type="text"]').first().type(testUser.name)
    cy.get('input[type="email"]').type(testUser.email)
    cy.get('input[type="password"]').type(testUser.password)

    cy.get('button[type="submit"]').click()

  })

  it('can login with a valid credential', () => {
    cy.visit('/login')

    cy.get('input[type="email"]').type(testUser.email)
    cy.get('input[type="password"]').type(testUser.password)

    cy.get('button[type="submit"]').click()

  })
})