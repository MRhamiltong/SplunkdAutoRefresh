//popup.js
var debug = true;

window.onload() = setChanges("getInterval");

//Updates page settings, starts timer if needed
document.getElementById("saveBtn").onclick=function saveChanges()
{
	if(debug) console.log("Save Button Pressed");
	setChanges("save");
};

function setChanges(purpose)
{
	chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) 
	{
  		chrome.tabs.sendMessage(tabs[0].id, {target: purpose, autoRefresh: document.getElementById("autoRefresh").checked, interval: document.getElementById("rfInterval").value}, function(response) 
  		{
  			if(debug) console.log("Popup Message: autoRefresh -> " + document.getElementById("autoRefresh").checked + ", interval -> " + document.getElementById("rfInterval").value);

  			try
  			{
  				var myTemp;
    			if(response.autoRefresh == true)
    			{
    				myTemp = response.interval;
    			}
    			else
    			{
    				myTemp = "Not Refreshing";
    			}

    			document.getElementById("currInterval").value = "Current Interval: " + myTemp;
    			if(debug) console.log("Current Interval to display: " + myTemp);
    		}
    		catch(err)
    		{
    			console.log(err.message);
    			//refresh();
    		}
  		});
	});
}