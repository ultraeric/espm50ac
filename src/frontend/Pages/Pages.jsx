import * as React from 'react';
import {withRouter} from 'react-router';
import {Guac} from 'guac-hoc/lib/Guac';
import {Route, Switch} from 'react-router-dom';

import {Login} from './Login';
import {Profile} from './Profile';
import {Registration} from "frontend/Pages/Registration";
import {Tracking} from "frontend/Pages/Tracking";

import {backend} from 'frontend/backendConnector/Backend';
import {globalState} from 'static/data/globalState';

class Pages extends React.Component {
  constructor() {
    super();
    this.bindAllMethods();
  }

  componentWillMount() {
    backend.on('/response/claims/getAll', this.populateClaims);
    backend.on('/response/tracking/getAll', this.populateTracking);
    backend.on('/response/tokens/get', this.populateRegularTokens);
  }

  componentWillUnmount() {
    backend.removeListener('/response/claims/getAll', this.populateClaims);
    backend.removeListener('/response/tracking/getAll', this.populateTracking);
    backend.removeListener('/response/tokens/get', this.populateRegularTokens);
  }

  populateClaims(claims) { globalState.claims = claims; setTimeout(() => this.forceUpdate(), 500); }

  populateTracking(tracking) { globalState.tracking = tracking; setTimeout(() => this.forceUpdate(), 500); console.log(tracking);}

  populateRewardTokens(numTokens) {
    if (globalState.me) {
      globalState.me.rewardTokens = numTokens;
    }
    setTimeout(() => this.forceUpdate(), 500);
  }

  populateRegularTokens(numTokens) {
    if (globalState.me) {
      globalState.me.numTokens = numTokens;
    }
    setTimeout(() => this.forceUpdate(), 500);
  }

  render() {
    return (
      <div className={'page'}>
        <Route path='*' render={() => {window.scrollTo(0, 0); return null;}}/>
        <Switch>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/registration/tracking' component={Tracking}/>
          <Route exact path='/registration' component={Registration}/>
          <Route path='/profile' component={Profile}/>
          <Route path='/' component={Login}/>
        </Switch>
      </div>
    );
  }
}

Pages = Guac(Pages);

export default Pages;
export {Pages};
