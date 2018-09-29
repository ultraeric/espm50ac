import paths from './paths';

class Nav {
  constructor(name, href, hrefMatches=[], subnavs=null) {
    this.name = name;
    this.href = href;
    this.subnavs = subnavs;
    this.hrefMatches = hrefMatches;
    hrefMatches.push(this.href);
  }
}

let marketplaceNavs = [
  new Nav('Purchases', paths.purchases)
];

let mainNavs = [
  new Nav('Login', '/login'),
  new Nav('Marketplace', paths.marketplace, [], marketplaceNavs),
  new Nav('Profile', paths.profile),
];

export default mainNavs;
export {mainNavs};
