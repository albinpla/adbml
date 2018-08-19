// let dstore = {
//   blocked : true,
//   newfilter : "",
//   changefilter : false,
//   context : ""
// };
let matchContextList = false;
let siteType ="Education";

console.log("_____Adblocker Initiated_____");
unblocked = false
// import * as webContext from 'context.js';
// from context import context;
let newfilter = {"newfilter" : ""};
let changed = {"changed":false}
let blocking = {"blocking":false};
browser.storage.local.set(newfilter);
browser.storage.local.set(blocking);
browser.storage.local.set(changed);
let ABPFilterParser = require('abp-filter-parser');
// var IDBFiles = require('idb-file-storage')
var fs = require('fs');
var unique = require('uniq');
// var bloomf = require('bloom-filter-js');

let parsedContest = {
// "Adult":null,
// "Business":null,
// "Computer":null,
// "Education":null,
// "Entertainment":null,
// "Games":null,
// "Health":null,
// "Home":null,
// "Kids":null,
// "Media":null,
// "Shopping":null,
// "Sports":null
};
contextList={
  0:"Adult",
  1:"Business",
  2:"Computer",
  3:"Education",
  4:"Entertainment",
  5:"Games",
  6:"Health",
  7:"Home",
  8:"Kids",
  9:"Media",
  10:"Shopping",
  11:"Sports"
};

let contex ={};

contex["Adult"] = fs.readFileSync(__dirname + "/context/Adult.txt", "utf-8");
contex["Business"] = fs.readFileSync(__dirname + "/context/Business.txt", "utf-8");
contex["Computer"] = fs.readFileSync(__dirname + "/context/Computer.txt", "utf-8");
contex["Education"] = fs.readFileSync(__dirname + "/context/Education.txt", "utf-8");
contex["Entertainment"] = fs.readFileSync(__dirname + "/context/Entertainment.txt", "utf-8");
contex["Games"] = fs.readFileSync(__dirname + "/context/Games.txt", "utf-8");
contex["Health"] = fs.readFileSync(__dirname + "/context/Health.txt", "utf-8");
contex["Home"] = fs.readFileSync(__dirname + "/context/Home.txt", "utf-8");
contex["Kids"] = fs.readFileSync(__dirname + "/context/Kids.txt", "utf-8");
contex["Media"] = fs.readFileSync(__dirname + "/context/Media.txt", "utf-8");
contex["Shopping"] = fs.readFileSync(__dirname + "/context/Shopping.txt", "utf-8");
contex["Sports"] = fs.readFileSync(__dirname + "/context/Sports.txt", "utf-8");
// let adult ={};
// ABPFilterParser.parse(contex["Adult"], adult);
// let business ={}
// ABPFilterParser.parse(contex["Business"], business);
// let computer ={}
// ABPFilterParser.parse(contex["Computers"], computer);
// let education ={}
// ABPFilterParser.parse(contex["Education"], education);
// let Entertainment ={}
// ABPFilterParser.parse(contex["Entertainment"], entertainment);
// let games ={}
// ABPFilterParser.parse(contex["Games"], games);
// let health ={}
// ABPFilterParser.parse(contex["Health"], health);
// let home ={}
// ABPFilterParser.parse(contex["Home"], home);
// let kids ={}
// ABPFilterParser.parse(contex["Kids"], kids);
// let media ={}
// ABPFilterParser.parse(contex["Media"], media);
// let shopping ={}
// ABPFilterParser.parse(contex["Shopping"], shopping);
// let sports ={}
// ABPFilterParser.parse(contex["Sports"], sports);
var conIterator = 0;
let parsedContextD={};
for(;conIterator<12;conIterator++)
{
  console.log("parsing context "+conIterator);
  ABPFilterParser.parse(contex[contextList[conIterator]], parsedContextD);
  parsedContest[[contextList[conIterator]]] = parsedContextD;
  // console.log(parsedContextD);
}

let parsedContextData = [];
var temp;

// let easyListTxt = "||ads.example.com^";
let easyListTxt = fs.readFileSync(__dirname + "/easylist.txt", "utf-8");
let userFilter = fs.readFileSync(__dirname + "/ml/userfilter.txt", "utf-8");

