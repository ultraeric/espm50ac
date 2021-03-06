import * as React from 'react';
import {Guac} from 'guac-hoc/lib/Guac';
import {withRouter} from 'react-router';
import {Input} from 'yui-md/lib/Input';

import {_Backdrop} from '../_Backdrop';
import makeProductCards, {makePurchaseOverlay} from './components';
import {globalState} from 'static/data/globalState';
import {Row, Col} from 'yui-md/lib';
import {backend} from 'frontend/backendConnector/Backend';
import {makePurchase} from "shared/objects";
import {getDate} from "utils/timingUtils";

class Registration extends React.Component {
  constructor() {
    super();
    this.bindAllMethods();
    this.state = {
      searchTerm: '',
      popupActive: false,
      product: {}
    }
  }

  activateOverlay(product) { this.setState({popupActive: true, product: product}); }

  deactivateOverlay() { this.setState({popupActive: false}); }

  purchaseProduct(product, comment) {
    let purchase = makePurchase(product.name, product.price, product.description, product.image, comment, getDate(), []);
    let auth = {userId: globalState.me.userId, password: globalState.me.userId};
    backend.tracking.registerItem(auth, purchase);
  }

  productUpdate(data) {
    globalState.products = data;
    this.forceUpdate();
  }

  componentWillMount() {
    backend.on('/response/tracking/getProducts', this.productUpdate);
  }

  componentWillUnmount() {
    backend.removeListener('/response/tracking/getProducts', this.productUpdate);
  }

  render() {
    if (!globalState.me) {
      this.props.history.push('/');
      return null;
    }
    let products = globalState.products.filter(
      (product) => product.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())
    );
    return (
      <div className={'registration-page info-page'}>
        <_Backdrop/>
        <div className={'title-area'}>
          <Row>
            <Col xs={0} md={1} lg={2}/>
            <Col xs={12} md={10} lg={8}>
              <h4 className={'centered'}>Reusable Product Registration</h4>
              <Input label={'Search'}
                     value={this.state.searchTerm}
                     changeValue={(val) => this.setState({searchTerm: val})}></Input>
            </Col>
            <Col xs={0} md={1} lg={2}/>
          </Row>
          <br/>
        </div>
        <div className={'info-area'}>
          {makeProductCards(products, this.activateOverlay)}
          {makePurchaseOverlay(this.state.popupActive, this.state.product, this.deactivateOverlay, this.purchaseProduct)}
        </div>
      </div>
    );
  }
}

Registration = withRouter(Guac(Registration));

export default Registration;
export {Registration};
