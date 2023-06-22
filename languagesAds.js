 
    var preRenderElemArray = [];
    window.preRenderAds = function(){
      var wapadsGenerator = function wapadsGenerator(_ref2) {
  var _ref2$secname = _ref2.secname,
    secname = _ref2$secname === void 0 ? "others" : _ref2$secname,
    _ref2$defaultWapAds = _ref2.defaultWapAds,
    defaultWapAds = _ref2$defaultWapAds === void 0 ? {} : _ref2$defaultWapAds,
    _ref2$pagetype = _ref2.pagetype,
    pagetype = _ref2$pagetype === void 0 ? null : _ref2$pagetype,
    _ref2$isAmpAd = _ref2.isAmpAd,
    isAmpAd = _ref2$isAmpAd === void 0 ? false : _ref2$isAmpAd;
  var wapads = defaultWapAds; // siteConfig.ads.dfpads["others"];
  // window!=="undefined" check has been added for liveblog and newbrief because  it was throwing error when used in amp
  // Because in amp we are not getting window.
  try {
    if (pagetype) {
      if (pagetype === "home") {
        secname = "homepage"; // window._SCN = "home";
      } else if (pagetype === "elections" || pagetype === "candidateShow" || pagetype === "constituencydetail") {
        secname = "microsite"; // window._SCN = "elections";
      } else if (pagetype === "newsbrief" && typeof window !== "undefined") {
        secname = "news";
        window._SCN = "newsbrief";
      } else if (pagetype === "tech") {
        secname = "tech"; // window._SCN = "tech";
      } else if (pagetype === "liveblog" && typeof window !== "undefined") {
        window._SCN = "liveblog";
      }
    }
    if (typeof window !== "undefined") {
      // Commenting below line because we have not send size 300x600 in MREC1 due to LCP issue.
      // if (window.location.pathname.indexOf("show/") > -1) {
      //   wapads.mrec1.size.push([300, 600]);
      // } else {
      //   wapads.mrec1.size.splice(3);
      // }
      if (!window.location.pathname.includes("show/")) {
        wapads.mrec1.size.splice(3);
      }
      // special handling for gadgetnow
      if (window.location.href.indexOf(".gadgetsnow.com") > -1) {
        secname = "tech";
      }
    }
    wapads = JSON.stringify(wapads);
    if (isAmpAd) {
      var secnameCapitalized = secname && secname.length > 0 ? secname.charAt(0).toUpperCase() + secname.slice(1) : "Others";
      wapads = wapads.replace(/_Others/g, "_".concat(secnameCapitalized));
    } else {
      wapads = wapads.toLowerCase().replace(/_others/g, "_".concat(secname.toLowerCase()));
    }
    wapads = JSON.parse(wapads);
  } catch (err) {
    console.error(err.msg);
  }
  return wapads;
};
      window.wapads = wapadsGenerator({
        secname : window.meta.adsec,
        defaultWapAds : window.wapads,
        pagetype : window.current_pagetype
      });

      var _isFeatureURL = function isFeatureURL(pathname) {
  var bool = false;
  var isCsr = true;
  if (typeof pathname !== "undefined") {
    isCsr = (0,_utils_util__WEBPACK_IMPORTED_MODULE_0__._isCSR)();
  }
  pathname = pathname || typeof window !== "undefined" && window.location.pathname;
  // if((pathname.indexOf('/articleshow/') > -1)){
  if (pathname && pathname.indexOf("-fea-ture/") > -1) {
    // ads block removed in case of feature URL.
    if (isCsr) {
      // document.querySelectorAll(".prerender").forEach(item => {
      //   item.style.display = "none";
      // });
      document.querySelectorAll('.featured-article .parallaxDiv, .featured-article .ad1 , .featured-article [data-plugin="ctn"]').forEach(function (item) {
        item.style.display = "none";
      });
    }
    bool = true;
  }
  return bool;
}   
      // Switch off ads for Featured URLs.
      if((_isFeatureURL() && !window.meta.resumeAds) || window.meta.adsNotToBeShown) return false;

      var getSplatsVars = function getSplatsVars(pathname) {
  var splats = [];
  var hyp1 = "";
  var pagetype = "";
  var isCsr = true;
  if (typeof pathname !== "undefined") {
    isCsr = (0,_utils_util__WEBPACK_IMPORTED_MODULE_0__._isCSR)();
  }
  if (isCsr) {
    pathname = pathname || window.location.pathname;
    pagetype = window.current_pagetype;
    if (window.meta && window.meta.longurl && window.meta.longurl != "") {
      pathname = window.meta.longurl;
    }
  }
  var getHyp1Value = function getHyp1Value(splatsN) {
    var tempSplats = splatsN.slice();
    var hyp1val;
    tempSplats.forEach(function (val) {
      if (val.indexOf("_hyp1_") > -1) {
        // [, hyp1val] = val.split("_hyp1_"); // commenting as causing issue on production after compiling
        hyp1val = val.split("_hyp1_").length > 1 && val.split("_hyp1_")[1];
      }
    });
    return hyp1val;
  };
  if (typeof pagetype === "undefined" || pagetype === "") {
    pagetype = (0,_utils_util__WEBPACK_IMPORTED_MODULE_0__.getPageType)(pathname);
  }
  // Remove '-' or ' ' with underscore
  pathname = pathname.replace(/-/g, "_");

  // special handling for home
  // if(pathname == '' || pathname == '/'){
  // const wfhArr = [
  //   "virtual",
  //   "virtual_office",
  //   "virtual_position",
  //   "remote_office",
  //   "home_based",
  //   "telecommute",
  //   "online_learning",
  //   "video_conference",
  //   "freelance_writing",
  //   "freelance",
  //   "work_at_home",
  //   "customer_service",
  //   "remote_work",
  //   "telework",
  //   "flexible_workplace_learn_from_home",
  //   "work_from_home",
  //   "work_together",
  // ];
  // const covidArr = ["corona", "covid"];
  // const wfhArrCheck = wfhArr.filter(item => pathname.indexOf(item) != -1);
  // const covidArrCheck = covidArr.filter(item => pathname.indexOf(item) != -1);

  if (pagetype === "home") {
    if (pathname.indexOf("/us") > -1 || pathname.indexOf("/bangladesh") > -1 || pathname.indexOf("/gulf") > -1) {
      splats.push("home_".concat(pathname.split("/").filter(function (item) {
        return item != "";
      })));
    } else {
      splats.push("home");
    }
  } else if (pagetype === "newsbrief") {
    splats.push("newsbrief");
  }
  // special handling for coronavirus
  //  Removing Covid && workfromhome handling
  // else if (covidArrCheck.length > 0 && wfhArrCheck.length > 0) {
  //   splats.push("coronavirus,workfromhome");
  // } else if (covidArrCheck.length > 0) {
  //   splats.push("coronavirus");
  // }
  // else if (wfhArrCheck.length > 0) {
  //   splats.push("workfromhome");
  // }
  else {
    splats = pathname.split("/").filter(function (item) {
      return item != "";
    });
    // TODO Might be moved above.
    hyp1 = pathname.indexOf("_hyp1_") > -1 ? getHyp1Value(splats) : "";
    // FIXME: Special handling of short url of ipl landing
    if (pathname.indexOf("/iplt20.cms") > -1) {
      splats = splats.splice(0, 2); // To get first 2 , for Short Urls
      // adding this for ipl20.cms page
      splats.push("iplt20");
    } else if (pathname.indexOf(".cms") > -1) {
      if (pagetype.indexOf("show") > -1 || pagetype.indexOf("moviereview") > -1) {
        splats.splice(-3, 3); // To remove last 3 values
      } else if (pagetype.indexOf("list") > -1) {
        splats.splice(-2, 2); // To remove last 2 values
      }
    } else {
      splats = splats.splice(0, 3); // To get first 3 , for Short Urls
    }
  }

  // LAN-3450 : Track DFP impression with ref
  var ref = "";
  if (isCsr) {
    /**
     * Function to get utm source from URL with ? OR #
     * @returns {string} utm source from URL
     */
    var getUtmSource = function getUtmSource() {
      var utmSource = "";
      if (document.location.href.includes("utm_source")) {
        var url = new URL(window.location.href);
        utmSource = url.searchParams.get("utm_source");
        if (!utmSource && url.hash) {
          var qs = url.hash.substring(1, url.hash.length);
          var params = new URLSearchParams(qs);
          utmSource = params.get("utm_source");
        }
      }
      return utmSource;
    };
    ref = document.referrer.indexOf("facebook") != -1 ? "facebook" : document.referrer.indexOf("google") != -1 ? "google" : document.referrer.indexOf("twitter") != -1 ? "twitter" : document.referrer.indexOf("whatsapp") != -1 ? "whatsapp" : document.location.href.indexOf("utm_source=") != -1 ? getUtmSource() : document.referrer && document.referrer.length > 0 ? "others" : "";
  }
  return {
    splats: splats,
    _ref: ref,
    hyp1: hyp1
  };
}
      var splatsVars = getSplatsVars();

      var _getppid = function getppid() {
  var ppid;

  /**
   * Function to generate random id - by default length 32
   * @param {number} len length of id
   * @returns {string} random Id
   */
  var generateRandomId = function generateRandomId(len) {
    var idArr = [];
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var charlen = chars.length;
    var length = len || 32;
    for (var i = 0; i < length; i += 1) {
      idArr[i] = chars.charAt(Math.floor(Math.random() * charlen));
    }
    return idArr.join("");
  };

  /**
   * Function to generate PPID(Publisher provided identifier)
   * @returns {string} id - length of 32 chars (combination of timestamp in hexadecimal + "ppid" + random string of remaining chars)
   */
  var generatePpid = function generatePpid() {
    var timestampId = new Date().getTime().toString(16);
    var id = "".concat(timestampId, "ppid").concat(generateRandomId(28 - timestampId.length));
    return id;
  };
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    if (localStorage.getItem("ppid")) {
      ppid = localStorage.getItem("ppid");
    } else {
      ppid = generatePpid();
      localStorage.setItem("ppid", ppid);
    }
    window._ppid = ppid;
  }
  return ppid;
};
      var ppid = _getppid();

      window.renderDfpAds = function renderDfpAds(preRenderElemArray) {
  var channelCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var keyword = arguments.length > 2 ? arguments[2] : undefined;
  var blacklist = arguments.length > 3 ? arguments[3] : undefined;
  var pagetype = arguments.length > 4 ? arguments[4] : undefined;
  var puvkey = arguments.length > 5 ? arguments[5] : undefined;
  var _auds;
  var slotsInfo = [];
  var slots = [];
  var flag = 0;
  var status;
  var finalValue = 0;
  var atfContainer;
  var updatedWrapper;
  var parent;
  var slotdef;
  var slotId;
  var slotId1 = "";
  var i = 0;
  var Wrapper;
  var observer;
  // let size;

  if (typeof window !== "undefined" && typeof colaud !== "undefined") {
    localStorage.setItem("colaud", window.colaud.aud);
  }
  if (typeof colaud !== "undefined") {
    _auds = window.colaud.aud;
  } else if (window !== "undefined" && window.localStorage && typeof localStorage !== "undefined") {
    _auds = localStorage.getItem("colaud") ? localStorage.getItem("colaud") : "";
  }
  window.wapads = wapadsGenerator({
    secname: window && window.meta && window.meta.adsec,
    defaultWapAds: window.wapads,
    pagetype: window.current_pagetype
  });

  /**
   * OSV ctn GRx tracking
   * @param {value} value event type
   */
  var fireOSVGrx = function fireOSVGrx(value, currentSlotRef) {
    if (currentSlotRef && currentSlotRef.dataset && currentSlotRef.dataset.selector && currentSlotRef.dataset.selector === "osvctn" && value) {
      window.grx("track", "NonStdAd", {
        AdName: value == "view" ? "OSV_script" : "OSV_script_fire",
        deviceCategory: process.env.PLATFORM || ""
      });
    }
  };
  var getTestPagetype = function getTestPagetype() {
    var checkProp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "nbt";
    var msid = arguments.length > 1 ? arguments[1] : undefined;
    var innovMapValues = {
      nbt: {
        test2: "68394611",
        test1: "61784346" // test1: `61784346`,68631427,58729340//
      },

      mt: {
        test1: "93611706",
        test2: "93641595" // checked
      },

      eisamay: {
        test1: "93641283",
        test2: "93610921"
      },
      ml: {
        test1: "93641799",
        // checked
        test2: "93612282"
      },
      vk: {
        test1: "93641962",
        // checked
        test2: "93641862"
      },
      tlg: {
        test1: "93641658",
        // checked
        test2: "93611663"
      },
      tml: {
        test1: "93641820",
        // checked
        test2: "93611220"
      },
      iag: {
        test1: "93642301",
        // checked
        test2: "93642171"
      }
    };
    if (typeof innovMapValues[checkProp] !== "undefined") {
      if (typeof innovMapValues[checkProp] !== "undefined" || innovMapValues[checkProp] !== null) {
        return Object.keys(innovMapValues[checkProp]).find(function (key) {
          return innovMapValues[checkProp][key] === msid;
        });
      }
      return false;
    }
    return false;
  };
  var getSlotName = function getSlotName(event) {
    var size;
    var refreshSlotName;
    var refreshDirectStatus = window && window.dfpAdConfig && window.dfpAdConfig.refreshDirectStatus ? window.dfpAdConfig.refreshDirectStatus : false;
    // If CPD is on and refreshDirectStatus is true then ads will get refresh
    // otherwise direct ads will not refresh.
    var flagDirect = typeof event.slot.getHtml() === "string" && event.slot.getHtml().indexOf("!--NO_REFRESH--") > 0 && refreshDirectStatus === "false";
    // This is only done to make sure that our refresh logic only works when CPD is on and  refreshDirectStatus is true
    // For all the other scenario andbeyond will work
    var isDirect = typeof event.slot.getHtml() === "string" && event.slot.getHtml().indexOf("!--NO_REFRESH--") > 0 && refreshDirectStatus === "true";
    // Refresh happens only for direct campagins ,for netwwork ads andbeyond will work
    // norefresh depicts if refresh has to be done or not based on property as well as CPD/Network ads
    var noRefresh = !isDirect;
    var slotName = event.slot.getAdUnitPath();
    var slotNameCaps = event.slot.getAdUnitPath().toUpperCase();
    var allowedAds = ["ATF", "MREC1", "MREC2", "MREC3", "MRECINF"];
    var location = window && window.location && window.location.href;
    var result = location.match(/.*\/([^.]+)/);
    var finalResult = "";
    var isTestPage = "";
    if (result !== null && result[1]) {
      finalResult = result[1];
    }
    var msid = finalResult;
    var pagetypeAds = "";
    if (typeof pagetype === "undefined" || pagetype === "") {
      pagetypeAds = window.tgtkeys.templatetype;
    }
    if (process.env.PLATFORM == "mobile" && (pagetypeAds === "articlelist" || pagetypeAds === "articleshow")) {
      isTestPage = getTestPagetype(process.env.SITE, msid);
    }
    var shouldRefresh = isTestPage == "test1" || isTestPage == "test2" || noRefresh == true ? "" : allowedAds.find(function (a) {
      return slotNameCaps.includes(a);
    });
    var slotId = event.slot.getSlotElementId();
    var isTopAtf = slotId && slotId.indexOf("topatf") > -1;
    if (isTopAtf) shouldRefresh = false;
    if (shouldRefresh) refreshSlotName = shouldRefresh.toLowerCase();
    var divId = "".concat(shouldRefresh, "-perpetual-");
    // const randNum = Math.floor(Math.random() * 100001);

    var newAdContainer = document.createElement("div");
    // newAdContainer.setAttribute("id", `${divId}-${randNum}`);
    if (shouldRefresh === "ATF") {
      if (process.env.PLATFORM == "mobile") {
        size = [[300, 250], [320, 100], [320, 50], [336, 280], [250, 250], [300, 50]];
      } else {
        size = [[970, 250], [728, 90], [980, 200], [980, 120], [950, 90], [930, 180], [750, 300], [750, 200], [750, 100], [970, 90]];
      }
    }
    if (shouldRefresh != "ATF" && size == null) {
      if (process.env.PLATFORM == "mobile") {
        size = [[336, 280], [320, 250], [300, 250], [250, 250], [200, 200], [180, 150]];
      } else {
        size = [[300, 250], [250, 250], [200, 200]];
      }
    }
    if (size) size = JSON.stringify(size);
    newAdContainer.setAttribute("data-size", "".concat(size));
    return {
      shouldRefresh: shouldRefresh,
      newAdContainer: newAdContainer,
      refreshSlotName: refreshSlotName,
      flagDirect: flagDirect
    };
  };
  try {
    var sectionData = splatsVars.splats;
    var _SCN = sectionData[0] || "";
    var _SubSCN = sectionData[1] || "";
    var _LastSubSCN = sectionData[2] || "";
    var _oem = new URL(window.location.href).searchParams.get("utm_source");
    var _hyp1 = splatsVars.hyp1 || "";
    var _ref = splatsVars._ref || channelCode;
    _ref = _ref && _ref.toLowerCase() + (process.env.PLATFORM == "desktop" ? "_web" : "_wap");
  } catch (e) {
    console.log("error in ads catch", e);
  }
  if (typeof window != "undefined") {
    window.getSlotName = getSlotName;
  }
  googletag.cmd.push(function () {
    if (Array.isArray(preRenderElemArray) && preRenderElemArray.length > 0) {
      preRenderElemArray.forEach(function (elem) {
        elem.style.display = "block";
        var adtype = elem && elem.getAttribute("data-adtype");
        var adObj = {
          name: adtype && window.wapads[adtype] && window.wapads[adtype].name ? window.wapads[adtype].name : elem && elem.getAttribute("data-path"),
          size: adtype && window.wapads[adtype] && window.wapads[adtype].size ? window.wapads[adtype].size : elem && JSON.parse(elem.getAttribute("data-size")),
          id: elem && elem.getAttribute("id")
        };
        var gtag = googletag.defineSlot(adObj.name, adObj.size, adObj.id).addService(googletag.pubads());
        slotsInfo.push({
          name: adObj.name,
          size: adObj.size,
          id: adObj.id,
          slot: gtag,
          elem: elem
        });
        // googletag.companionAds().setRefreshUnfilledSlots(true);
        slots.push(gtag);
        elem.setAttribute("data-path", adObj.name);
        // elem.setAttribute("data-size", adObj.size);

        if (!window.adSlotsDFP) {
          window.adSlotsDFP = {};
        }
        if (adtype == "topatf" || adtype == "canvasAd") {
          window.adSlotsDFP[adtype] = gtag;
        } else {
          window.adSlotsDFP[elem.getAttribute("id")] = gtag;
        }
      });
    }
    if (getCookie("optout") === "1") {
      googletag.pubads().setRequestNonPersonalizedAds(1);
    }
    if (!window.adListenerAdded) {
      window.adListenerAdded = true;
      googletag.pubads().addEventListener("slotRenderEnded", function (event) {
        var fun_renderEnded = function fun_renderEnded() {
          if (event && event.slot) {
            var slot = event.slot;
            var slotName = event.slot.getAdUnitPath().toLowerCase();
            if (slotName.indexOf("_atf") > -1 && typeof event.slot.getHtml() === "string" && event.slot.getHtml().indexOf("Expandable") > 0 && document.querySelector(".ad1.atf")) {
              document.querySelector(".ad1.atf").classList.add("expando");
            } else if (slotName.indexOf("_atf") > -1 && document.querySelector(".ad1.atf")) {
              document.querySelector(".ad1.atf").classList.remove("expando");
            }
            var refreshOffset = window && window.dfpAdConfig && window.dfpAdConfig.refreshOffset ? window.dfpAdConfig.refreshOffset : 300;
            var indexWrapper = window.tgtkeys.msid ? "index_".concat(window.tgtkeys.msid) : "index";
            var _window$getSlotName = window.getSlotName(event),
              shouldRefresh = _window$getSlotName.shouldRefresh,
              newAdContainer = _window$getSlotName.newAdContainer,
              refreshSlotName = _window$getSlotName.refreshSlotName,
              flagDirect = _window$getSlotName.flagDirect;
            var randNum = Math.floor(Math.random() * 100001);
            parent = document.getElementById(event.slot.getSlotElementId());
            var config = {
              root: null,
              rootMargin: "".concat(refreshOffset, "px"),
              threshold: 0.000001 // when 20% in view
            };

            slotId = slot.getSlotElementId();
            if (shouldRefresh) {
              Wrapper = document.getElementById(event.slot.getSlotElementId());
              if ("IntersectionObserver" in window && !flagDirect && Wrapper) {
                observer = new IntersectionObserver(function (entries) {
                  // isIntersecting is true when element and viewport are overlapping
                  entries.forEach(function (entry) {
                    var target = entry.target,
                      isIntersecting = entry.isIntersecting;
                    var bounds = target.getBoundingClientRect();
                    var slotNames1 = "refreshnews";
                    if (isIntersecting === true) {
                      if (shouldRefresh === "ATF") Wrapper;else if (!sessionStorage.getItem(indexWrapper)) {
                        sessionStorage.setItem(indexWrapper, 1);
                      }
                      var adSlotEle = target;
                      var refreshObj = window.wapads.refreshnews || window.wapads.refreshNews || {};
                      if (adSlotEle && adSlotEle.getAttribute("data-view-status") == "true") {
                        var divId = "".concat(shouldRefresh, "-perpetual-");
                        if (slotName.indexOf("_perpetual_1_sup1") > -1) {
                          slotdef = "".concat(refreshObj, "_").concat(refreshSlotName, "_Perpetual_1_Sup2");
                        } else if (slotName.indexOf("_perpetual_1_") > -1 || slotName.indexOf("_perpetual_2_") > -1) {
                          slotdef = "".concat(refreshObj, "_").concat(refreshSlotName, "_Perpetual_1_Sup1");
                        } else if (slotName.indexOf("sup1") > -1) {
                          slotdef = "".concat(refreshObj, "_").concat(refreshSlotName, "_sup2");
                        } else if (slotName.indexOf("sup2") > -1) {
                          slotdef = "".concat(refreshObj, "_").concat(refreshSlotName, "_sup1");
                        } else {
                          slotdef = "".concat(refreshObj, "_").concat(refreshSlotName, "_sup1");
                        }
                        updatedWrapper = adSlotEle && adSlotEle.parentNode;
                        var newId = "".concat(divId, "-").concat(Date.now(), "_perp");

                        // if (adSlotEle.getAttribute("id") == newAdContainer.getAttribute("id"))
                        newAdContainer.setAttribute("id", newId);
                        newAdContainer.setAttribute("data-adtype-temp", slotNames1);
                        newAdContainer.setAttribute("data-path", slotdef);
                        newAdContainer.setAttribute("data-adtype", slotNames1);
                        newAdContainer.setAttribute("class", "refreshAds");
                        if (newAdContainer && adSlotEle) {
                          if (updatedWrapper) {
                            updatedWrapper.append(newAdContainer);
                          }
                          googletag.destroySlots([event.slot]);
                          adSlotEle.remove();
                          renderDfpAds([newAdContainer]);
                          newAdContainer.setAttribute("data-view-status", "false");
                        }
                        observer.unobserve(adSlotEle);
                      }
                    }
                  });
                }, config);
                observer.observe(Wrapper);
              }
            }
          }
        };
        if (document.readyState !== "complete") {
          document.addEventListener("readystatechange", function (domevent) {
            if (domevent.target.readyState === "complete") {
              fun_renderEnded();
            }
          });
        } else {
          fun_renderEnded();
        }
      });
    }
    if (!window.viewableListenerAdded) {
      window.viewableListenerAdded = true;
      googletag.pubads().addEventListener("impressionViewable", function (event) {
        var currentSlotRef = document.getElementById(event.slot.getSlotElementId());
        var fun_impressionViewable = function fun_impressionViewable() {
          var _window$getSlotName2 = window.getSlotName(event),
            shouldRefresh = _window$getSlotName2.shouldRefresh,
            newAdContainer = _window$getSlotName2.newAdContainer,
            refreshSlotName = _window$getSlotName2.refreshSlotName,
            flagDirect = _window$getSlotName2.flagDirect;
          var slotNames1 = "refreshnews";
          // const slotName = event.slot.getAdUnitPath().toLowerCase();
          if (shouldRefresh) {
            var delayConfig = refreshSlotName && process.env.PLATFORM ? "refreshDelay_".concat(refreshSlotName, "_").concat(process.env.PLATFORM === "desktop" ? "d" : "m") : "";
            var refreshDelay = window && delayConfig && window.dfpAdConfig && window.dfpAdConfig[delayConfig] || window && window.dfpAdConfig && window.dfpAdConfig.refreshDelay || 30;
            if (currentSlotRef) {
              setTimeout(function () {
                var flagCount = 0;
                var slotName_ = event.slot.getAdUnitPath().toLowerCase();
                var divId = "".concat(shouldRefresh, "-perpetual-");
                var refreshObj = window.wapads.refreshnews || window.wapads.refreshNews || {};
                if (slotName_.indexOf("_perpetual_1_sup1") > -1) {
                  slotdef = "".concat(refreshObj, "_").concat(refreshSlotName, "_Perpetual_1_Sup2");
                } else if (slotName_.indexOf("_perpetual_1_") > -1 || slotName_.indexOf("_perpetual_2_") > -1) {
                  slotdef = "".concat(refreshObj, "_").concat(refreshSlotName, "_Perpetual_1_Sup1");
                } else if (slotName_.indexOf("sup1") > -1) {
                  slotdef = "".concat(refreshObj, "_").concat(refreshSlotName, "_sup2");
                } else if (slotName_.indexOf("sup2") > -1) {
                  slotdef = "".concat(refreshObj, "_").concat(refreshSlotName, "_sup1");
                } else {
                  slotdef = "".concat(refreshObj, "_").concat(refreshSlotName, "_sup1");
                }
                var cont = currentSlotRef;
                var rect = cont.getBoundingClientRect();
                var inView = rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ && rect.right <= (window.innerWidth || document.documentElement.clientWidth); /* or $(window).width() */
                if (cont && inView) {
                  var newId = "".concat(divId, "-").concat(Date.now(), "_perp");

                  // if (currentSlotRef.getAttribute("id") == newAdContainer.getAttribute("id"))
                  newAdContainer.setAttribute("id", newId);
                  newAdContainer.setAttribute("data-path", slotdef);
                  newAdContainer.setAttribute("data-adtype", slotNames1);
                  if (newAdContainer && currentSlotRef) {
                    if (currentSlotRef && currentSlotRef.parentNode) currentSlotRef.parentNode.append(newAdContainer);
                    if (!flagDirect) {
                      googletag.destroySlots([event.slot]);
                      if (currentSlotRef) currentSlotRef.remove();
                      renderDfpAds([newAdContainer]);
                    }
                  }
                }
              }, refreshDelay * 1000);
            }
          }
        };
        if (document.readyState !== "complete") {
          document.addEventListener("readystatechange", function (domevent) {
            if (domevent.target.readyState === "complete") {
              fun_impressionViewable();
            }
          });
        } else {
          fun_impressionViewable();
        }
        fireOSVGrx("view", currentSlotRef);
      });
    }
    if (!window.slotOnloadListenerAdded) {
      window.slotOnloadListenerAdded = true;
      googletag.pubads().addEventListener("slotOnload", function (event) {
        // A creative iframe fires its onload event.
        if (event && event.slot) {
          var currentSlotRef = document.getElementById(event.slot.getSlotElementId());
          fireOSVGrx("load", currentSlotRef);
        }
      });
    }
    googletag.pubads().addEventListener("slotVisibilityChanged", function (event) {
      var slotNames1 = "refreshNews";
      var fun_slotVisibilityChanged = function fun_slotVisibilityChanged() {
        var _window$getSlotName3 = window.getSlotName(event),
          shouldRefresh = _window$getSlotName3.shouldRefresh;
        var slotName = event.slot.getAdUnitPath().toUpperCase();
        if (shouldRefresh) {
          var currentSlotRef = document.getElementById(event.slot.getSlotElementId());
          if (!currentSlotRef) {
            currentSlotRef = document.querySelector("[data-id='".concat(event.slot.getSlotElementId(), "'] div"));
          }
          if (currentSlotRef) {
            if (event.inViewPercentage == "0" && currentSlotRef && parseInt(currentSlotRef.getAttribute("data-view-prev-status"), 10) > 0) {
              currentSlotRef.setAttribute("data-view-status", "true");
            } else {
              currentSlotRef.setAttribute("data-view-prev-status", event.inViewPercentage);
            }
          }
        }
      };
      if (document.readyState !== "complete") {
        document.addEventListener("readystatechange", function (domevent) {
          if (domevent.target.readyState === "complete") {
            fun_slotVisibilityChanged();
          }
        });
      } else {
        fun_slotVisibilityChanged();
      }
    });
    var templateType = window.tgtkeys && window.tgtkeys.templatetype || "";
    _SCN !== "" ? googletag.pubads().setTargeting("SCN", _SCN) : "";
    _SubSCN !== "" ? googletag.pubads().setTargeting("SubSCN", _SubSCN) : "";
    _LastSubSCN !== "" ? googletag.pubads().setTargeting("LastSubSCN", _LastSubSCN) : "";
    _hyp1 !== "" ? googletag.pubads().setTargeting("Hyp1", _hyp1) : "";
    window.tgtkeys.msid ? googletag.pubads().setTargeting("storyId", window.tgtkeys.msid) : "";
    googletag.pubads().setTargeting("ARC1", "strong").setTargeting("_ref", _ref).setTargeting("oem", _oem || "").setTargeting("BL", blacklist || "0").setTargeting("puv", puvkey || "0").setTargeting("templatetype", templateType).setTargeting("countrycode", window.geoinfo && window.geoinfo.CountryCode ? window.geoinfo.CountryCode : "IN").setTargeting("keyword", keyword || "").setTargeting("sg", _auds);
    // .setTargeting("ctnkeyword", keyword || "");

    googletag.pubads().setPublisherProvidedId(ppid);
    // commenting this for testing effect of single req on first 3 calls
    // if (!window.isMobile) {
    googletag.pubads().enableSingleRequest();
    // }
    // if (process.env.SITE === "tml") {
    //   googletag.pubads().disableInitialLoad();
    // }
    googletag.enableServices();
    // PWT is disabled for now JEERA LAN-11681
    if (process.env.SITE) {
      slots.forEach(function (slot) {
        googletag.cmd.push(function () {
          if (document.getElementById("".concat(slot.getSlotElementId()))) {
            googletag.display(slot);
          }
        });
      });
    } else {
      // OpenWrap code START here
      if (typeof PWT !== "undefined" && typeof PWT.requestBids === "function") {
        PWT.requestBids(PWT.generateConfForGPT(slots), function (adUnitsArray) {
          PWT.addKeyValuePairsToGPTSlots(adUnitsArray);
          googletag.pubads().refresh(slots);
        });
      } else {
        var FAILSAFE_TIMEOUT = 2000;
        setTimeout(function () {
          console.log("----FAILSAFE_TIMEOUT Prerender");
          googletag.pubads().refresh(slots);
        }, FAILSAFE_TIMEOUT); // calling this function with forcefully so that GPT API is always executed
      }

      console.log("----Prerender Bidding Done");
    }
  });

  // FIXME: Commenting this as someone entered three ways of googletag.display
  // if (Array.isArray(preRenderElemArray) && preRenderElemArray.length > 0) {
  //   preRenderElemArray.forEach((elem, i) => {
  //     const adScript = ` var _elem_${i} = preRenderElemArray[${i}];
  //                 googletag.cmd.push(function() {
  //                   if (_elem_${i}) {
  //                     googletag.display(_elem_${i}.getAttribute('id'));
  //                   }
  //                 });`;
  //     const tmpScript = document.createElement("script");
  //     tmpScript.type = "text/javascript";
  //     tmpScript.innerHTML = adScript;
  //     elem.append(tmpScript);
  //   });
  // }
  // // googletag.cmd.push(() => {
  // if (Array.isArray(slotsInfo) && slotsInfo.length > 1) {
  //   slotsInfo.forEach(element => {
  //     googletag.cmd.push(() => {
  //       googletag.display(element.elem);
  //     });
  //   });
  // }
  // });
}
      preRenderElemArray = [];
      var elemPrender = Array.prototype.slice.call(document.querySelectorAll('.prerender'));
      elemPrender.forEach(function(elem , i) {
        if(elem && elem.innerHTML == ''){
            if (elem.getAttribute("data-adtype") == "atf") {
              var newElement = document.getElementById("general-atf-wrapper")
              if (newElement) {
                window.observeAtfSizeChange = true;
                observeResizeChange(newElement);
              } else{
                window.observeAtfSizeChange = false;
              }
            }
            preRenderElemArray.push(elem);                
        }else{
          console.log('.atf not found')
        } 
      })
      renderDfpAds(elemPrender, channelCode, keyword, blacklist, pwaPagetype , puvkey);
    }
    preRenderAds();

    window.channelCode = '';
    function observeResizeChange(elem) {
      var resizeObserver = new ResizeObserver(resizedEntry => {
        try {
          let resizedHeight = Math.max(resizedEntry[0].contentRect.height - 50, 0)
          resizedHeight = Math.ceil(resizedHeight);
          if (resizedHeight % 2 !== 0) {
            resizedHeight += 1;
          }
          transformElementsByPixel(resizedHeight);
        } catch (e) {
          console.log(e);
        }
      });
      resizeObserver.observe(elem);
      // The following code is to just ensure that if the div is loaded with height already greater 
      // than 50px before resize observer is initialized, it will take care of it
      // It will run only once while the observer is initialized
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const bounds = entry.boundingClientRect;
          if (bounds.height > 50) {
            
            let resizedHeight = Math.max(bounds.height - 50, 0);
            
              resizedHeight = Math.ceil(resizedHeight);
              if (resizedHeight % 2 !== 0) {
                resizedHeight += 1;
              }
              transformElementsByPixel(resizedHeight);
          }
        }
        observer.disconnect();
      });
      observer.observe(elem);
    }

    function transformElementsByPixel(height) {
      if (document.getElementById("childrenContainer")) {
        document.getElementById("childrenContainer").style.transform = 'translateY('+ height +'px)';
      }
      if (document.getElementById("trending-minitv")) {
        document.getElementById("trending-minitv").style.transform = 'translateY('+ height +'px)';
      }
      if (document.getElementById("electionwidget")) {
        document.getElementById("electionwidget").style.transform = 'translateY('+ height +'px)';
      }
      if (document.getElementById("civic_electionwidget")) {
        document.getElementById("civic_electionwidget").style.transform = 'translateY('+ height +'px)';
      }
      if (document.getElementById("footer-wrapper")) {
        document.getElementById("footer-wrapper").style.transform = 'translateY('+ height +'px)';
      }
      let footerPadding = 80 + height;
      if (document.getElementById("mobileFooter")) {
        document.getElementById("mobileFooter").style.paddingBottom = footerPadding + 'px';
      }
    }
    
    
    window.dfp_over_ctn = true;
    var createDfpAd = (dfpslot, dfpSlotSize, colombiadcontainerid, key, bidvalue, ctnCallBack = true) => {
        googletag.cmd.push(function() {
        var target_slot = googletag.defineSlot(dfpslot, dfpSlotSize, colombiadcontainerid).addService(googletag.pubads());
        
        // this ecpm value would be dynamically set by CTN depending on the highest bid
        if(key){
          target_slot.setTargeting(key, bidvalue);
        }
        // LAN-10465 : lazy loading 0ff
        // googletag.pubads().enableLazyLoad({
        //   fetchMarginPercent: 500, // Fetch slots within 2.5 viewports. Prev vlaue was 250
        //   renderMarginPercent: 300, // Render slots within 1.25 viewports. Prev vlaue was 125
        //   mobileScaling: 2.0, // Double the above values on mobile.
        // });
        googletag.enableServices();
    
        googletag.pubads().addEventListener('slotRenderEnded', function(event) {
          if (event.slot == target_slot) {
            console.log('NISV dfp event rendered for element - ', colombiadcontainerid); 
            if (event.isEmpty) {
              console.log("NISV DFP Unfilled impression", colombiadcontainerid);
              googletag.destroySlots([target_slot]);
              if(!ctnCallBack && document.getElementById(colombiadcontainerid)){
                //  document.getElementById(colombiadcontainerid).remove();
                
                  window.createNativeISVPlayer(colombiadcontainerid);
                
              }
              if(ctnCallBack) publishToCtn('fail',colombiadcontainerid);
            }else{
              if(!ctnCallBack) document.getElementById(colombiadcontainerid).style.display = "";
              if(ctnCallBack) publishToCtn('success',colombiadcontainerid);
            }
          }
        });
      });
      googletag.cmd.push(function() { googletag.display(colombiadcontainerid); });
    }
    var publishToCtn = function(flag,containerid){
      document.getElementById(containerid).parentElement.style.display = "";
      colombia && colombia.setdfpstatus(flag, containerid);
    }
    var updateDFPBidValue  = function(bidvalue, dfpslot, colombiadcontainerid, key){
      var dfpSlotSize = JSON.stringify([300, 250]);
      if(document.getElementById(colombiadcontainerid) && document.getElementById(colombiadcontainerid).getAttribute("data-dfpsize")){
        dfpSlotSize = document.getElementById(colombiadcontainerid).getAttribute("data-dfpsize");
      }
      createDfpAd(dfpslot, JSON.parse(dfpSlotSize), colombiadcontainerid, key, bidvalue);
    }
  
    
  function KaiAds(item) {
    var getAdsType = item.getAttribute("data-adtype");
  //  console.log("getAdsType",getAdsType);
    if (
      getAdsType == "atf" ||
      getAdsType == "fbn" ||
      getAdsType == "mrec" ||
      getAdsType == "mrec1" ||
      getAdsType == "mrec2" ||
      getAdsType == "btf"
    ) {
      item.style.display = "block";
      getKaiAd({
        publisher: "2c6106a0-3630-4b26-9f3e-23807a5824e9", // Created by id: arpit.puri@timesinternet.in
        app: "nbt",
        slot: "" + getAdsType,
        container: item,  
        h: "100",
        w: "320",
        timeout: 10000,
        onerror: (err) => console.log("Kai Ads error code:", err),
        onready: (ad) => {
          // Ad is ready to be displayed
          // calling 'display' will display the ad
          ad.call("display", {
            tabindex: 0,
            navClass: "items",
            display: "block",
          });
        },
      });
    }
  }
  
  function loadKaiAds() {
    if (
      document.readyState === "complete" ||
      document.readyState === "loaded" ||
      document.readyState === "interactive"
    ) {
      var getallAdscontainer = document.querySelectorAll(".ad1");
      var i = 0;
      for (i == 0; i < getallAdscontainer.length; i++) {
        KaiAds(getallAdscontainer[i]);
      }
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    if (navigator.userAgent.toLowerCase().indexOf('kaios') > -1) {    
      var _script = document.createElement("script");
      _script.defer = true;
      _script.src = "https://static.kaiads.com/ads-sdk/ads-sdk.v5.min.js";
      _script.defer = "defer";
  
      if (_script.readyState) {
        _script.onreadystatechange = function () {
          if (
            _script.readyState === "loaded" ||
            _script.readyState === "complete"
          ) {
            _script.onreadystatechange = null;
            loadKaiAds();
          }
        };
      } else {
        _script.onload = function () {
          loadKaiAds();
        };
      }
      document.getElementsByTagName("head")[0].appendChild(_script);
   }
  }); 
  
  
  window.playerCounter = 0;
  var currentPlayerInst1;
  window.playerConfigArr = [];
  window.nativeISVData = null;
  window.inst={};

  function isVDOAIEnabled() {
    return process.env.SITE === "nbt";
  };

  function initializeVDOAI() {
    if (window) {
      const vdoAIUrl = "//a.vdo.ai/core/navbharattimes-indiatimes/vdo.ai.js";
      const scriptElement = document.createElement("script");
      // ai.defer = true;
      scriptElement.async = true;
      scriptElement.src = window.location.protocol + vdoAIUrl;
      document.head.appendChild(scriptElement);
    }
  };
  
  // Called when CTN OSV fails
  function ctnCallbackHandler(status, colombiadcontainerid, itemType) {
      console.log("NISV ctn callback", status, colombiadcontainerid, itemType);
      const container = document.getElementById(colombiadcontainerid);
      if (itemType != '4' && container) {
          if(container.getAttribute("data-pos") && container.getAttribute("data-pos") !== "1"){
            container.parentElement.classList.remove("ad-wrapper-250");
          }else{
            const msid = container.getAttribute("data-msid");
            // Fallback VDO AI
            if(isVDOAIEnabled()){
              const vdoContainer = document.querySelector(".colombiaFail");
              if(vdoContainer) {
                console.log("VDO AI initiated");
                vdoContainer.parentElement.innerHTML = '<div id="vdo_ai_div"></div>';
                initializeVDOAI();
              }
            } else {
              sessionStorage.setItem("disableCtnOsv", "123");
              console.log("NISV 1x1 initiated", colombiadcontainerid);
              container.parentElement.classList.remove("ad-wrapper-250");
              container.removeAttribute("data-plugin")
              createDfpAd("/7176/NBT_MWeb/NBT_MOBILE_WEB_ROS/NBT_Mweb_Outstream_1x1", [1, 1], colombiadcontainerid, "", "", false);
            }
          }
      }
  }
  const divRefs = [];

