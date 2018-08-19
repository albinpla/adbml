console.log("Url Context extension loaded!!");

browser.runtime.onMessage.addListener(logUrl);

function logUrl(message){
// if(message.changed)
// {
console.log("message send to background script!!!");
title_call = new XMLHttpRequest();
apiUrl = "http://127.0.0.1:8080/logUrl?&url="+message.url+"&context="+message.context;
console.log("Ajax call to "+apiUrl);
// svm_call.onreadystatechange = function() {
//   if (svm_call.readyState === 4) {
//     let context = JSON.parse(svm_call.response)
//     console.log("respone from server "+svm_call.response); //Outputs a DOMString by default
//     console.log("the context is "+context['context']);  }
// };
console.log("Api called!!!");
title_call.open('GET', apiUrl, false);

title_call.send();
// }
}
