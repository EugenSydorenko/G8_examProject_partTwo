import {emailModificationByAddingDate} from "../support/helper";
import User from "../support/endpoints/User";
import Posts from "../support/endpoints/Posts";

describe('Api endpoints test suite', () => {
    const newUserEmail = emailModificationByAddingDate('autotest@email.reg');

    before(() => {
        User.signUpNewUser(newUserEmail);
    });

    it('1  Get all posts. Verify HTTP response status code and content type.', () => {
        Posts.getAllPostsAndVerifyResponse();
    })

    it('2 Get only first 10 posts. Verify HTTP response status code. Verify that only first posts are returned.', () => {
        Posts.getTenPostsAndVerifyResponse();
    });

    it('3 Get posts with id = 55 and id = 60. Verify HTTP response status code. Verify id values of returned records.', () => {
        Posts.getPostsByIdsAndVerifyResponse(55, 60);
    });

    it('4 Create a post. Verify HTTP response status code.', () => {
        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: Cypress.env('userId')
        };

        Posts.createPostAndVerifyResponse(newPost);

    });

    it('5 Create post with adding access token in header. Verify HTTP response status code. Verify post is created.', () => {

        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: Cypress.env('userId')
        };

        Posts.createPostWithAuthTokenAndVerifyResponse(newPost);

    });

    it('6 Create post entity and verify that the entity is created. Verify HTTP response status code. Use JSON in body.', () => {
        const newPost = {
            title: 'New Post Title',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            userId: Cypress.env('userId')
        };

        Posts.createPostWithAuthTokenAndVerifyEntityCreated(newPost);

    });

    it('7 Update non-existing entity. Verify HTTP response status code.', () => {
        const updatedPost = {
            title: 'Updated Post Title',
            body: 'Updated content for non-existing post.',
            userId: Cypress.env('userId')
        };

        // Using a non-existing post ID (e.g., 999999)
        const nonExistingPostId = 999999;

        Posts.updateNonExistingPostWithAndVerifyResponse(nonExistingPostId, updatedPost);

    });

    it('8 should create a post entity, update the created entity, and verify response', () => {

        const newPost = {
            title: 'Initial Post Title',
            body: 'Initial content for the new post.',
            userId: Cypress.env('userId')
        };

        Posts.createPost(newPost).then((createdPost) => {
            const createdPostId = createdPost.id;
            const updatedPost = {
                title: 'Updated Post Title',
                body: 'Updated content for the post.',
                userId: Cypress.env('userId')
            };

            Posts.updatePost(createdPostId, updatedPost).then((updatedResponse) => {
                expect(updatedResponse).to.include({
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

        Posts.deleteNonExistingPostAndVerifyResponse(nonExistingPostId);

    });

    it('10 should create a post entity, update the created entity, delete the entity, and verify it is deleted', () => {
        const newPost = {
            title: 'Initial Post Title',
            body: 'Initial content for the new post.',
            userId: Cypress.env('userId')
        };
        let createdPostId;
        Posts.createPost(newPost).then((createdPost) => {
            createdPostId = createdPost.id;
            const updatedPost = {
                title: 'Updated Post Title',
                body: 'Updated content for the post.',
                userId: Cypress.env('userId')
            };

            Posts.updatePost(createdPostId, updatedPost).then((updatedResponse) => {
                expect(updatedResponse).to.include({
                    title: updatedPost.title,
                    body: updatedPost.body,
                    userId: updatedPost.userId
                });
            });
        });

        Posts.deleteNonExistingPostAndVerifyResponse(createdPostId);

    });
})