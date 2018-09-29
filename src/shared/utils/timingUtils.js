
function debounce(callback, limiter) {
  var lastCall = null;
  return function () {
    if (lastCall === null) {
      console.log(limiter);
      lastCall = setTimeout(() => {lastCall = null; callback(arguments);}, limiter);
    } else {
      return;
    }
  };
}

function getDate(includeTime=false, offsetDays=0, offsetHours=0, offsetMinutes=0) {
  let x = new Date();
  if (offsetDays) x.setDate(x.getUTCDate() + offsetDays);
  if (offsetHours) x.setHours(x.getUTCHours() + offsetHours);
  if (offsetMinutes) x.setMInutes(x.getUTCMinutes() + offsetMinutes);
  return includeTime ? x.toLocaleString() : x.toLocaleDateString();
}

export default debounce;
export {debounce, getDate};
