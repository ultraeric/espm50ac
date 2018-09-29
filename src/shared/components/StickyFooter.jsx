import * as React from 'react';
import Guac from 'guac-hoc/lib/Guac';

/*
  Note: place this inside your Content div.
  Props:
  - raised <boolean>: raised or not
  - backgroundColor <string>: background color
*/
class StickyFooter extends React.Component {
  constructor() {
    super();
    this.bindAllMethods();
  }

  className() {
    let className = 'sticky-footer';
    className += this.props.raised ? ' z-depth-2' : '';
    return className;
  }

  style() {
    let style = {};
    if (this.props.backgroundColor) {
      style.backgroundColor = this.props.backgroundColor;
    }
    return style;
  }

  render() {
    let passedProps = this.deleteUsedProps(['raised']);
    passedProps = Object.assign({}, passedProps, { className: this.className(), style: this.style() });
    return (
      <div {...passedProps}>
        {this.props.children}
      </div>
    );
  }
}

StickyFooter = Guac(StickyFooter);

export default StickyFooter;
export {StickyFooter};