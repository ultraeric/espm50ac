import * as React from 'react';
import {Guac} from 'guac-hoc/lib/Guac';
import {withRouter} from 'react-router';

import {_Backdrop} from '../_Backdrop';

import {backend} from 'frontend/backendConnector/Backend';
import {globalState} from 'static/data/globalState';
import {makeProfileCard} from './components';

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
    // backend.on('/response/claims/created', this.claimResponse);
  }

  componentWillUnmount() {
    // backend.removeListener('/response/claims/created', this.claimResponse);
  }

  activateOverlay(exp) { this.setState({popupActive: true, exp: exp}); }

  deactivateOverlay() { this.setState({popupActive: false}); }

  render() {
    if (!globalState.me) {
      this.props.history.push('/');
      return null;
    }
    let me = globalState.me;
    let name = me.userId;

    return (
      <div className={'profile-page info-page'}>
        <_Backdrop/>
        <div className={'title-area'}>
          {makeProfileCard(name, me.numTokens)}
        </div>
      </div>
    );
  }
}

Profile = withRouter(Guac(Profile));

export default Profile;
export {Profile};
