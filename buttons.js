//globabl variables
const requestPromise = require('request-promise');
const telescope = require('code-telescope');
const reflectedXSSDetection = require('xss-attack-detection');
const reflectedXSS = new reflectedXSSDetection.xssAttackDetection();

//get url from user input
document.getElementById('scanUrl').onclick = function () 
{
    //get text input from index.html
    var getText = document.getElementById("urlInput").value;
   
    //parse source code
    getSourceCode(getText);
}

//get script from user input
document.getElementById('scanSource').onclick = function () 
{
    //get inputed js code from index.html
    var getText = document.getElementById("scriptSource").value;

    //look for XSS
    scanForVulnerablities(getText);

}


//get source code from provided url
function getSourceCode(url)
{

   requestPromise(url)

    .then(function(html)
    {
     parseURL(html);
     
    })
    .catch(function(err)
    {
      //handle error
    });

}



//get JS code that was inputed by the user
function parseURL(sourceCode)
{
 
  //parse everything between script tags and get javascript
  var scriptFirstPos = sourceCode.indexOf("<script");
  var scriptLastPos = sourceCode.lastIndexOf("</script");
  var scriptsOnly = sourceCode.substring((scriptFirstPos + 7),scriptLastPos);

  //look for XSS
  scanForVulnerablities(scriptsOnly);

}


//scan for vulnerablities
function scanForVulnerablities(jsScript)
{

  //Check For DOM XSS Vulnerablities 
  var domXSS = telescope(jsScript);
  
  //convert to string
  var domXSSoutput = JSON.stringify(domXSS);

  //parse out the source and sinks
  var sourcesPos = domXSSoutput.indexOf('_') + 11;
  //-4 for sinks +11 for sources
  var sinksPos = domXSSoutput.lastIndexOf('_');
  var sources = domXSSoutput.substring(sourcesPos, sinksPos - 4);
  var sinks = domXSSoutput.substring(sinksPos + 11, domXSSoutput.length);

  
  //reflectedXSS
  var reflextedXSSResults = JSON.stringify(reflectedXSS.detect(jsScript));

  //pass to output msg
  output(sources, sinks, reflextedXSSResults);
}

//output message
function output(domSource, domSink, rXSS)
{
  
  if( (domSink.length > 5) && (domSource.length > 6))
  {
    alert("DOM XSS vulnerability found");
  }
  else
  {
    alert("No DOM XSS vulnerabilites found");
  }
  

  alert("----------------------" + "\n" +
         "Source: " + domSource + "\n" + "\n" + "\n" +
         "Sink: " + domSink + "\n" + "\n" + "\n" +"\n " +
         "refectedXSS: " + rXSS    
  )
}
