import * as React from 'react';
import {Guac} from 'guac-hoc/lib/Guac';

import logo from 'static/images/logos/sia.svg';

class _Backdrop extends React.Component {
  constructor() {
    super();
    this.bindAllMethods();
    this.state = {
      yPos: 0
    };
    this.scrollListener = () => {this.setState({yPos: window.scrollY})};
    window.addEventListener('scroll', this.scrollListener);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  render() {
    return (
      <div className={'backdrop-container'}>
        <img className={'centered'}
          style={{transform: 'translate3d(0px, ' + ((window.scrollY + 600 || 600) / 3) + 'px, 0px)'}}
          src={logo}/>
      </div>
    );
  }
}

_Backdrop = Guac(_Backdrop);

export default _Backdrop;
export {_Backdrop};
