class User {

    constructor() {
        this.urlRegister = '/register';
    }

    signUpNewUser(newUserEmail, newUserPassword = 'bestPassw0rd') {
        cy.log('Creating new user');
        return cy.request({
            method: 'POST',
            url: this.urlRegister,
            body: {
                email: newUserEmail,
                password: newUserPassword
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            // Save the accessToken and user information for later use
            Cypress.env('accessToken', response.body.accessToken);
            Cypress.env('userId', response.body.user.id);
            Cypress.env('userEmail', response.body.user.email);
            return {
                accessToken: response.body.accessToken,
                userId: response.body.user.id,
                userEmail: response.body.user.email
            };
        });
    }
}

export default new User();