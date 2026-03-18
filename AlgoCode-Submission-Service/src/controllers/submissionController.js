async function pingRequest(req, res) {

    console.log(this.testService);

    const response = await this.testService.pingCheck();
    return res.send({data: response});
}

// TODO: Add validastion layer
async function createSubmission(req, res) {
    console.log(req.body);
    const response = await this.submissionService.addSubmission(req.body);
    return res.status(201).send({
        error: {},
        data: response,
        success: true,
        message: 'Created submission successfully'
    })

}

async function getUserSubmissions(req, res) {
    try {
        const response = await this.submissionService.getUserSubmissions(req.params.userId);
        return res.status(200).send({
            error: {},
            data: response,
            success: true,
            message: 'Fetched user submissions successfully'
        });
    } catch(error) {
        return res.status(500).send({
            error: error.message,
            success: false,
            message: 'Failed to fetch user submissions'
        });
    }
}

module.exports =  {
    pingRequest,
    createSubmission,
    getUserSubmissions
};