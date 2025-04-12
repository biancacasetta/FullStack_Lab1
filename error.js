function sendError(err, req, res, next) {
    const status = err.status || 500;
    res.status(status)
    .json({status: status, message: err.message});
}

export { sendError };