import products from './products';

let globalState = {
  me: null,
  products: products
};

window.globalState = globalState;

export default globalState;
export {globalState};