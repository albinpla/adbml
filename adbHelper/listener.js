console.log("Content script loaded!!");
// document.addEventListener("DOMContentLoaded", context);
document.onload = context();
function context(){
  // console.log("Adding context");
  context = prompt("Enter Context Please don't cancel");
  console.log("New context added!!  "+context);
  var sending = browser.runtime.sendMessage({url : window.location.href, context:context});

}
