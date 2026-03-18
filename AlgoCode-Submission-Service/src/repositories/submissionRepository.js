const { createSubmission } = require('../controllers/submissionController');
const Submission = require('../models/submissionModel');

class SubmissionRepository {
    constructor() {
        this.submissionModel = Submission;
    }

    async createSubmission(submission) {
        const response = await this.submissionModel.create(submission);
        return response;
    }
    
    async getUserSubmissions(userId) {
        const response = await this.submissionModel.find({ userId: userId });
        return response;
    }

    async updateSubmissionStatus(submissionId, status) {
        const response = await this.submissionModel.findByIdAndUpdate(submissionId, { status }, { new: true });
        return response;
    }
}

module.exports = SubmissionRepository;