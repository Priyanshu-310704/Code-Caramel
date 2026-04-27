const { fetchProblemDetails } = require('../apis/problemAdminApi');
const SubmissionCreationError = require('../errors/submissionCreationError');
const SubmissionProducer = require('../producers/submissionQueueProducer');
class SubmissionService {
    constructor(submissionRepository) {
        // inject here
        this.submissionRepository = submissionRepository;
    }

    async pingCheck() {
        return 'pong'
    }

    async addSubmission(submissionPayload) {
        // Hit the problem admin service and fetch the problem details
        const problemId = submissionPayload.problemId;
        const userId = submissionPayload.userId;

        const problemAdminApiResponse = await fetchProblemDetails(problemId);

        if(!problemAdminApiResponse) {
            throw new SubmissionCreationError('Failed to create a submission in the repository');
        }

        const languageCodeStub = problemAdminApiResponse.data.codeStubs.find(codeStub => codeStub.language.toLowerCase() === submissionPayload.language.toLowerCase());

        console.log("Language Code Stub Found:", languageCodeStub ? "Yes" : "No"); 

        if (languageCodeStub) {
            submissionPayload.code = languageCodeStub.startSnippet + "\n\n" + submissionPayload.code + "\n\n" + languageCodeStub.endSnippet;
        }

        const submission = await this.submissionRepository.createSubmission(submissionPayload);
        if(!submission) {
            // TODO: Add error handling here
            throw new SubmissionCreationError('Failed to create a submission in the repository');
        }
        console.log(submission);
        const inputCase = problemAdminApiResponse.data.testCases?.length > 0 ? problemAdminApiResponse.data.testCases[0].input : "";
        const outputCase = problemAdminApiResponse.data.testCases?.length > 0 ? problemAdminApiResponse.data.testCases[0].output : "";

        const response = await SubmissionProducer({
            [submission._id]: {
                code: submission.code,
                language: submission.language,
                inputCase: inputCase,
                outputCase: outputCase,
                userId,
                submissionId: submission._id
            }
        });

        // TODO: Add handling of all testcases here .
        return {queueResponse: response, submission};
    }

    async getUserSubmissions(userId) {
        const submissions = await this.submissionRepository.getUserSubmissions(userId);
        return submissions;
    }

    async getLeaderboard() {
        const leaderboard = await this.submissionRepository.getLeaderboard();
        return leaderboard;
    }
}

module.exports = SubmissionService