const options = {
  root: null,
  threshold: 0.00001,
};

const myCallback = entries => {
  if(!window.videoPlayerDiv) window.videoPlayerDiv = document.getElementById("dock-video-player");
  entries.forEach(entry => {
    const instanceId = entry.target.id.replace("parent_", "");
    if (
      window.inst && window.inst[instanceId] &&
      // !isYoutubeVideo(entry.target.firstElementChild.id) &&
      // checkParentOfPlayerSameAsEntry(entry.target) &&
      !window.adPlaying &&
      !isAlreadyClosed(entry.target)
    ) {
      if (entry.intersectionRatio > options.threshold) {
        undockVideo();
      } else {
        // remove unnecessary player divs if present
        const childEntities = entry.target.getElementsByClassName("default-player");
        if (childEntities && childEntities.length > 1) {
          for (let i = 0; i < childEntities.length; i++) {
            if (!childEntities[i].hasChildNodes()) {
              childEntities[i].remove();
            }
          }
        }
        const child = entry.target.getElementsByClassName("default-player")[0];
        if (child && child.hasChildNodes()) {
          dockVideo(child);
          imageStyleChanger(entry.target, "block");
        }
      }
    }
  });
};

isYoutubeVideo = (id) => {
  let isYoutube = false;
  // FIXME: Changed method to determine video type as per slike
  if (window.inst[id].store.playerType.includes("yt")) {
    isYoutube = true;
  }
  return isYoutube;
};

