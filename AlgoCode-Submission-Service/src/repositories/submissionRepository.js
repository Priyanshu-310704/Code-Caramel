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

    async getLeaderboard() {
        const response = await this.submissionModel.aggregate([
            { $match: { status: 'Success' } },
            { $group: { _id: "$userId", problemsSolved: { $addToSet: "$problemId" } } },
            { $project: { userId: "$_id", _id: 0, score: { $size: "$problemsSolved" } } },
            { $sort: { score: -1 } },
            { $limit: 100 }
        ]);
        return response;
    }

    async updateSubmissionStatus(submissionId, status) {
        const response = await this.submissionModel.findByIdAndUpdate(submissionId, { status }, { new: true });
        return response;
    }
}

module.exports = SubmissionRepository;