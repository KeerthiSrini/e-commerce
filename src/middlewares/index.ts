import cors from "./cors";
import UserAuthenticatorMiddleware from "./UserAuthenticator";
import AdminAuthenticatorMiddleware from "./AdminAuthenticator";

export const userAuthenticator = UserAuthenticatorMiddleware;
export const adminAuthenticator = AdminAuthenticatorMiddleware;

export default {
    cors,
};