isAlreadyClosed = parent => {
  const isClosed = parent.getAttribute("data-closed");
  return isClosed === "true";
};

checkParentOfPlayerSameAsEntry = parent => {
  const parentName = parent.getAttribute("id");
  // FIXME: Changed actualplayer div as per slike
  // const actualPlayer = window.currentPlayerInst.playerDiv;
  const id = parent.firstElementChild.id;
  const actualPlayer = window.inst[id].ui.controlLayer;
  const player = actualPlayer.closest(".default-player");
  const parentPlayerName = player ? player.getAttribute("data-parent") : "";
  return parentName === parentPlayerName;
};

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(myCallback, options);
  }

  showDockContainer = () => {
    showDockPortal();
    showButtons();
  };

  showDockPortal = () => {
    document.getElementById("dock-root-container").classList.remove("hide");
  };

  hideDockPortal = () => {
    document.getElementById("dock-root-container").classList.add("hide");
  };

  showButtons = () => {
    const buttons = window.videoPlayerDiv.getElementsByTagName("button");
    if (buttons && buttons.length) {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("hide");
      }
    }
  };

  hideButtons = () => {
    const buttons = window.videoPlayerDiv.getElementsByTagName("button");
    if (buttons && buttons.length) {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add("hide");
      }
    }
  };

  undockVideo = fromButton => {
    hideDockPortal();
    hideButtons();
    const playerDiv = window.videoPlayerDiv.getElementsByClassName("default-player")[0];
    if (playerDiv) {
      const targetDivName = playerDiv.getAttribute("data-parent");
      const navBar = document.getElementsByClassName(true ? "nav_scroll" : "first-level-menu");
      const navBarHeight = navBar[0] && navBar[0].offsetHeight;
      const targetDiv = document.getElementById(targetDivName);
      if (targetDiv) {
        imageStyleChanger(targetDiv, "none");
        targetDiv.appendChild(playerDiv);
      }
      if (window && window.inst && window.inst[playerDiv.id]) {
        // Add resizing with mini timeout to prevent docking issue
        setTimeout(() => window.inst[playerDiv.id].bpl.adjustDisplayWindow(), 500);
      }
    }
    
  };

  imageStyleChanger = (parentElement, style) => {
    const imageContainer = parentElement.getElementsByClassName("image-container")[0];
    if (imageContainer) {
      imageContainer.style.display = style;
    }
  };

  dockVideo = (childRef, fromButton) => {
    closeVideo();
    if (childRef) {
      window.videoPlayerDiv.appendChild(childRef);
      showDockContainer();
      if (window && window.inst && window.inst[childRef.id]) {
        // Add resizing with mini timeout to prevent docking issue
        setTimeout(() => window.inst[childRef.id].bpl.adjustDisplayWindow(), 500);
      }
    }
    
  };
  // This function is for docked video which tries to:
  // * Pause the video (if clicked from button and then put back in original place ) Preserving video state
  // * If user is on a different page where the video cannot be put back into original place,  just  remove parent div of video.
  closeVideo = clickedFromButton => {
    const parentDiv = window.videoPlayerDiv.getElementsByClassName("default-player")[0];
    if (parentDiv) {
      const targetDivName = parentDiv.getAttribute("data-parent");
      const targetDiv = document.getElementById(targetDivName);
      if (targetDiv) {
        targetDiv.appendChild(parentDiv);
        if (clickedFromButton) {
          targetDiv.setAttribute("data-closed", "true");
        }
        const imageContainer = targetDiv.querySelector(".image-container");
        if (imageContainer) {
          imageContainer.style.display = "none";
        }
      } else {
        // This is the case where we are on a different page and target div doesn't exist anymore ( to dock back to)
        // The following function removes the associated divs safely
        removeAllSlikePlayerInitializations();
        parentDiv.remove();
      }
    }

    // Calling this here ensures video_played event gets fired correctly
    // As it checks whether current video was pip or not based on docked video container class
    // These functions change that class
    hideDockPortal();
    hideButtons();

    if (clickedFromButton) {
      if (window.currentPlayerInst) {
        console.log("NISV player paused 1");
        window.currentPlayerInst.pause();
      }
      // AnalyticsGA.event({
      //   category: "PIP Close",
      //   action: "Button",
      //   label: window.videoUrl || "",
      // });
    }
    if (window && window.currentPlayerInst) {
      // Add resizing with mini timeout to prevent docking issue
      setTimeout(() => window.currentPlayerInst.bpl.adjustDisplayWindow(), 500);
    }
  };

  implementAutoDock = divRef => {
    if (divRefs.indexOf(divRef.parentElement) === -1) {
      if (divRef && divRef.parentElement) {
        divRefs.push(divRef.parentElement);
        divRefs.forEach(div => {
          observer.observe(div);
        });
      }
    }
  };

  removeEntryFromObserverList = divRef => {
    if (divRefs.indexOf(divRef) > -1) {
      observer.unobserve(divRef);
      divRefs.splice(divRefs.indexOf(divRef), 1);
    }
  };
