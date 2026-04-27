const { createSubmission, getUserSubmissions, getLeaderboard } = require("../../../controllers/submissionController");

async function submissionRoutes(fastify, options) {
    fastify.post('/', createSubmission);
    fastify.get('/user/:userId', getUserSubmissions);
    fastify.get('/leaderboard', getLeaderboard);
}

module.exports = submissionRoutes;