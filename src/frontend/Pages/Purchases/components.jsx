import * as React from 'react';
import {Guac} from 'guac-hoc/lib/Guac';

import {Row, Col} from 'yui-md/lib';
import {Button} from 'yui-md/lib/Button';
import profileimg from "static/images/misc/profileimg.jpg";
import {Divider} from 'yui-md/lib/Divider';
import {Overlay} from 'yui-md/lib/Overlay';
import {Card, CardTextArea} from 'yui-md/lib/Card';
import QRCode from 'qrcode.react';

function makeProfileCard(name, status, numTokens, numRewardTokens) {
  return (
    <Row style={{minHeight: '30vh'}}>
      <Col xs={12} sm={4} md={2}>
        <img style={{maxWidth: '100%'}} src={profileimg}/>
      </Col>
      <Col style={{paddingLeft: '20px'}} xs={12} sm={7} md={6}>
        <h4>{name}</h4>
        <div className={'title'}>{status}</div>
        <div className={'subheader'}>Tokens: {numTokens}</div>
        <div className={'subheader'}>Reward Tokens: {numRewardTokens}</div>
      </Col>
      <Col xs={12} md={4}>
        <Button icon={'local_post_office'}/>
        <Button icon={'settings'}/>
      </Col>
    </Row>
  );
}

function makeRedemptionCard(flights, flightClaims, activateOverlay) {

}

/**
 * purchases: list<object>
 * activateOverlay: function(exp)
 * **/
function makePurchasesCard(purchases, activateOverlay) {
  let card = [<div className={'header'} id={-1}>Purchases</div>];
  function createOnClick(purchase) {
    return () => activateOverlay(purchase);
  }
  for (let i in purchases) {
    let purchase = purchases[i];
    let comps = [
      <Divider horizontal margin id={i * 5}/>,
      <div className={'title'} id={i * 5 + 1}>{purchase.name}</div>,
      <div className={'subheader'} id={i * 5 + 2}>
        {purchase.date}<br/>
        {purchase.quantity}&nbsp;Items<br/>
        {purchase.price}&nbsp;Tokens/Item
      </div>,
      <div id={i * 5 + 3}>
        Status: {purchase.tracking[purchase.tracking.length - 1].description}
      </div>,
      <Row id={i * 5 + 4} style={{display: 'flex'}}>
          <Col xs={0} sm={1} md={2} lg={3}/>
          <Col xs={12} sm={10} md={8} lg={6}>
              <Button style={{backgroundColor: '#fdf3d9'}}
                      onClick={createOnClick(purchase)}>View Purchase</Button>
          </Col>
          <Col xs={0} sm={1} md={2} lg={3}/>
      </Row>
    ];
    for (let comp of comps) {
      card.push(comp);
    }
  }
  return (
    <Card horizontal depth={1}>
      <CardTextArea style={{backgroundColor: 'white'}}>
        {card}
      </CardTextArea>
    </Card>
  );
}

/**
 * active: boolean
 * purchase: object (see SIA docs)
 * deactivate: function
 * confirm: function
 * **/
class PurchasesOverlay extends React.Component {
  constructor() {
    super();
    this.bindAllMethods();
  }

  createTrackingHistory(tracking) {
    let components = [];
    for (let i in tracking) {
      let trackingEvent = tracking[i];
      components.push(<div id={i}>
        {trackingEvent.date}&nbsp;&nbsp;&nbsp;&nbsp;{trackingEvent.description}
      </div>);
    }
    return components;
  }

  render() {
    let purchase = this.props.purchase;
    return (
      purchase.name ?
        <Overlay active={this.props.active}
                 fadeChildren
                 onClick={this.props.deactivate}
                 style={{position: 'fixed', paddingTop: '10vh'}}>
          <Row style={{width: '100%'}}>
            <Col xs={0} md={1} lg={2}/>
            <Col xs={12} md={10} lg={8}>
              <Card style={{backgroundColor: 'white', pointerEvents: this.props.active ? 'all':'none'}}>
                <CardTextArea>
                  <div className={'header'}>{purchase.name}</div>
                  <div className={'title'}>{purchase.date}</div>
                  <div className={'subheader'}>
                    Quantity:&nbsp;{purchase.quantity}<br/>
                    Price per Item:&nbsp;{purchase.price}&nbsp;Tokens
                  </div>
                  <div>Description:&nbsp;{purchase.description}</div>
                  <div>{this.createTrackingHistory(purchase.tracking)}</div>
                  <div onClick={() => this.props.confirm(purchase)}>
                    <QRCode value={JSON.stringify(purchase.tracking[purchase.tracking.length - 1])} renderAs={'svg'}/>
                  </div>
                </CardTextArea>
              </Card>
            </Col>
            <Col xs={0} md={1} lg={2}/>
          </Row>
        </Overlay> : null
    );
  }
}
PurchasesOverlay = Guac(PurchasesOverlay);

function makePurchasesOverlay(active, purchase, deactivate, confirm) {
  return <PurchasesOverlay active={active}
                          purchase={purchase}
                          deactivate={deactivate}
                          confirm={confirm}/>
}

export default makePurchasesCard;
export { makeProfileCard, makePurchasesCard, makePurchasesOverlay, PurchasesOverlay };