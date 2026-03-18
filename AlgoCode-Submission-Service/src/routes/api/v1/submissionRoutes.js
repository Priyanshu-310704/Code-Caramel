const { createSubmission, getUserSubmissions } = require("../../../controllers/submissionController");

async function submissionRoutes(fastify, options) {
    fastify.post('/', createSubmission);
    fastify.get('/user/:userId', getUserSubmissions);
}

module.exports = submissionRoutes;