let parsedFilterData = {};
let parseduserFilterData = {};
let parsedeleFilterData = {};

ABPFilterParser.parse(easyListTxt, parsedFilterData);
console.log("Easylist parsed\n");
ABPFilterParser.parse(userFilter, parseduserFilterData);
console.log("User Filter parsed\n");

// This is the site who's URLs are being checked, not the domain of the URL being checked.
let currentPageDomain = 'slashdot.org';
function blockUrl(requestDetails)
{

  if(requestDetails.type.toLowerCase()=="main_frame")
  {
    findcontext(requestDetails);
  }

  // unblock all ads

  store = browser.storage.local.get("blocking");
  blocked = store.then(function(result) {
console.log("Unblock all ads value :"+result["blocking"]);
return result["blocking"];
});
  if(unblocked == true)
  {
    console.log("Url is unblocked");
    return {cancel : false}
  }

matchEasyList = ABPFilterParser.matches(parsedFilterData, requestDetails.url, {
      domain: currentPageDomain,
      elementTypeMaskMap: ABPFilterParser.elementTypes.SCRIPT,
    });
matchuserFilter = ABPFilterParser.matches(parseduserFilterData, requestDetails.url, {
      domain: currentPageDomain,
      elementTypeMaskMap: ABPFilterParser.elementTypes.SCRIPT,
    });
  console.log("siteType:"+siteType);
matchContextList = ABPFilterParser.matches(parsedContest[siteType], requestDetails.url, {
        domain: currentPageDomain,
        elementTypeMaskMap: ABPFilterParser.elementTypes.SCRIPT,
    });
if (matchEasyList || matchuserFilter || matchContextList)
    {
  console.log("EasyList :"+matchEasyList+"\nUser Filter :"+matchuserFilter+"\ncontext filter :"+matchContextList);
  console.log("Loading: " + requestDetails.url);
  console.log('URL/Resource blocked!');
  return {redirectUrl : browser.extension.getURL("images/blocked.svg")}
  // return {cancel:true}
} else {
  // console.log("Loading: " + requestDetails.url);
  // console.log('You should NOT block this URL!');
  return {cancel : false}
}

}

function logURL(requestDetails) {
  console.log("Loading: " + requestDetails.url);
}

browser.webRequest.onBeforeRequest.addListener(
  blockUrl,
  {urls: ["<all_urls>"]},
  ["blocking"]
);

browser.runtime.onMessage.addListener(reboot)

function get_domain_from_url(url) {
var sourceString = url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
return sourceString;
}

function reboot(message)
{
  if (message.changed)
  {
    console.log(" Filter change analysed!!!");

    var parsedUrl = get_domain_from_url(message.filter)
    console.log("new filter "+parsedUrl+" accepted ");
    filterRule = "||"+parsedUrl+"^";

    userFilter = userFilter+filterRule+"\n";
    console.log("content in user filter "+userFilter);
    // console.log(userFilter+"||"+message.filter+"^\n");
    ABPFilterParser.parse(userFilter, parseduserFilterData);
    console.log("Parsed!!");
    // browser.tabs.reload(tab.id);
    filter_call = new XMLHttpRequest();
    url = "http://127.0.0.1:8080/addFilter?&filter="+userFilter;
    console.log("Ajax call to "+url);
    filter_call.onreadystatechange = function() {
    }

    filter_call.open('GET', url, true);
    filter_call.send();

  }

}

function findcontext (requestDetails){
svm_call = new XMLHttpRequest();
url = "http://127.0.0.1:8080/findcontext?&url="+requestDetails.url;
console.log("Ajax call to "+url);
svm_call.onreadystatechange = function() {
  if (svm_call.readyState === 4) {
    let context = JSON.parse(svm_call.response);
    console.log("respone from server "+svm_call.response); //Outputs a DOMString by default
    console.log("the context is "+context['context'])
    siteType = context['context'];
    // return context['context'];
  }
}
// var formData = new FormData();
// formData.append('url', requestDetails.url);
svm_call.open('GET', url, false);

return svm_call.send({"url":requestDetails.url});

}
