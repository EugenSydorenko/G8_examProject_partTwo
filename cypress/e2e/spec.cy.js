describe('template spec', () => {
    it('1 retrieve all posts', () => {
        cy.request('GET', 'http://localhost:3000/posts')
            .then((response) => {
                // Verify status code
                expect(response.status).to.eq(200);

                // Verify content type
                expect(response.headers['content-type']).to.include('application/json');
            })
    })

    it('2 should retrieve first 10 posts and verify response', () => {
        cy.request('GET', 'http://localhost:3000/posts?_limit=10')
            .then((response) => {
                // Verify status code
                expect(response.status).to.eq(200);

                // Verify that exactly 10 posts are returned
                expect(response.body).to.have.lengthOf(10);

                // Optionally, check more details about the posts if needed
                // For example, to check the first post's title:
                // expect(response.body[0].title).to.exist;
            });
    });

    it('3 should retrieve posts with id=55 and id=60 and verify response', () => {
        cy.request('GET', 'http://localhost:3000/posts?id=55&id=60')
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

    it('4 should create a post and verify response', () => {
        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: 664 // Replace with the appropriate user ID or identifier
        };

        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/664/posts',
            body: newPost,
            failOnStatusCode: false // Allows us to check the response status code
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(401);
        });
    });

    it('5 should create a post and verify response', () => {
        // Replace 'your-access-token' with the actual access token
        const accessToken = 'your-access-token';

        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: 664 // Replace with the appropriate user ID or identifier
        };

        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/664/posts',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: newPost
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(201);

            // Verify post is created
            expect(response.body).to.include(newPost);
        });
    });

    it('6 should create a post entity and verify response', () => {
        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: 1 // Replace with the appropriate user ID or identifier
        };

        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/posts',
            body: newPost,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(201);

            // Verify post is created correctly
            expect(response.body).to.deep.equal({
                ...newPost,
                id: response.body.id // Ensure the response includes an ID
            });
        });
    });

    it('7 should create a post entity and verify response', () => {
        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: 1 // Replace with the appropriate user ID or identifier
        };

        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/posts',
            body: newPost,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(201);

            // Verify post is created correctly
            expect(response.body).to.deep.equal({
                ...newPost,
                id: response.body.id // Ensure the response includes an ID
            });
        });
    });



    it('8 should create a post entity and then update it', () => {
        let createdPostId;

        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: 1 // Replace with the appropriate user ID or identifier
        };

        const updatedPost = {
            title: 'Updated Post Title',
            body: 'Updated content for the post.',
            userId: 1 // Replace with the appropriate user ID or identifier
        };

        // Create a new post
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/posts',
            body: newPost,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            // Verify creation status code
            expect(response.status).to.eq(201);

            // Store the ID of the created post
            createdPostId = response.body.id;

            // Verify post is created correctly
            expect(response.body).to.deep.include(newPost);

            // Update the created post
            return cy.request({
                method: 'PUT', // or 'PATCH' depending on your API endpoint
                url: `http://localhost:3000/posts/${createdPostId}`,
                body: updatedPost,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }).then((response) => {
            // Verify update status code
            expect(response.status).to.eq(200);

            // Verify post is updated correctly
            expect(response.body).to.deep.include(updatedPost);
        });
    });

    it('9 should attempt to delete a non-existing post entity and verify response', () => {
        const postId = 9999; // Assuming postId 9999 does not exist

        cy.request({
            method: 'DELETE',
            url: `http://localhost:3000/posts/${postId}`,
            failOnStatusCode: false // Allows us to check the response status code
        }).then((response) => {
            // Verify status code
            expect(response.status).to.eq(404);
        });
    });


    it('10 should create a post entity, update it, and delete it', () => {
        let createdPostId;
        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: 1 // Replace with the appropriate user ID or identifier
        };

        const updatedPost = {
            title: 'Updated Post Title',
            body: 'Updated content for the post.',
            userId: 1 // Replace with the appropriate user ID or identifier
        };

        // Create a new post
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/posts',
            body: newPost,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            // Verify creation status code
            expect(response.status).to.eq(201);

            // Store the ID of the created post
            createdPostId = response.body.id;

            // Verify post is created correctly
            expect(response.body).to.deep.include(newPost);

            // Update the created post
            return cy.request({
                method: 'PUT', // or 'PATCH' depending on your API endpoint
                url: `http://localhost:3000/posts/${createdPostId}`,
                body: updatedPost,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }).then((response) => {
            // Verify update status code
            expect(response.status).to.eq(200);

            // Verify post is updated correctly
            expect(response.body).to.deep.include(updatedPost);

            // Delete the created post
            return cy.request({
                method: 'DELETE',
                url: `http://localhost:3000/posts/${createdPostId}`
            });
        }).then((response) => {
            // Verify delete status code
            expect(response.status).to.eq(200);
        });

        // Attempt to fetch the deleted post (optional verification)
        cy.request({
            method: 'GET',
            url: `http://localhost:3000/posts/${createdPostId}`,
            failOnStatusCode: false // Expecting 404 Not Found
        }).then((response) => {
            // Verify that the post is deleted
            expect(response.status).to.eq(404);
        });
    });
})