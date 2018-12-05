import * as React from 'react';
import {Guac} from 'guac-hoc/lib/Guac';
import {withRouter} from 'react-router';

import {Card, CardImageArea, CardTextArea} from 'yui-md/lib/Card';
import {Overlay} from "yui-md/lib/Overlay";
import {Col, Row} from "yui-md/lib";
import {Input} from "yui-md/lib/Input";
import {Button} from "yui-md/lib/Button";

/**
 * products: global
 * activateOverlay: function(product)
 * **/
function makeProductCards(products, activateOverlay) {
  var components = [];
  for (let i in products) {
    let product = products[i];
    function createOnClick(product) {
      return () => activateOverlay(product);
    }
    components.push(
      <Card horizontal depth={1} sm={12} key={i}>
        <CardImageArea md={4}><img src={product.image}/></CardImageArea>
        <CardTextArea md={8} style={{backgroundColor: 'white'}}>
          <a className={'title'} href={'#'} onClick={createOnClick(product)}>{product.name}</a>
          <div className={'subheader'}>Price:&nbsp;
            {product.price}
          </div>
          <div>{product.description}</div>
        </CardTextArea>
      </Card>
    );
  }
  return <div>{components}</div>;
}

/**
 * active: boolean
 * product: object
 * deactivate: function
 * purchaseProduct: function(product, quantity)
 * **/
class PurchaseOverlay extends React.Component {
  constructor() {
    super();
    this.state = {
      comment: ''
    };
    this.bindAllMethods();
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      event.stopPropagation();
      this.props.purchaseProduct(this.props.product, this.state.comment);
    }
  }

  onButtonClick() {
    this.props.purchaseProduct(this.props.product, this.state.comment);
    this.setState({comment: ''});
    this.props.deactivate();
  }

  onOverlayClick() {
    this.setState({comment: ''});
    this.props.deactivate();
  }

  onCommentChange(val) {
    this.setState({comment: val});
  }

  render() {
    return (
      (this.props.product.name) ?
        <Overlay active={this.props.active}
                 fadeChildren
                 onClick={this.onOverlayClick}
                 style={{position: 'fixed', paddingTop: '10vh'}}>
          <Row style={{width: '100%'}}>
            <Col xs={0} md={1} lg={2}/>
            <Col xs={12} md={10} lg={8}>
              <Card style={{backgroundColor: 'white', pointerEvents: this.props.active ? 'all':'none'}}>
                <CardTextArea>
                  <div className={'header'}>Register Product</div>
                  <div className={'subheader'}>Name:{' ' + this.props.product.name}</div>
                  <div classname={'subheader'}>Price:{' ' + this.props.product.price}</div>
                  <div>{' ' + this.props.product.description} </div>
                  <Input label={'Comment'}
                         value={this.state.comment}
                         changeValue={this.onCommentChange}/>
                  <Row style={{display: 'flex'}}>
                    <Col xs={0} sm={1} md={2} lg={3}/>
                    <Col xs={12} sm={10} md={8} lg={6}>
                      <Button style={{backgroundColor: '#fdf3d9'}}
                              disabled={!this.state.comment}
                              onClick={this.onButtonClick}>
                              {'Register Item'}</Button>
                    </Col>
                    <Col xs={0} sm={1} md={2} lg={3}/>
                  </Row>
                </CardTextArea>
              </Card>
            </Col>
            <Col xs={0} md={1} lg={2}/>
          </Row>
        </Overlay> : null
    );
  }
}
PurchaseOverlay = Guac(PurchaseOverlay);

function makePurchaseOverlay(active, product, deactivate, purchaseProduct) {
  return <PurchaseOverlay active={active}
        product={product}
        deactivate={deactivate}
        purchaseProduct={purchaseProduct}/>
}

export default makeProductCards;
export {makeProductCards, makePurchaseOverlay};
