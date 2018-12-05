import * as React from 'react';
import {Guac} from 'guac-hoc/lib/Guac';

import {Row, Col} from 'yui-md/lib';
import {Button} from 'yui-md/lib/Button';
import profileimg from "static/images/misc/profileimg.jpg";
import {Divider} from 'yui-md/lib/Divider';
import {Overlay} from 'yui-md/lib/Overlay';
import {Card, CardTextArea} from 'yui-md/lib/Card';
import {Input} from 'yui-md/lib/Input';

function makeProfileCard(name, numTokens) {
  return (
    <Row style={{minHeight: '30vh'}}>
      <Col xs={12} sm={4} md={2}>
        <img style={{maxWidth: '100%'}} src={profileimg}/>
      </Col>
      <Col style={{paddingLeft: '20px'}} xs={12} sm={7} md={6}>
        <h4>User ID: {name}</h4>
        <div className={'subheader'}>Tokens: {numTokens}</div>
      </Col>
      <Col xs={12} md={4}>
        <Button icon={'local_post_office'}/>
        <Button icon={'settings'}/>
      </Col>
    </Row>
  );
}


export default makeProfileCard;
export { makeProfileCard };