import * as React from 'react';
import {Guac} from 'guac-hoc/lib/Guac';
import {withRouter} from 'react-router';

import {_Backdrop} from '../_Backdrop';

import {backend} from 'frontend/backendConnector/Backend';
import {globalState} from 'static/data/globalState';
import {makeProfileCard, makeExpsCard, makeClaimOverlay} from './components';
import {makeClaim} from "shared/objects";

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      popupActive: false,
      exp: {}
    };
    this.bindAllMethods();
  }

  componentWillMount() {
    backend.on('/response/claims/created', this.claimResponse);
  }

  componentWillUnmount() {
    backend.removeListener('/response/claims/created', this.claimResponse);
  }

  claimResponse(data) {
    window.triggerSnackbar(
      data.success
        ?
      'Successfully submitted claim. Your balance will be updated.'
        :
      'Failed to submit claim');
  }

  activateOverlay(exp) { this.setState({popupActive: true, exp: exp}); }

  deactivateOverlay() { this.setState({popupActive: false}); }

  submitClaim(exp, userFeedback) {
    let claim = makeClaim(globalState.me.flyerNumber, exp.flightNumber, exp.category.length, userFeedback);
    let creds = {flyerNumber: globalState.me.flyerNumber, password: globalState.me.contact.phoneNumber};
    backend.claims.makeClaim(claim, creds);
  }

  render() {
    if (!globalState.me) {
      this.props.history.push('/');
      return null;
    }
    let me = globalState.me;
    let name = me.firstName + ' ' + me.lastName;

    let buttonActive = true;
    if (this.state.exp.flightNumber) {
      for (let claim of globalState.claims) {
        if (this.state.exp.flightNumber === claim.flightNumber) {
          buttonActive = false;
        }
      }
    }

    return (
      <div className={'profile-page info-page'}>
        <_Backdrop/>
        <div className={'title-area'}>
          {makeProfileCard(name, me.loyaltyTierName, me.tokens, me.rewardTokens)}
          {makeExpsCard(me.passengerExperienceHistory, globalState.claims, this.activateOverlay)}
        </div>
        <div className={'info-area'}>
          {makeClaimOverlay(
            this.state.popupActive,
            buttonActive,
            this.state.exp,
            this.deactivateOverlay,
            this.submitClaim)}
        </div>
      </div>
    );
  }
}

Profile = withRouter(Guac(Profile));

export default Profile;
export {Profile};
