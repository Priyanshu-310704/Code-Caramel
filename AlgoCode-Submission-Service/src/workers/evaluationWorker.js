const { Worker } = require('bullmq');
const redisConnection = require('../config/redisConfig');
const axios = require('axios');
const SubmissionRepository = require('../repositories/submissionRepository');

function evaluationWorker(queue) {
    new Worker('EvaluationQueue', async job => {
        if (job.name === 'EvaluationJob') {

            try {
                const response = await axios.post('http://localhost:3001/sendPayload', {
                    userId: job.data.userId,
                    payload: job.data
                })
                console.log(response);
              console.log(job.data);

              const submissionRepository = new SubmissionRepository();
              let status = job.data.response.status;
              
              if (status === "SUCCESS" || status === "COMPLETED") {
                  status = "Success";
              } else if (status === "ERROR") {
                  status = "RE"; // Runtime Error
              }
              // Anything else like "WA", "TLE", "MLE" maps directly since the enum is ["Pending", "Success", "RE", "TLE", "MLE", "WA"]
              
              const updatedSubmission = await submissionRepository.updateSubmissionStatus(job.data.submissionId, status);
              console.log('Submission DB status updated:', updatedSubmission?.status);

            } catch(error) {
                console.log(error)
            }
        }
    }, {
        connection: redisConnection
    });
}

module.exports = evaluationWorker;