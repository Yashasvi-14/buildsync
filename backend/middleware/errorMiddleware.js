//not found handler
export const notFound = (req,res,next) => {
    res.status(404);
    res.json({success: false, message: `Not Found - ${req.originalUrl}`});
};

//error handler
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err);
    const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(status).json({
        success: false,
        message: err.message || "Server Error",
    });
};