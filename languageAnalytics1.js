try {
    (function(g, r, o, w, t, h, rx) {
        (g[t] =
            g[t] ||
            function() {
                (g[t].q = g[t].q || []).push(arguments);
            }),
        (g[t].l = 1 * new Date());
        (g[t] = g[t] || {}), (h = r.createElement(o)), (rx = r.getElementsByTagName(o)[0]);
        h.async = !1;
        h.src = w;
        rx.parentNode.insertBefore(h, rx);
    })(window, document, "script", "https://static.growthrx.in/js/v2/web-sdk.js", "grx");
    const version = window?.buildVersion;
    const pagetype = window?.pageType;
    const {
        analyticsConfig,
        projectId,
        platform
    } = window?.analyticsConfig || {};
    console.log("GrowthRx is working");
    grx('config', 'applicationServerKey', 'BDp8pYlqIqwIZw0JLBj91Phfr4w0tNxcmtYtcpVxYinzQIWcTkxHAoDj_GYhxgG_zEluRkkcQrC7sOpyZWAoJ3k'); //We need to use the same key as izooto currently uses
    grx('config', 'service_worker', '/service-worker.js?v=' + version)
    grx('config', 'notification_params', {
        utm_source: "GrowthRx",
        utm_medium: "push_notifications"
    });
    grx("init", projectId);
    if (window.location.pathname && (!window.location.pathname.includes('videoshow') || window?.isLitePage)) {
        var _grxLandingPageEventDetails = {
            url: window.location.pathname,
            screen_type: pagetype,
            location: window.geoinfo ? window.geoinfo.city : "blank",
        }
        var _bandwidthAccordingSpeed = function bandwidthAccordingSpeed(speed, rtt) {
            /**
             * Speed in Mbps
             * ---------------------
             * below 0.28 -> 2G
             * 0.28 - 0.4 -> SLOW-3G
             * 0.4 - 1.6 -> 3G
             * above 1.6 -> FAST-3G
             */

            var bandwidth = "";
            if (Number(speed) && Number(rtt)) {
                if (speed <= 0.28 && rtt > 800) {
                    bandwidth = "2G";
                } else if (speed > 0.28 && speed <= 0.4 && rtt <= 800 && rtt > 400) {
                    bandwidth = "SLOW-3G";
                } else if (speed > 0.4 && speed <= 1.6 && rtt <= 400 && rtt > 150) {
                    bandwidth = "3G";
                } else if (speed > 1.6 && rtt <= 150) {
                    bandwidth = "FAST-3G";
                } else if (speed <= 0.28) {
                    bandwidth = "2G";
                } else if (speed > 0.28 && speed <= 0.4) {
                    bandwidth = "SLOW-3G";
                } else if (speed > 0.4 && speed <= 1.6) {
                    bandwidth = "3G";
                } else if (speed > 1.6) {
                    bandwidth = "FAST-3G";
                }
            }
            return bandwidth;
        }
        if (window.navigator && window.navigator.connection) {
            if (window.navigator.connection.downlink) {
                _grxLandingPageEventDetails.network_browser_speed = window.navigator.connection.downlink;
                _grxLandingPageEventDetails.network_browser_effective_type = _bandwidthAccordingSpeed(window.navigator.connection.downlink, window.navigator.connection.rtt);
            }
        }
        if (pagetype == "videoshow" || pagetype == "articleshow" || pagetype == "moviereview" || pagetype == "photoshow") {
            // Split pathname to get location and msid of article
            // Eg ["/metro/mumbai/other-news/bmc-has-started-preparatiâ€¦izens-extra-bed-in-hospitals-during-corona-crisis", "81757096.cms"]
            const [pageLocation, _] = window.location.pathname.split('/' + pagetype + '/');

            // Remove seolocation by splitting against last "/"
            // Eg "/metro/mumbai/other-news"
            const pageSections = pageLocation.slice(0, pageLocation.lastIndexOf("/"));

            // Split levels again and only keep truthy values (non empty strings)
            //  Eg ["", "metro", "mumbai", "other-news"] -> ["metro", "mumbai", "other-news"]
            const pageSectionLevels = pageSections.split("/").filter(level => level);

            // Set all these section levels dynamically for grx calls
            pageSectionLevels.forEach((level, index) => {
                _grxLandingPageEventDetails[`section_l${index + 1}`] = level;
            });
        }
        if (typeof Notification === "function" && Notification.permission) {
            _grxLandingPageEventDetails.status = platform + "_" + Notification.permission;
        }
        var userCity = window.localStorage.getItem("selectedCityName");
        if (userCity && userCity !== "undefined") {
            _grxLandingPageEventDetails.exact_location = userCity;
        }
        grx("track", "page_view", _grxLandingPageEventDetails);
    }
} catch (err) {
    console.log("Error in GrowthRx", err);
}

