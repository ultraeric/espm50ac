import * as React from 'react';
import {Guac} from 'guac-hoc/lib/Guac';
import {withRouter} from 'react-router';

import {_Backdrop} from '../_Backdrop';

import {backend} from 'frontend/backendConnector/Backend';
import {globalState} from 'static/data/globalState';
import {makeProfileCard, makeTrackingCard, makeTrackingOverlay} from './components';

class Tracking extends React.Component {
  constructor() {
    super();
    this.state = {
      popupActive: false,
      purchase: {}
    };
    this.bindAllMethods();
  }

  componentWillMount() {
    backend.on('/response/tracking/getAll', this.trackingResponse);
  }

  componentWillUnmount() {
    backend.removeListener('/response/tracking/getAll', this.trackingResponse);
  }

  trackingResponse(tracking) {
    globalState.tracking = tracking;
    this.forceUpdate();
  }

  update(purchase, comment) {
    let creds = {userId: globalState.me.userId, password: globalState.me.userId};
    backend.tracking.edit(creds, purchase, comment);
  }

  activateOverlay(purchase) { this.setState({popupActive: true, purchase: purchase}); }

  deactivateOverlay() { this.setState({popupActive: false}); }

  confirmPurchase(purchase) {
    let creds = {userId: globalState.me.userId, password: globalState.me.userId};
    backend.tracking.commit(creds, purchase);
  }

  render() {
    if (!globalState.me) {
      this.props.history.push('/');
      return null;
    }
    let me = globalState.me;
    let name = me.userId;
    return (
      <div className={'tracking-page info-page'}>
        <_Backdrop/>
        <div className={'title-area'}>
          {makeProfileCard(name, me.numTokens)}
        </div>
        <div className={'info-area'}>
          {makeTrackingCard(globalState.tracking, this.activateOverlay)}
          {makeTrackingOverlay(
            this.state.popupActive,
            this.state.purchase,
            this.deactivateOverlay,
            this.confirmPurchase,
            this.update)}
        </div>
      </div>
    );
  }
}

Tracking = withRouter(Guac(Tracking));

export default Tracking;
export {Tracking};
