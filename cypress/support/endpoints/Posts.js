class Posts {

    constructor() {
        this.urlPosts = '/posts';
    }

    getAllPostsAndVerifyResponse() {
        cy.log('requesting all posts and verifying response');
        return cy.request('GET', this.urlPosts)
            .then((response) => {
                // Verify status code
                expect(response.status).to.eq(200);

                // Verify content type
                expect(response.headers['content-type']).to.include('application/json');
            })
    }

    getTenPostsAndVerifyResponse() {
        cy.request('GET', `${this.urlPosts}?_limit=10`)
            .then((response) => {

                // Verify status code
                expect(response.status).to.eq(200);

                // Verify that exactly 10 posts are returned
                expect(response.body).to.have.lengthOf(10);
            });
    }

    getPostsByIdsAndVerifyResponse(...ids) {
        const queryString = ids.map(id => `id=${id}`).join('&');

        return cy.request('GET', `${this.urlPosts}?${queryString}`)
            .then((response) => {
                // Verify status code
                expect(response.status).to.eq(200);

                // Verify that exactly the expected number of posts are returned
                expect(response.body).to.have.lengthOf(ids.length);

                // Verify id values of returned records
                const responseIds = response.body.map(post => post.id);
                ids.forEach(id => {
                    expect(responseIds).to.include(id);
                });
            });

    }

    createPostAndVerifyResponse(newPost) {
        return cy.request({
            method: 'POST',
            url: `/664${this.urlPosts}`,
            body: newPost,
            failOnStatusCode: false
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(401);
        });

    }

    createPostWithAuthTokenAndVerifyResponse(newPost) {
        return cy.request({
            method: 'POST',
            url: `${this.urlPosts}`,
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            body: newPost,
            failOnStatusCode: false
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(201);

            // Verify post is created
            expect(response.body).to.include(newPost);
        });

    }

    createPostWithAuthTokenAndVerifyEntityCreated(newPost) {
        return cy.request({
            method: 'POST',
            url: `${this.urlPosts}`,
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            body: newPost,
            failOnStatusCode: false
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

    }

    updateNonExistingPostWithAndVerifyResponse(postId, post) {
        return cy.request({
            method: 'PUT',
            url: `${this.urlPosts}/${postId}`,
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            body: post,
            failOnStatusCode: false // Do not fail the test on non-2xx status codes
        }).then((response) => {

            // Verify status code
            expect(response.status).to.eq(404);
        });

    }

    createPost(newPost) {
        return cy.request({
            method: 'POST',
            url: `${this.urlPosts}`,
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            body: newPost
        }).then((response) => {
            expect(response.status).to.eq(201);
            return response.body;
        });
    }

    updatePost(postId, updatedPost) {
        return cy.request({
            method: 'PUT',
            url: `${this.urlPosts}/${postId}`,
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            body: updatedPost
        }).then((response) => {
            expect(response.status).to.eq(200);
            return response.body;
        });
    }

    deleteNonExistingPostAndVerifyResponse(postId) {
        return cy.request({
            method: 'DELETE',
            url: `${this.urlPosts}/${postId}`,
            headers: {
                Authorization: `Bearer ${Cypress.env('accessToken')}`
            },
            failOnStatusCode: false // Do not fail the test on non-2xx status codes
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(404);
        });
    }
}

export default new Posts();