import React from "react";
import { Route, Redirect } from "react-router-dom";
import authService from "../services/auth";

interface ProtectedRouteProps {
    component: any
}

interface ProtectedRouteState {
    loading: boolean,
    authenticated: boolean
}

class ProtectedRoute extends React.Component<any, ProtectedRouteState> {
    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            authenticated: false
        };
    }

    componentDidMount() {
        this.populateAuthenticationState();
    }

    async populateAuthenticationState() {
        const authenticated = await authService.isAuthenticated();
        this.setState({ loading: false, authenticated });
    }

    render() {
        const { loading, authenticated } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        } else {
            const { component: Component, ...rest } = this.props;
            return <Route {...rest}
                render={(props) => {
                    if (authenticated) {
                        return <Component {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }} />
        }
    }
}

export default ProtectedRoute;
