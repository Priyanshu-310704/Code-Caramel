const fastify = require('fastify')({ logger: true }); // calling the fastify constructor
const app = require('./app');
const connectToDB = require('./config/dbConfig');
const serverConfig = require('./config/serverConfig');
const errorHandler = require('./utils/errorHandler');
const evaluationWorker = require('./workers/evaluationWorker');

fastify.register(app);
fastify.setErrorHandler(errorHandler);

if (process.env.RUN_WORKER_ONLY === 'true') {
    connectToDB().then(() => {
        evaluationWorker("EvaluationQueue");
        console.log("Worker started successfully");
    });
} else {
    fastify.listen({ port: serverConfig.PORT, host: '0.0.0.0' }, async (err) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1)
        }
        await connectToDB();
        console.log(`Server up at port ${serverConfig.PORT}`);
    });
}