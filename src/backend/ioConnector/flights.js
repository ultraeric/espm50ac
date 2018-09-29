function connectFlights(socket, db) {
  socket.on('/request/flights/getDestinations',
    (data) => {
      socket.emit('/response/flights/getDestinations',
        ['AKL', 'SFO', 'CPH', 'CDG', 'FUK', 'DXB', 'PEK', 'DUS', 'MAA', 'MLE']);
    }
  );
}

export default connectFlights;
export {connectFlights};