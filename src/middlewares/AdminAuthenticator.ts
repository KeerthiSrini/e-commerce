import { verifyAsync } from "../services/common";

/**
 * Decode the access token and add the user to the request
 */
export default () => async (req:any, res:any, next:any) => {
    try {
        const accessToken = req.headers.authorization;
        if (accessToken) {
            try {
                const decoded:any = await verifyAsync(accessToken);
                if (decoded.type === "access-token") { req.user = decoded; }
            } catch (err) {
                throw new Error("Invalid Token");
            }
        }
        next();
    } catch (error) {
        console.log(`Unable to authorize token`, error);
        next(error);
    }
};
