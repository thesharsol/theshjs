/**
 * 
 * @param {*} request 
 */
function xhr(request) {
  let xhr = new XMLHttpRequest();
  let data = null;
  if(request.data!=undefined){
    data = request.data;
  }

  xhr.open(request.method??'get', request.url, request.async??false)
  xhr.withCredentials = true;

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      //response = xhr.response; // Par défault une DOMString
      // console.log((xhr.response))
      request.callback(xhr.response);
    }
  }

  xhr.send(data);
}

export default xhr;