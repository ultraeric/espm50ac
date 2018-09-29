import * as React from 'react';
import {Guac} from 'guac-hoc/lib/Guac';
import {withRouter} from 'react-router';

import {_Backdrop} from '../_Backdrop';

import {backend} from 'frontend/backendConnector/Backend';
import {globalState} from 'static/data/globalState';
import {makeProfileCard, makePurchasesCard, makePurchasesOverlay} from './components';

class Purchases extends React.Component {
  constructor() {
    super();
    this.state = {
      popupActive: false,
      purchase: {}
    };
    this.bindAllMethods();
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  activateOverlay(purchase) { this.setState({popupActive: true, purchase: purchase}); }

  deactivateOverlay() { this.setState({popupActive: false}); }

  confirmPurchase(purchase) {
    let creds = {flyerNumber: globalState.me.flyerNumber, password: globalState.me.contact.phoneNumber};
    backend.purchases.confirmPurchase(purchase, creds);
  }

  render() {
    if (!globalState.me) {
      this.props.history.push('/');
      return null;
    }
    let me = globalState.me;
    let name = me.firstName + ' ' + me.lastName;
    return (
      <div className={'purchases-page info-page'}>
        <_Backdrop/>
        <div className={'title-area'}>
          {makeProfileCard(name, me.loyaltyTierName, me.tokens, me.rewardTokens)}
        </div>
        <div className={'info-area'}>
          {makePurchasesCard(globalState.purchases, this.activateOverlay)}
          {makePurchasesOverlay(
            this.state.popupActive,
            this.state.purchase,
            this.deactivateOverlay,
            this.confirmPurchase)}
        </div>
      </div>
    );
  }
}

Purchases = withRouter(Guac(Purchases));

export default Purchases;
export {Purchases};