//----------------------------------------------------------------------------------------------------//

try {
    function getReferrer() {
        return document.referrer == "" ? "direct" : document.referrer.indexOf("facebook") != -1 ?
            "facebook" :
            document.referrer.indexOf("google") != -1 ?
            "google" :
            document.referrer.indexOf("twitter") != -1 ?
            "twitter" :
            document.referrer.indexOf("whatsapp") != -1 ?
            "whatsapp" :
            document.referrer && document.referrer.length > 0 ?
            "others" : "unknown";
    }
    const {
        photoFeature,
        isPrime,
        editorName,
        asVideoType,
        agencyName,
        gtmId
    } = window?.analyticsConfig || {};

    console.log("GA is working");
    (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            if (photoFeature === "photoFeature") {
                w[l].push({
                    'event': 'tvc_photofeature_article',
                    'photofeature_article': "Yes"
                });
            }
            // Custom dimension for personalization_eligible LAN-10980
            if (true)
                var isForyouuser = w && w.localStorage && w.localStorage.getItem("isForyouuser");
            if (isForyouuser === "true" && true && pagetype === "videoshow") {
                "w[l].push({'personalization_eligible':'personalised-user'})";
            }

        const pagetype = window?.pageType;
            if (pagetype === "articleshow" || pagetype === "photoshow" || pagetype === "moviereview" || (window?.isLitePage) && pagetype === "videoshow") {
            var eventData = {
                'event': 'authorNamePushed',
                'authorName': editorName,
                'video_type': asVideoType,
                'agency_name': agencyName
            };

            if (isForyouuser === "true" && enableForYouPage()) {
                eventData['personalization_eligible'] = 'personalised-user';
            }

            w[l].push(eventData);
        } else if (pagetype !== "videoshow") {
            if (isForyouuser === "true" && enableForYouPage()) {
                w[l].push({
                    'event': 'pageview',
                    'personalization_eligible': 'personalised-user'
                });
            }
        }

        if (isPrime && (pagetype === "articleshow" || pagetype === "videoshow")) {
            w[l].push({
                'event': 'authorNamePushed',
                'articleType': "non-plus-" + pagetype,
                'article_referral': getReferrer()
            });
        };


        w[l].push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });
        var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = false; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', gtmId);
}
catch (err) {
    console.log("Error in GTM", err);
}

//----------------------------------------------------------------------------------------------------//

