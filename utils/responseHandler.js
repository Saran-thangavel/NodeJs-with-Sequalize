const successResponse = (res, status, data) => {
    res.status(status).json(data);
};

const errorResponse = (res, status, error) => {
    console.error(error);
    res.status(status).json({ message: error });
};

module.exports = {
    successResponse,
    errorResponse,
};
