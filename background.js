//*************************Variables**************************************
var debug = true;  //Toggle debug console logs
var autoRefresh = false;  //Toggle refresh on interval
var autoDetect = true; //Toggle automatic 503 error detection
var minuteInterval = 1.5;  //Interval between autoRefresh (assuming autoRefresh = true)



//*************************Don't touch anything below this line*****************************
var interval = minuteInterval * 60000;
var myLoop;
var username;
var password;

//*************************Functions*****************

//Interval in milliseconds
window.onload = function()
{
	if(autoRefresh) myLoop = setInterval(function() {update()}, interval);
}

function save()
{
	clearInterval(myLoop);
	if(autoRefresh) myLoop = setInterval(function() {update()}, interval);
}

function update()
{
	if(debug) console.log("Update entered");

	var url;
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) 
	{
    	url = tabs[0].url;
    	if(debug) console.log("Retrieved url: " + url);

    	if((url.indexOf("splunk")> -1) && (url.indexOf("login") > -1))
		{
			//check("login");
		//wait(10seconds)
		}
		else
		{
			if(url.indexOf("splunk")>-1) refresh();
		}
	});
};

//Checks each time a tab is focused
chrome.tabs.onActivated.addListener(function(activeInfo) {
    url = tabs[0].url;
      if ((changeInfo.status === 'complete') && (url.indexOf("splunk") >-1)) {
        if(autoDetect) check("check");
    }
});

//Checks each time a page is loaded
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {

  var url;
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) 
  {
      url = tabs[0].url;
      if ((changeInfo.status === 'complete') && (url.indexOf("splunk") >-1)) {
        if(autoDetect) check("check");
    }
  });
});

function refresh()
{
	chrome.tabs.reload();
	if(debug) console.log("Page Refresh");
};

//****************************Messaging*********************

function check(purpose)
{
	if(debug) console.log("Purpose: " + purpose);
	chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) 
	{
  		chrome.tabs.sendMessage(tabs[0].id, {target: purpose}, function(response) 
  		{
  			try
  			{
    			if(response.status == "true")
    			{
    				refresh();
    				if(debug) console.log("response.status: true");
    			}
    			else
    			{
    				if(debug) console.log("response.status = false");
    			}
    		}
    		catch(err)
    		{
    			console.log(err.message);
    			//refresh();
    		}
  		});
	});
}

//Listen for changes from popup
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

  	if(debug) console.log("Background.js received request: " + request);
  	if(request.target == "save")
  	{
  		autoRefresh = request.autoRefresh;
  		interval = request.interval;
  		save();
  		sendResponse({autoRefresh: autoRefresh, interval: interval});
  	}
  	else if(request.target == "getInterval")
  	{
  		sendResponse({autoRefresh: autoRefresh, interval: interval});
  	}
});


//******************************** No real clue****************************

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    chrome.tabs.executeScript(null,{file:"contentscript.js"});
});