try {
    (function() {
        console.log("Comscore and Ibeat is working");

        function checkGDPRRegion() {
            const arrGDPRContinents = ["EU"];
            let bool = false;
            if (arrGDPRContinents.indexOf(window.geoinfo.Continent) > -1) {
                bool = true;
            } else if (window.geoinfo.CountryCode === "US" && window.geoinfo.region_code === "CA") {
                bool = true;
            }
            window.geoinfo.isGDPRRegion = bool;
        }
        var requestUrl = window && window.landing_page;
        if (!getCookie("geo_data")) {
            const geoapi = document.createElement("script");
            geoapi.src = "https://geoapi.indiatimes.com/?cb=1";
            geoapi.defer = true;
            document.head.appendChild(geoapi);

            geoapi.onload = () => {
                checkGDPRRegion();

                var csucfr = "";
                var isGDPRRegion = window.geoinfo && window.geoinfo.isGDPRRegion || false;
                const pthname = window?.location?.pathname || "/";
                // console.log("geoinfo-------------",window.geoinfo,isGDPRRegion);
                if (getCookie("ckns_policyV2") && isGDPRRegion) {
                    csucfr = "&cs_ucfr=1";
                }
                if (self.COMSCORE && self.COMSCORE.beacon && objComScore) {
                    COMSCORE.beacon(objComScore);
                } else {
                    document.getElementById("comscoreContainer").innerHTML = '<img src=https://sb.scorecardresearch.com/p?c1=2&c2=6036484&c4=' + pthname + '&c7=' + pthname + '&c9=' + csucfr + ' />'
                };
                if (window && window.geoinfo) {
                    if (!window.geoinfo.isGDPRRegion) {


                        let scriptLoad;
                        let pagetype = window.pageType;
                        let ibeatVal =
                            pagetype == "articleshow" || pagetype == "moviereview" ?
                            1 :
                            pagetype == "videoshow" ?
                            2 :
                            pagetype == "photoshow" ?
                            3 :
                            pagetype == "home" ||
                            pagetype == "articlelist" ||
                            pagetype == "photolist" ||
                            pagetype == "videolist" ||
                            pagetype == "tech" ?
                            20 :
                            "";
                        window._ibeat_track = {
                            ct: ibeatVal,
                        }
                        scriptLoad = document.createElement("script");
                        scriptLoad.defer = true;
                        scriptLoad.src = ('development' != "production" ? "https://agi-static.indiatimes.com/cms-common/stg/stg-ibeat.min.js" : "https://agi-static.indiatimes.com/cms-common/ibeat.min.js")
                        document.getElementById("comscoreContainer").before(scriptLoad);
                    }
                }
                setCookie("geo_data", JSON.stringify(window.geoinfo), 1, "/");
            }
        } else {
            window.geoinfo = getCookie("geo_data") && JSON.parse(getCookie("geo_data"));

            var csucfr = "";
            var isGDPRRegion = window.geoinfo && window.geoinfo.isGDPRRegion || false;
            const pthname = window?.location?.pathname || "/";
            // console.log("geoinfo-------------",window.geoinfo,isGDPRRegion);
            if (getCookie("ckns_policyV2") && isGDPRRegion) {
                csucfr = "&cs_ucfr=1";
            }
            if (self.COMSCORE && self.COMSCORE.beacon && objComScore) {
                COMSCORE.beacon(objComScore);
            } else {
                document.getElementById("comscoreContainer").innerHTML = '<img src=https://sb.scorecardresearch.com/p?c1=2&c2=6036484&c4=' + pthname + '&c7=' + pthname + '&c9=' + csucfr + ' />'
            };
            if (window.geoinfo && !window.geoinfo.isGDPRRegion) {


                let scriptLoad;
                let pagetype = window.pageType;
                let ibeatVal =
                    pagetype == "articleshow" || pagetype == "moviereview" ?
                    1 :
                    pagetype == "videoshow" ?
                    2 :
                    pagetype == "photoshow" ?
                    3 :
                    pagetype == "home" ||
                    pagetype == "articlelist" ||
                    pagetype == "photolist" ||
                    pagetype == "videolist" ||
                    pagetype == "tech" ?
                    20 :
                    "";
                window._ibeat_track = {
                    ct: ibeatVal,
                }
                scriptLoad = document.createElement("script");
                scriptLoad.defer = true;
                scriptLoad.src = ('development' != "production" ? "https://agi-static.indiatimes.com/cms-common/stg/stg-ibeat.min.js" : "https://agi-static.indiatimes.com/cms-common/ibeat.min.js")
                document.getElementById("comscoreContainer").before(scriptLoad)

            }
        }
    })();
} catch (err) {
    console.log("Error in Comscoe Ibeat", err);
}
---------------------------------------------------------------------------------------------------------------
try {
  function fireComscore() {
    console.log("fireComscore is working");
    const isGDPRRegion = (window.geoinfo && window.geoinfo.isGDPRRegion) || false;
    let csucfr = "";
    const pthname = window?.location?.pathname || "/";
    if (window?.getCookie("ckns_policyV2") && isGDPRRegion) {
      csucfr = "&cs_ucfr=1";
    }
    const scorecardResearchURL = `https://sb.scorecardresearch.com/p?c1=2&c2=6036484&c4=${pthname}&c7=${pthname}&c9=${csucfr}`;
    fetch(scorecardResearchURL)
      .then(response => {
        if (response.ok) {
          console.log("Scorecard Research URL fetched successfully");
        } else {
          console.log("Failed to fetch Scorecard Research URL");
        }
      })
      .catch(error => {
        console.log("Error fetching Scorecard Research URL:", error);
      });
  }
} catch (err) {
  console.log("Error fireComscore:", err);
}
