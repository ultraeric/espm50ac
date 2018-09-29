function makeClaim(flyerNumber, flightNumber, amount, userFeedback) {
  return {flyerNumber: flyerNumber,
    flightNumber:flightNumber,
    amount: amount,
    userFeedback: userFeedback};
}

function cleanClaim(obj) {
  return makeClaim(obj.flyerNumber, obj.flightNumber, obj.amount, obj.userFeedback);
}

function makePurchase(name, price, description, image, quantity, date, tracking) {
  quantity = parseInt(quantity);
  price = parseInt(price);
  return {
    name: name,
    price: price,
    description: description,
    image: image,
    quantity: quantity,
    date: date,
    tracking: tracking
  };
}

function cleanPurchase(obj) {
  return makePurchase(obj.name, obj.price, obj.description, obj.image, obj.quantity, obj.date, obj.tracking);
}

const events = {
  ordered: 'ordered',
  shipped: 'shipped',
  ready: 'ready',
  received: 'received'
};

function makePurchaseEvent(date, event, description) {
  if (!Object.keys(events).includes(event)) {
    event = 'unknown';
  }
  return {
    date: date,
    event: event,
    description: description
  };
}

function cleanPurchaseEvent(obj) {
  return makePurchaseEvent(obj.date, obj.event, obj.description);
}

export default makeClaim;
export { makeClaim, cleanClaim, makePurchase, cleanPurchase, makePurchaseEvent, cleanPurchaseEvent, events };