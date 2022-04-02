const clientKey = "x-client-key";
const adminKey = "x-admin-key";
const accessDeniedMessage = "Access Denied - Unauthorized user";

/**
 * Middleware - exam if the user has client access privilege
**/
export function isClientMiddleware(req, res, next) {
    if (req.headers.authorization != clientKey && req.headers.authorization != adminKey) {    
        res.status(400).json({ message: accessDeniedMessage });
        return; 
    }

    next();
}

/**
 * Middleware - exam if the user has admin access privilege
**/
export function isAdminMiddleware(req, res, next) {
    if (req.headers.authorization != adminKey) {
        res.status(400).json({ message: accessDeniedMessage });
        return;
    }

    next();
}