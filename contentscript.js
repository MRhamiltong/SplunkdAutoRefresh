//contentscript.js
var username = "hash";
var password = "brownies";
var debug = true;

function check()
{
	if(debug) console.log("check entered");

	var status = false;
	if(document.body.innerText.indexOf("503 Service Unavailable") != -1)
	{
		if(debug) console.log("503 found, refreshing.");
		status = true;
	}
	return status;
};

function login()
{
	$("#username").val(username);
	$("#password").val(password);
	//$("form#loginForm").submit();

	//document.getElementByID("username").value=username;
	//document.getElementByID("password").value=password;
	//document.loginForm.submit();
};

//************************Messaging Functions**********************


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

  	if(debug) console.log("Received request: " + request.target);
  	if(request.target == "login")
  	{
  		login();
  		sendResponse({status: "false"});
  	}
  	else if(request.target == "check")
  	{
  		if(debug) console.log("Target check entered.");

  		var response = "false";
  		if(check())
  		{
  			response = "true";
  		}
  		if(debug) console.log("Returned check status: " + response);

  		sendResponse({status:response});
  	}
    	//sendResponse({status: check()});
});