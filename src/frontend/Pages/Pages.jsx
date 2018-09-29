import * as React from 'react';
import {withRouter} from 'react-router';
import {Guac} from 'guac-hoc/lib/Guac';
import {Route, Switch} from 'react-router-dom';

import {Login} from './Login';
import {Profile} from './Profile';
import {Marketplace} from "frontend/Pages/Marketplace";
import {Purchases} from "frontend/Pages/Purchases";

import {backend} from 'frontend/backendConnector/Backend';
import {globalState} from 'static/data/globalState';

class Pages extends React.Component {
  constructor() {
    super();
    this.bindAllMethods();
  }

  componentWillMount() {
    backend.on('/response/claims/getAll', this.populateClaims);
    backend.on('/response/purchases/getAll', this.populatePurchases);
    backend.on('/response/tokens/reward/get', this.populateRewardTokens);
    backend.on('/response/tokens/regular/get', this.populateRegularTokens);
  }

  componentWillUnmount() {
    backend.removeListener('/response/claims/getAll', this.populateClaims);
    backend.removeListener('/response/purchases/getAll', this.populatePurchases);
    backend.removeListener('/response/tokens/reward/get', this.populateRewardTokens);
    backend.removeListener('/response/tokens/regular/get', this.populateRegularTokens);
  }

  populateClaims(claims) { globalState.claims = claims; setTimeout(() => this.forceUpdate(), 500); }

  populatePurchases(purchases) { globalState.purchases = purchases; setTimeout(() => this.forceUpdate(), 500); console.log(purchases);}

  populateRewardTokens(numTokens) {
    if (globalState.me) {
      globalState.me.rewardTokens = numTokens;
    }
    setTimeout(() => this.forceUpdate(), 500);
  }

  populateRegularTokens(numTokens) {
    if (globalState.me) {
      globalState.me.tokens = numTokens;
    }
    setTimeout(() => this.forceUpdate(), 500);
  }

  render() {
    return (
      <div className={'page'}>
        <Route path='*' render={() => {window.scrollTo(0, 0); return null;}}/>
        <Switch>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/marketplace/purchases' component={Purchases}/>
          <Route exact path='/marketplace' component={Marketplace}/>
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