/**
 * 
 * @param {Native OSV player code} coocolombiadcontaineridkie 
 * @returns 
 */
 async function createVidgyorOSVPlayer(colombiadcontainerid) {
    console.log("NISV, Vidgyor player started", colombiadcontainerid);
    
    let originContainer = document.querySelector('#' + colombiadcontainerid);
    const nativeOsvPlayerContainer = document.createElement("div");
    const childContainer = document.createElement("div");
    originContainer.parentElement.style.display = 'block';
    const iframeContainer = document.createElement("iframe");
    originContainer.replaceWith(nativeOsvPlayerContainer);
    const _setContainerID = (container ,value) => {
      container.id = value;
    }
    
    const _setContainerClass = (container , value) => {
      container.setAttribute("class" , value);
    }
    
    const _setContainerDisplay = (container,value) => {
      container.style.display = value;
    }
    const _setContainerHeight = (container , value) => {
      container.style.height = value;
    }
    const _setContainerWidth = (container , value) => {
      container.style.width = value;
    }
    
    const _setContainerPosition = (container , value) => {
      container.style.position = value;
    }
    
    const _setContainerMargin = (container , value) => {
      container.style.margin = value;
    }
    const _setContainerAmpAttr = (container , value) => {
      container.setAttribute("data-exclude", value);
    }
    
    const _setContainerPaddingBottom = (container , value) => {
      container.style.paddingBottom = value;
    }
    
    const _setContainerStyles = (container , styles) => {
      styles.height && _setContainerHeight(container,styles.height);
      styles.width && _setContainerWidth(container,styles.width);
      styles.display && _setContainerDisplay(container,styles.display);
      styles.margin && _setContainerMargin(container,styles.margin);
      styles.position && _setContainerPosition(container,styles.position);
      styles.paddingBottom && _setContainerPaddingBottom(container,styles.paddingBottom);
    } 

    const containerData = {
      id : "vidgyorPlayerOSV",
      class : "vgrPlayerContainer vd_pl",
      styles : {
        height : "auto",
        width : "100%",
        margin : "20px auto 10px auto",
        display : "block",
        position : false,
        paddingBottom : false,
      },

      attributes : {
        exclude : "amp",
      }
    };
    
    _setContainerID(nativeOsvPlayerContainer , containerData.id);
    _setContainerClass(nativeOsvPlayerContainer, containerData.class);
    _setContainerStyles(nativeOsvPlayerContainer, containerData.styles);
    _setContainerAmpAttr(nativeOsvPlayerContainer, containerData.attributes.exclude);

    const childContainerData = {
      id : "closeButtonContainerOSV",
      class : "osv-child-class",
      styles : {
        height : false,
        width : "100%",
        margin : false,
        display : false,
        position : "relative",
        paddingBottom : "56.25%",
      },
      attributes : {
        exclude : "amp",
      }
    };

    _setContainerID(childContainer, childContainerData.id);
    // _setContainerClass(childContainer, childContainerData.class);
    _setContainerStyles(childContainer, childContainerData.styles);

    const iframesrc = "https://static.vidgyor.com/player/account/times/html/navbharattimes.html?playerDivId=vidgyorPlayerOSV&pip=0&piv=1&preload=1&preloadOffset=500";
    
    const _setIframeStyles = conatiner => {
      conatiner.style.position = "absolute";
      conatiner.style.top = "0";
      conatiner.style.left = "0";
      conatiner.style.width = "100%";
      conatiner.style.border = "0";
      conatiner.style.height = "100%";
    };
    
    iframeContainer.src = iframesrc;
    iframeContainer.frameBorder = "0";
    iframeContainer.allow = "autoplay";
    iframeContainer.allowFullScreen = "";
    iframeContainer.scrolling = "no";
    iframeContainer.title = "vidgyor";
    _setIframeStyles(iframeContainer);

    childContainer.appendChild(iframeContainer);
    nativeOsvPlayerContainer.appendChild(childContainer);
   
    if ("MutationObserver" in window) {
      const _updateHeight = () => {
        const innerheight = (window.innerWidth * 9) /16 ;
        nativeOsvPlayerContainer.style.height = innerheight;
      };
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutationRecord => {
          _updateHeight();
        });
      });
      observer.observe(nativeOsvPlayerContainer, { attributes: true, attributeFilter: ["style"] });
      window.onresize = _updateHeight;
      _updateHeight();
    }
    return;
  }
  
  window.isIMALoaded = false;
  async function createNativeISVPlayer(colombiadcontainerid) {
    if(!isIMALoaded){
    const ctnjs = document.createElement("script");
        ctnjs.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
        ctnjs.defer = true;
        document.head.appendChild(ctnjs);
        window.isIMALoaded = true;
    }
    console.log("NISV, Native ISV ad creation started", colombiadcontainerid)
      const contEl = "native_isv_cont" + window.playerCounter;
      const sp2 = document.createElement(document.querySelector('#' + colombiadcontainerid).tagName);
      
      document.querySelector('#' + colombiadcontainerid).parentElement.replaceWith(sp2);
      sp2.style.display = "block";
     
      sp2.id = "parent_"+contEl;
      if (window.nativeISVData) {
          const {
              video
          } = window.nativeISVData;
          let pagetype = "home";

          // console.log("NISV required data nativeISVData, playerCounter", window.nativeISVData, playerCounter);
          if(!window.nativeISVData['parentMsid_' + window.playerCounter]){
            window.playerCounter+=1;
          }
          let parentMsid = window.nativeISVData['parentMsid_' + window.playerCounter];
          let videoData = {};
          if (video) {
              videoData = video;
              sp2.setAttribute("class", "news-card horizontal col news midthumb native_isv_cont default-outer-player");
          } else {
            pagetype = "articleshow";
              sp2.setAttribute("class", "native_isv_cont default-outer-player");
              // if (sp2.parentElement) sp2.parentElement.setAttribute("class", ""); // commented be ashish for ui issue in next article
              if (parentMsid) {
                const apiUrl = "https://nbtfeed.indiatimes.com/langapi/listing.cms?msid=" + parentMsid + "&type=video&relatedvideo=1";
                await fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        videoData = data.items;
                        // console.log('NISV API Success:');
                    })
                    .catch((error) => {
                        console.error('NISV API Error:', error);
                    });
              }
          }
          // if(videoData[0].eid.includes("YT-") > -1){
          //   document.querySelector('#' + contEl).remove();
          //   console.log("NISV player removed because of youtube video");
          //   return;
          // }
          const vidImageCont = document.createElement("div");
          vidImageCont.style.display = "none"
          vidImageCont.setAttribute("class", "image-container");
          const vidImage = document.createElement("img");
          vidImage.src = Array.isArray(videoData) && videoData.length > 0 && getImageSrc(videoData[0].imageid,videoData[0].imgsize || "" , "true") || "";
          vidImage.style.height = "100%";
          vidImageCont.appendChild(vidImage);
          sp2.appendChild(vidImageCont);
          const playerCont = document.createElement("div");
          playerCont.setAttribute("class", "default-player");
          sp2.appendChild(playerCont);
          playerCont.setAttribute("data-parent", "parent_"+contEl);
          playerCont.setAttribute("id", contEl);
          let playListUrl = "https://mtpwafeeds.indiatimes.com/feeds/"+"/feeds/videpostroll_v5_slike/4901865.cms?feedtype=json&callback=cached"
          if(parentMsid){
            playListUrl = "https://mtpwafeeds.indiatimes.com/feeds/"+"videpostroll_v5_slike/"+String(parentMsid)+".cms?feedtype=json&callback=cached"
          }
          const fpc = _getCookie("_col_uuid");
          const slikeConfig = {
              "apiKey": "nbtmwebtoi54",//"test403web5a8sg6o9ug"
              "colombiaCookieId": fpc,
              "GDPR_MODE": false,
              "env": "",
              "controls": {},
              "version": "",
              "live": {
                  "loadDVR": false
              },
              "player": {
                  "section": pagetype,
                  "adSection": "default",
                  "skipAd": false,
                  "midOverlayState": 1,
                  "slikeAdPercent": 0,
                  "playlist": true,
                  "playlistUrl": playListUrl,
                  "mute": true,
                  "autoPlay": false,
                  "pauseOnHide": true,
                  "pagetpl": pagetype + "_isv",
                  "scrollBehaviour": {
                      "inViewPercent": 100,
                      // "dock": true,
                      "autoPlay": true,
                      "autoPause": true,
                  },
                  // "portOut":"dock",
                  // "portIn":"undock",
                  // "dockPosition":"bottom-right",
                  "playInBackground": false,
              },
              "video": {},
              "subsecmsid2": parentMsid,
              "noBeacon": false,
              "sdkBase": "//tvid.in/sdk"
          };
          slikeConfig.video = {...videoData[0]};
          slikeConfig.video.id = slikeConfig.video.eid; //"1x5vpib99u";
          slikeConfig.video.title = slikeConfig.video.hl;
          slikeConfig.video.preRollUrl = "https://pubads.g.doubleclick.net/gampad/ads?iu=/7176/NBT_MWeb/NBT_Mweb_Videoshow/NBT_Mweb_Videoshow_ISV&description_url=https%3A%2F%2Fnavbharattimes.indiatimes.com%2F&tfcd=0&npa=0&sz=300x230%7C300x400%7C320x25%7C300x415%7C360x480%7C359x200%7C400x315&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=";
          slikeConfig.contEl = contEl;
          window.playerCounter += 1;
          // console.log("slikeConfig", slikeConfig);
  
          function retry() {
              var retryInterval = 100;
              if (window.isSlikePlayerInit && window.isSlikePlayerLoaded) {
                  callback(true, slikeConfig);
              } else {
                  if (window.spl != "undefined" && typeof window.spl.load == "function" && !window.isSlikePlayerInit) {
                      console.log("NISV calling spl load", slikeConfig.contEl);
                      window.spl.load(slikeConfig, callback);
                  } else {
                      console.log("NISV Retrying.....");
                      setTimeout(function() {
                          retry();
                      }, retryInterval);
                  }
              }
  
          }
          retry();
      }
  
      function callback(status, slikeConfig) {
        // JIRA: LAN-14320
        if(slikeConfig.player && window.slikeAlaskaConfig && window.slikeAlaskaConfig._preRollAdFillerStatus && config.player.adSection !== "justbaat" && process.env.PLUS === "false"
        ) {
          slikeConfig.player.preRollAdFiller = {
            enable: window.slikeAlaskaConfig._preRollAdFillerStatus && slikeConfig.player.adSection !== "justbaat",
            time: window.slikeAlaskaConfig._preRollAdFillerDelay,
          };
        }
        // JIRA: LAN-14332
        if (
          slikeConfig.player &&
          window.slikeAlaskaConfig &&
          window.slikeAlaskaConfig._deferredPrerollDelay &&
          !(config.player.preRollAdFiller && config.player.preRollAdFiller.enable) &&
          slikeConfig.player.adSection !== "justbaat" && process.env.PLUS === "false"

        ) {
          slikeConfig.player.deferredPreroll = window.slikeAlaskaConfig._deferredPrerollDelay;
        }
        if(!window.inst) window.inst = {};
          window.inst[slikeConfig.contEl] = new window.SlikePlayer(slikeConfig);
          console.log("NISV Slike callback", slikeConfig.contEl);
          
          if (window.SlikePlayer.AdEvents) {
              const adErrorEvent = window.SlikePlayer.AdEvents['AD_ERROR'];
              window.inst[slikeConfig.contEl].on(adErrorEvent, (eventName, eventData) => {
                window.adPlaying = true;
                if(document.querySelector('#parent_' + slikeConfig.contEl)){
                  const container = document.querySelector('#parent_' + slikeConfig.contEl);
                  if (container) {
                    container.innerHTML = "";
                    container.classList.add("ad1")
                    container.classList.add("ad_native");
                    console.log("NISV closed", slikeConfig.contEl);
                  }
                  //createDfpAd("/7176/NBT_MWeb/NBT_MOBILE_WEB_ROS/NBT_Mweb_Outstream_1x1", [1, 1], 'parent_' + slikeConfig.contEl, "", "", false);
                }
                if(document.querySelector("#dock-video-player #"+slikeConfig.contEl+".default-player")){
                  document.querySelector("#dock-video-player #"+slikeConfig.contEl+".default-player").remove();
                }
                if (window.inst[slikeConfig.contEl]) {
                    window.inst[slikeConfig.contEl].destroy();
                    window.inst[slikeConfig.contEl] = null;
                }
              });
              const adStartedEvent = window.SlikePlayer.AdEvents['STARTED'];
              window.inst[slikeConfig.contEl].on(adStartedEvent, (eventName, eventData) => {
                window.adPlaying = true;
                if(window.inst[slikeConfig.contEl].mute){
                  window.inst[slikeConfig.contEl].mute();
                }
                implementAutoDock(document.querySelector('#' + slikeConfig.contEl));
                  document.querySelector('#parent_' + slikeConfig.contEl).style.display = "";
                  console.log("NISV ad started", slikeConfig.contEl);
                  if (window.currentPlayerInst) {
                      if (window.currentPlayerInst.getVideoState().paused == false) {
                          window.inst[slikeConfig.contEl].destroy();
                          window.inst[slikeConfig.contEl] = null;
                          if (document.querySelector('#parent_' + slikeConfig.contEl)) {
                            document.querySelector('#parent_' + slikeConfig.contEl).remove();
                          }
                      }
                  }
              });
              window.inst[slikeConfig.contEl].on("splAdComplete", (eventName, eventData) => {
                window.adPlaying = false;
              });
          }
      }
  }
  function getImageSrc(msid, size, isMobile){   
    if(typeof msid === "undefined") return "";
    let width = "width=680&height=380&resizemode=75";
    if(isMobile){
      width = "width=540&height=300&resizemode=75";
    }
    return "https://static.langimg.com/thumb/" + msid + "/" + msid + ".jpg?" + width + "&imgsize-" + size + ""
  }
  
