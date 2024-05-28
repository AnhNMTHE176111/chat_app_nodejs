const ResponseHelper = (req, res, next) => {
    res.sendSuccess = (data, message = "", code = 200) => {
        return res.status(code).json({
            data: data,
            success: true,
            message: message,
        });
    };

    res.sendError = (message = "", code = 400, data = null) => {
        return res.status(code).json({
            data: data,
            success: false,
            message: message,
        });
    };

    res.updateSuccess = (data, message = "Updated Successfully") => {
        return res.sendSuccess(data, message);
    };

    res.createSuccess = (data, message = "Created Successfully") => {
        return res.sendSuccess(data, message, 201);
    };

    res.deleteSuccess = (data, message = "Deleted Successfully") => {
        return res.sendSuccess(data, message);
    };

    next();
};

module.exports = { ResponseHelper };
