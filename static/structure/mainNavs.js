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

let registrationNavs = [
  new Nav('Tracking', paths.tracking)
];

let mainNavs = [
  new Nav('Login', '/login'),
  new Nav('Registration', paths.registration, [], registrationNavs),
  new Nav('Profile', paths.profile),
];

export default mainNavs;
export {mainNavs};
