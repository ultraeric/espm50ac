function createRequest(uri, headers, body) {
    return {
        method: 'POST', uri: uri, body: body, json: true
    };
}

function createSiaRequest(uri, body) {
    return {
        method: 'POST', uri: uri, headers: {apikey: 'aghk73f4x5haxeby7z24d2rc'}, body: body, json: true
    };
}

export default createRequest;
export {createRequest, createSiaRequest};