import products from './products';

var globalState = {
  me: null,
  exps: [],
  products: products,
  purchases: []
};

window.globalState = globalState;

export default globalState;
export {globalState};
