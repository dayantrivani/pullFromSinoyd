/* eslint-disable */
var userAgent = navigator.userAgent,
    rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
    rFirefox = /(firefox)\/([\w.]+)/,
    rOpera = /(opera).+version\/([\w.]+)/,
    rChrome = /(chrome)\/([\w.]+)/,
    rSafari = /version\/([\w.]+).*(safari)/;
var browser;
var version;
var ua = userAgent.toLowerCase();
function uaMatch(ua) {
  var match = rMsie.exec(ua);
  if (match != null) {
    return { browser : "IE", version : match[2] || "0" };
  }
  var match = rFirefox.exec(ua);
  if (match != null) {
    return { browser : match[1] || "", version : match[2] || "0" };
  }
  var match = rOpera.exec(ua);
  if (match != null) {
    return { browser : match[1] || "", version : match[2] || "0" };
  }
  var match = rChrome.exec(ua);
  if (match != null) {
    return { browser : match[1] || "", version : match[2] || "0" };
  }
  var match = rSafari.exec(ua);
  if (match != null) {
    return { browser : match[2] || "", version : match[1] || "0" };
  }
  if (match != null) {
    return { browser : "", version : "0" };
  }
}
var browserMatch = uaMatch(userAgent.toLowerCase());
if (browserMatch.browser) {
  browser = browserMatch.browser;
  version = browserMatch.version;
}

var str = '';
var copyright='金格科技iWebOffice2015智能文档中间件[演示版];V5.0S0xGAAEAAAAAAAAAEAAAAJ8BAACgAQAALAAAAON0a0XnoWy9199/PgGOF5bHSHgWwCmPIDXFpCaYPy/n+eYY4mp949JSoYm9Pis/EmcDDFIkrB02cRs3pkdz6jswKxa86guGnGbXcA2/k4LrrcLgpKk4up1JHNRnXFGpkI8rwMA1o+ZAsmdwGj6DFjGVDmUPUIEdJMqgXzNDxCls0MviLhzXoebbnt5R0/vPdqMk4zUJM4HtLm/bHmsLjaaKhBUnmcdTDXgjtJ8KpfLGROhfLXJlMOPUWwqm0JnaPYDDKLefel/CHfpzPQJnPm4xJlTwhrhN7oR32+IlHd8R8yCNFONvZKxKIGU710Ig0G4YKfd4eLmOz/RKZQmi42ANnT98pU3/GYu7shHI9uQU/MycJl39dILs6GQf+Mfm6q94VbXst1DWitZSIY7PogH3PWOJfG02TLovVpCvejFdijVylVWKl2cy2UN0oYzxpG1tsm+dMb0GMezZsBsncdNWS+yQC5WjBsvrtBpZfWS2I0ReW51flxKjkLXz5SwQhtyC2Sm3vz+KQfl0Um0Uv/OVS4lGtyw8QYBLYtzqCHIZbMNTJikFNTQxAWm5+J4yKA==';

str += '<object id="WebOffice" ';

str += ' width="100%"';
str += ' height="100%"';

if ((window.ActiveXObject!=undefined) || (window.ActiveXObject!=null) ||"ActiveXObject" in window)
{
	if(window.navigator.platform == "Win32")
		str += ' CLASSID="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"  codebase="../../iWebOffice2015.cab#version=12,6,0,702"';
	if (window.navigator.platform == "Win64")
		str += ' CLASSID="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D024"  codebase="../../iWebOffice2015.cab#version=12,6,0,702"';
	str += '>';
	str += '<param name="Copyright" value="' + copyright + '">';
}
else if (browser == "chrome")
{
	str += ' clsid="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"';
	str += ' type="application/kg-plugin"';
	str += ' OnCommand="OnCommand"';
	str += ' OnRightClickedWhenAnnotate="OnRightClickedWhenAnnotate"';
	str += ' OnSending="OnSending"';
	str += ' OnSendEnd="OnSendEnd"';
	str += ' OnRecvStart="OnRecvStart"';
	str += ' OnRecving="OnRecving"';
	str += ' OnRecvEnd="OnRecvEnd"';
	str += ' OnFullSizeBefore="OnFullSizeBefore"';
	str += ' OnFullSizeAfter="OnFullSizeAfter"';
	str += ' Copyright="' + copyright + '"';
}
else if (browser == "firefox")
{
	str += ' clsid="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"';
	str += ' type="application/kg-activex"';
	str += ' OnCommand="OnCommand"';
	str += ' OnReady="OnReady"';
	str += ' OnOLECommand="OnOLECommand"';
	str += ' OnExecuteScripted="OnExecuteScripted"';
	str += ' OnQuit="OnQuit"';
	str += ' OnSendStart="OnSendStart"';
	str += ' OnSending="OnSending"';
	str += ' OnSendEnd="OnSendEnd"';
	str += ' OnRecvStart="OnRecvStart"';
	str += ' OnRecving="OnRecving"';
	str += ' OnRecvEnd="OnRecvEnd"';
	str += ' OnRightClickedWhenAnnotate="OnRightClickedWhenAnnotate"';
	str += ' OnFullSizeBefore="OnFullSizeBefore"';
	str += ' OnFullSizeAfter="OnFullSizeAfter"';
	str += ' Copyright="' + copyright + '"';
	str += '>';
}
str += '</object>';
// document.write(str);

export default str;
