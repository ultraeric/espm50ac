import * as React from 'react';
import {withRouter} from 'react-router';
import {Guac} from 'guac-hoc/lib/Guac';

import animateScrollTo from 'animated-scroll-to';
import {Button} from 'yui-md/lib/Button';
import {Input} from 'yui-md/lib/Input';

import paths from 'static/structure/paths';
import LoginSlideshow from './LoginSlideshow';
import {globalState} from 'static/data/globalState';
import {backend} from 'frontend/backendConnector/Backend';

class Login extends React.Component {
  constructor() {
    super();
    this.render = this.render.bind(this);
    this.state = {flyerNumber: '',
                  password: '',
                  loginFailed: false};
    this.bindAllMethods();
  }

  componentWillMount() {
    backend.on('/response/login', this.loginResponse);
  }

  componentWillUnmount() {
    backend.removeListener('/response/login', this.loginResponse);
  }

  loginResponse(data) {
    window.triggerSnackbar(data.message);
    this.setState({loginFailed: !data.success});
    if (data.success) {
      globalState.me = data.user;
      this.props.history.push(paths.profile);
    }
  }

  tryLogin() {
    backend.user.login(this.state.flyerNumber, this.state.password);
  }

  editField(fieldName, val) {
    if (fieldName === 'password' || fieldName === 'flyerNumber') {
      this.setState({loginFailed: false});
    }
    let newState = {};
    newState[fieldName] = val;
    this.setState(newState);
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      event.stopPropagation();
      this.tryLogin();
    }
  }

  render() {
    return (
      <div className={'login-page'}>
        <LoginSlideshow/>
        <div className={'title-area'}>
          <h2 className={'centered'}>Singapore Airlines</h2>
          <h4 className={'centered'}>Tokenized Platform</h4>
          <div className={'centered subtitle'}>
              <Button large
                onClick={() => animateScrollTo(window.innerHeight-50)}
                light={true}
                artificialDelay={100}>Login</Button>
          </div>
        </div>
        <div className={'info-area'} onKeyPress={this.onKeyPress}>
          <h4 className={'centered title'}>Login</h4>
          <Input label={'Flyer Number'}
            value={this.state.flyerNumber}
            changeValue={(val) => this.editField('flyerNumber', val)}/>
          <Input
            className={'password'}
            label={'Password'}
            value={this.state.password}
            changeValue={(val) => this.editField('password', val)}/>
          {this.state.loginFailed ? <div className={'centered'}>Login Failed</div> : null}
          <div className={'centered'}>
            <Button large
              onClick={this.tryLogin}>Login</Button>
          </div>
        </div>
      </div>
    );
  }
}

Login = withRouter(Guac(Login));

export default Login;
export {Login};
