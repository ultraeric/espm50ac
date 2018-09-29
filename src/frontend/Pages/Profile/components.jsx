import * as React from 'react';
import {Guac} from 'guac-hoc/lib/Guac';

import {Row, Col} from 'yui-md/lib';
import {Button} from 'yui-md/lib/Button';
import profileimg from "static/images/misc/profileimg.jpg";
import {Divider} from 'yui-md/lib/Divider';
import {Overlay} from 'yui-md/lib/Overlay';
import {Card, CardTextArea} from 'yui-md/lib/Card';
import {Input} from 'yui-md/lib/Input';

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
 * exps: list<object> (see SIA docs)
 * activateOverlay: function(exp)
 * **/
function makeExpsCard(exps, claims, activateOverlay) {
  let card = [<div className={'header'} id={-1}>Claims</div>];
  function createOnClick(exp) {
    return () => activateOverlay(exp);
  }
  for (let i in exps) {
    let exp = exps[i];
    let buttonActive = true;
    let currentClaim = {};
    for (let claim of claims) {
      if (exp.flightNumber === claim.flightNumber) {
        buttonActive = false;
        currentClaim = claim;
      }
    }
    let comps = [
      <Divider horizontal margin id={i * 5}/>,
      <div className={'title'} id={i * 5 + 1}>Flight Number:{' ' + exp.flightNumber}</div>,
      <div className={'subheader'} id={i * 5 + 2}>Flight Date:{' ' + exp.flightDate}</div>,
      <div id={i * 5 + 3}>
        <div>Details: {' ' + exp.incidentDetails}</div>
        {!buttonActive ? <div>Claim Description: {currentClaim.userFeedback}</div> : null}
        {!buttonActive ? <div>Credits Redeemed: {currentClaim.amount.toFixed(3)}</div> : null}
      </div>,
      <Row id={i * 5 + 4} style={{display: 'flex'}}>
          <Col xs={0} sm={1} md={2} lg={3}/>
          <Col xs={12} sm={10} md={8} lg={6}>
              <Button style={{backgroundColor: '#fdf3d9'}}
                      onClick={createOnClick(exp)}
                      disabled={!buttonActive}>
                {buttonActive ? 'Submit Claim' : 'Claim Submitted'}</Button>
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
 * buttonActive: boolean
 * exp: object (see SIA docs)
 * deactivate: function
 * submitClaim: function(exp)
 * **/
class ClaimOverlay extends React.Component {
  constructor() {
    super();
    this.state = {
      userFeedback: ''
    };
    this.bindAllMethods();
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      event.stopPropagation();
      this.props.submitClaim(this.props.exp, this.state.userFeedback);
    }
  }

  onButtonClick() {
    this.props.submitClaim(this.props.exp, this.state.userFeedback);
    this.setState({userFeedback: ''});
    this.props.deactivate();
  }

  onOverlayClick() {
    this.setState({userFeedback: ''});
    this.props.deactivate();
  }

  render() {
    return (
      this.props.exp.category ?
        <Overlay active={this.props.active}
                 fadeChildren
                 onClick={this.onOverlayClick}
                 style={{position: 'fixed', paddingTop: '10vh'}}>
          <Row style={{width: '100%'}}>
            <Col xs={0} md={1} lg={2}/>
            <Col xs={12} md={10} lg={8}>
              <Card style={{backgroundColor: 'white', pointerEvents: this.props.active ? 'all':'none'}}>
                <CardTextArea>
                  <div className={'header'}>Claim Resolution</div>
                  <div className={'subheader'}>Flight Number:{' ' + this.props.exp.flightNumber}</div>
                  <div>Details: {' ' + this.props.exp.incidentDetails} </div>
                  <div>Estimated Claim Amount: {' ' + this.props.exp.category.length} </div>
                  <Input label={'Claim Description'}
                         value={this.state.userFeedback}
                         changeValue={(val) => this.setState({userFeedback: val})}/>
                  <Row style={{display: 'flex'}}>
                    <Col xs={0} sm={1} md={2} lg={3}/>
                    <Col xs={12} sm={10} md={8} lg={6}>
                      <Button style={{backgroundColor: '#fdf3d9'}}
                              disabled={!this.props.buttonActive}
                              onClick={this.onButtonClick}>
                        {this.props.buttonActive ? 'Submit Claim' : 'Claim Submitted'}</Button>
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
ClaimOverlay = Guac(ClaimOverlay);

function makeClaimOverlay(active, buttonActive, exp, deactivate, submitClaim) {
  return <ClaimOverlay active={active}
            buttonActive={buttonActive}
            exp={exp}
            deactivate={deactivate}
            submitClaim={submitClaim}/>
}

export default makeProfileCard;
export { makeProfileCard, makeExpsCard, makeClaimOverlay, ClaimOverlay };