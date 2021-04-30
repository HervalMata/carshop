import { CircularProgress } from '@material-ui/core'
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from "./view/auth";

const Routes = () => (
    <Router>
        <Suspense fallback={<div className="d-flex justify-content-center mt-5 pt-5"><CircularProgress /></div>}>
            <Switch>
                <Route exact path="/" component={Auth} />
                <Route exact path="/login" component={Auth} />
                <Route exact path="/vehicles" component={() => (<h1>Veiculos</h1>)} />
            </Switch>
        </Suspense>

    </Router>
)

export default Routes;
