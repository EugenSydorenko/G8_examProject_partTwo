describe('Api endpoints test suite', () => {

    before(() => {
        // Login and save accessToken before the tests run
        cy.request({
            method: 'POST',
            url: `/login`,
            body: {
                email: 'eugensydorenko@gmail.com',
                password: 'bestPassw0rd'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            
            // Save the accessToken and user information for later use
            Cypress.env('accessToken', response.body.accessToken);
            Cypress.env('userId', response.body.user.id);
            Cypress.env('userEmail', response.body.user.email);
        });
    });

    it('1  Get all posts. Verify HTTP response status code and content type.', () => {
        cy.request('GET', '/posts')
            .then((response) => {
                // Verify status code
                expect(response.status).to.eq(200);

                // Verify content type
                expect(response.headers['content-type']).to.include('application/json');
            })
    })

    it('2 Get only first 10 posts. Verify HTTP response status code. Verify that only first posts are returned.', () => {
        cy.request('GET', '/posts?_limit=10')
            .then((response) => {

                // Verify status code
                expect(response.status).to.eq(200);

                // Verify that exactly 10 posts are returned
                expect(response.body).to.have.lengthOf(10);
            });
    });

    it('3 Get posts with id = 55 and id = 60. Verify HTTP response status code. Verify id values of returned records.', () => {
        cy.request('GET', '/posts?id=55&id=60')
            .then((response) => {
                // Verify status code
                expect(response.status).to.eq(200);

                // Verify that exactly 2 posts are returned
                expect(response.body).to.have.lengthOf(2);

                // Verify id values of returned records
                const ids = response.body.map(post => post.id);
                expect(ids).to.include(55);
                expect(ids).to.include(60);
            });
    });

    it('4 Create a post. Verify HTTP response status code.', () => {
        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: Cypress.env('userId')
        };

        cy.request({
            method: 'POST',
            url: '/664/posts',
            body: newPost,
            failOnStatusCode: false
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(401); // Assuming the post creation should be successful
        });
    });

    it('5 Create post with adding access token in header. Verify HTTP response status code. Verify post is created.', () => {

        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: Cypress.env('userId')
        };

        cy.request({
            method: 'POST',
            url: '/664/posts',
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            body: newPost
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(201);

            // Verify post is created
            expect(response.body).to.include(newPost);
        });
    });

    it('6 Create post entity and verify that the entity is created. Verify HTTP response status code. Use JSON in body.', () => {
        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: Cypress.env('userId')
        };

        cy.request({
            method: 'POST',
            url: `/posts`,
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            body: newPost,
            failOnStatusCode: false // This is optional, depending on how you want to handle errors
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(201);

            // Verify post is created correctly
            expect(response.body).to.have.property('id');
            expect(response.body).to.include({
                title: newPost.title,
                body: newPost.body,
                userId: newPost.userId
            });
        });
    });

    it('7 Update non-existing entity. Verify HTTP response status code.', () => {
        const updatedPost = {
            title: 'Updated Post Title',
            body: 'Updated content for non-existing post.',
            userId: Cypress.env('userId')
        };

        // Using a non-existing post ID (e.g., 999999)
        const nonExistingPostId = 999999;

        cy.request({
            method: 'PUT',
            url: `/posts/${nonExistingPostId}`,
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            body: updatedPost,
            failOnStatusCode: false // Do not fail the test on non-2xx status codes
        }).then((response) => {
            
            // Verify status code
            expect(response.status).to.eq(404);
        });
    });

    it('8 should create a post entity, update the created entity, and verify response', () => {
        const newPost = {
            title: 'Initial Post Title',
            body: 'Initial content for the new post.',
            userId: Cypress.env('userId')
        };

        cy.request({
            method: 'POST',
            url: `/posts`,
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            body: newPost
        }).then((createResponse) => {
            // Verify post creation
            expect(createResponse.status).to.eq(201);
            const createdPostId = createResponse.body.id;

            const updatedPost = {
                title: 'Updated Post Title',
                body: 'Updated content for the post.',
                userId: Cypress.env('userId')
            };

            cy.request({
                method: 'PUT',
                url: `/posts/${createdPostId}`,
                headers: {
                    Authorization: `Bearer ${Cypress.env('accessToken')}`
                },
                body: updatedPost
            }).then((updateResponse) => {
                // Verify status code
                expect(updateResponse.status).to.eq(200);

                // Verify the post is updated correctly
                expect(updateResponse.body).to.include({
                    title: updatedPost.title,
                    body: updatedPost.body,
                    userId: updatedPost.userId
                });
            });
        });
    });
    it('9 should fail to delete a non-existing post entity and verify response', () => {
        // Using a non-existing post ID (e.g., 999999)
        const nonExistingPostId = 999999;

        cy.request({
            method: 'DELETE',
            url: `/posts/${nonExistingPostId}`,
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            failOnStatusCode: false // Do not fail the test on non-2xx status codes
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(404);
        });
    });

    it('10 should create a post entity, update the created entity, delete the entity, and verify it is deleted', () => {
        const newPost = {
            title: 'Initial Post Title',
            body: 'Initial content for the new post.',
            userId: Cypress.env('userId')
        };

        cy.request({
            method: 'POST',
            url: `/posts`,
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            body: newPost
        }).then((createResponse) => {
            // Verify post creation
            expect(createResponse.status).to.eq(201);
            const createdPostId = createResponse.body.id;

            const updatedPost = {
                title: 'Updated Post Title',
                body: 'Updated content for the post.',
                userId: Cypress.env('userId')
            };

            cy.request({
                method: 'PUT',
                url: `/posts/${createdPostId}`,
                headers: {
                    Authorization: `Bearer ${Cypress.env('accessToken')}`
                },
                body: updatedPost
            }).then((updateResponse) => {
                // Verify status code
                expect(updateResponse.status).to.eq(200);

                // Verify the post is updated correctly
                expect(updateResponse.body).to.include({
                    title: updatedPost.title,
                    body: updatedPost.body,
                    userId: updatedPost.userId
                });

                // Delete the updated post
                cy.request({
                    method: 'DELETE',
                    url: `/posts/${createdPostId}`,
                    headers: {
                        Authorization: `Bearer ${Cypress.env('accessToken')}`
                    }
                }).then((deleteResponse) => {
                    // Verify status code
                    expect(deleteResponse.status).to.eq(200);

                    // Verify the post is deleted
                    cy.request({
                        method: 'GET',
                        url: `/posts/${createdPostId}`,
                        headers: {
                            Authorization: `Bearer ${Cypress.env('accessToken')}`
                        },
                        failOnStatusCode: false
                    }).then((getResponse) => {
                        // Verify status code
                        expect(getResponse.status).to.eq(404);
                    });
                });
            });
        });
    });
})