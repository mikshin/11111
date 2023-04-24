export const Browser = {
  // Firefox 1.0+
  isFirefox: () => {
    return typeof InstallTrigger !== "undefined";
  },
  getFirefoxMajorVersion: (userAgent) => {
    userAgent = userAgent || navigator.userAgent;
    const firefoxVersionRegex = /firefox\/(\S+)/;
    const match = userAgent.toLowerCase().match(firefoxVersionRegex);
    if (match) {
      return match[1].split(".").map((x) => parseInt(x))[0];
    }
  },
  // Internet Explorer 6-11
  isIE: () => {
    return (
      navigator.userAgent.indexOf("MSIE") !== -1 || !!document.documentMode
    );
  },
  // Edge 20+
  isEdge: () => {
    return !Browser.isIE() && !!window.StyleMedia;
  },
  // Chrome 1+
  isChrome: (context = window) => {
    return !!context.chrome;
  },
  // At least Safari 3+: "[object HTMLElementConstructor]"
  isSafari: () => {
    return (
      navigator.vendor &&
      navigator.vendor.indexOf("Apple") > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf("CriOS") == -1 &&
      navigator.userAgent.indexOf("FxiOS") == -1
    );
  },
  // IOS Chrome
  isIOSChrome: () => {
    return navigator.userAgent.toLowerCase().indexOf("crios") !== -1;
  },
};
