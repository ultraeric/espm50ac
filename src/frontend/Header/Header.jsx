import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router';
import {Guac} from 'guac-hoc/lib/Guac';

import {AppBar} from 'yui-md/lib/AppBar';
import {Tab} from 'yui-md/lib/Tab';
import {TabList} from 'yui-md/lib/TabList';
import {Menu} from 'yui-md/lib/Menu';
import {MenuItem} from 'yui-md/lib/MenuItem';
import {_NavCreator} from './_NavCreator';
import logo from 'static/images/logos/sia.svg';


class Header extends React.Component {
  constructor() {
    super();
    this.bindAllMethods();
    this.state = {
      isActive: {
        aboutMenu: false,
        eventsMenu: false
      }
    };
  }

  setMenuActive(menuName, active) {
    let currentlyActive = typeof(active) === 'undefined' ? !this.state.isActive[menuName] : active;
    this.state.isActive[menuName] = currentlyActive;
    this.setState({isActive: this.state.isActive});
  }

  render() {
    return (
      <AppBar height={68}
        style={{paddingTop: '0px', boxSizing: 'border-box', paddingBottom: '12px'}}
        className={'z-depth-1'}
        backgroundColor={'white'}>
        <a href={'/'}>
          <img style={{display: 'inline-block',
                        height: '40px',
                        paddingTop: '10px',
                        marginBottom: '-12px'}}
               src={logo}/>
        </a>
        <h4 id={'sia-logo-text'}
          onClick={() => window.location.href = '/'}></h4>
        <_NavCreator/>
      </AppBar>
    );
  }
}

Header = Guac(Header);

export default Header;
export {Header};
