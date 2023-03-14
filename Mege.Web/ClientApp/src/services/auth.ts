import axios, { AxiosRequestConfig } from 'axios';

export class AuthService {
    authenticatedTask: Promise<boolean> | null;

    constructor() {
        // Default "null" value is to indicate that authenticated status hasn't been checked yet.
        // An instance of this class is a singleton. We check if user is authenticated or not by
        // calling the back-end API only once when isAuthenticated function is called for the first time.
        // After that we cache the value as "true" or "false" and don't call the back-end again.
        this.authenticatedTask = null;
    }

    isAuthenticated(requestConfig?: AxiosRequestConfig) {
        if (this.authenticatedTask === null)
            this.authenticatedTask = (async () => {
                try {
                    await axios.get('api/user', requestConfig);

                    // No errors means that the user is authenticated
                    return true;
                } catch (error) {
                    // "Unauthorized" error means that the user is not authenticated
                    if (axios.isAxiosError(error) && error.response?.status === 401) {
                        return false;
                    } else {
                        // All other errors should not resolve isAuthenticated value,
                        // as something went wrong, for example the request got cancelled.
                        // So we don't know if the user is in fact authenticated or not.
                        // We also must not cache the response for such cases;

                        this.authenticatedTask = null;

                        throw error;
                    }
                }
            })();

        return this.authenticatedTask;
    }

    async login(email: string, password: string, requestConfig?: AxiosRequestConfig) {
        await axios.post('/api/login', {
            email,
            password
        }, requestConfig);

        this.authenticatedTask = Promise.resolve(true);
    }

    async logout(requestConfig?: AxiosRequestConfig) {
        await axios.post('/api/logout', {}, requestConfig);

        this.authenticatedTask = Promise.resolve(false);
    }
}

export default new AuthService();