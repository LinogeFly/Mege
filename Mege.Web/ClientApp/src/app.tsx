import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import styles from './app.module.css';
import MemeTemplate from './components/memeTemplate';
import NewMemeTemplate from './components/pages/newMemeTemplate';
import Navigation from './components/navigation';
import MemeTemplateList from "./components/pages/memeTemplateList";
import NotFound from './components/pages/notFound';
import Login from './components/pages/login';
import ProtectedRoute from './components/protectedRoute';
import Logout from './components/pages/logout';
import Alert from './components/alert';
import { alertService } from './services/alert';

function App() {
    const location = useLocation();

    useEffect(() => {
        alertService.clear();
    }, [location]);

    return (
        <div className="container text-center">
            <nav className="mb-4">
                <Navigation />
            </nav>
            <main className={styles.content}>
                <Alert />
                <Switch>
                    <Route exact path="/" component={MemeTemplateList} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/logout" component={Logout} />
                    <ProtectedRoute exact path="/new-template" component={NewMemeTemplate} />
                    <Route exact path="/meme/:id" component={MemeTemplate} />
                    <Route component={NotFound} />
                </Switch>
            </main>
        </div>
    );
}

export default App;
