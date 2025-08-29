const getTestMessage= (req , res) => {
    res.status(200).json({
        messgae: 'API is running successfully!',
        status: 'success'
    });
};

export { getTestMessage };