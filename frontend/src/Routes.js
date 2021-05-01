import { CircularProgress } from '@material-ui/core'
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Auth = lazy(() => import("./view/auth"));
const Register = lazy(() => import("./view/register"));

const Routes = () => (
    <Router>
        <Suspense fallback={<div className="d-flex justify-content-center mt-5 pt-5"><CircularProgress /></div>}>
            <Switch>
                <Route exact path="/" component={Auth} />
                <Route path="/login" component={Auth} />
                <Route path="/register" component={Register} />
                <Route exact path="/vehicles" component={() => (<h1>Veiculos</h1>)} />
            </Switch>
        </Suspense>

    </Router>
)

export default Routes;
