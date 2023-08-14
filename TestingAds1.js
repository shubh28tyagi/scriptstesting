/**
 * AdsGenerartor function to create Ad object for Ads
 * @param {*} path path of the Ad
 * @param {*} size sizes for the Ad
 * @param {*} id Id of the Div in which Ad is to be displayed
 */
const AdsGenerator = function(path, size, id) {
    this.path = path;
    this.size = size;
    this.id = id;
    this.slot = function createSlot() {
        if (path && size && id) {
            window.googletag = window.googletag || {
                cmd: []
            };

            return googletag
                .defineSlot(path, size, id)
                .addService(googletag.pubads());
        }
    }();
};

/**
 * @returns Slot of the created Ad Object
 */
AdsGenerator.prototype.getSlot = function() {
    return this.slot;
};

/**
 * @returns Id of the div for Ad Object
 */
AdsGenerator.prototype.getId = function() {
    return this.id;
};

/**
 * @returns Enable services for the Ad Slot
 */
AdsGenerator.prototype.enableServices = function() {
    const slot = this.getSlot();

    if (slot) {
        googletag.cmd.push(function() {
            googletag.enableServices();
        });
    } else {
        console.log("Slot not found");
    }
};

/**
 * @returns Renders the Ad Slot in the Id present in Ad Object
 */
AdsGenerator.prototype.displaySlot = function() {
    const id = this.getId();
    if (id) {
        googletag.cmd.push(function() {
            googletag.display(id);
        });
    } else {
        console.log("Id not found");
    }
};

/**
 * @returns Attaches slot level targeting values to a Ad Slot
 */
AdsGenerator.prototype.addSlotLevelTargeting = function(slotAttributes) {
    const slot = this.getSlot();

    if (slot) {
        const keys = typeof slotAttributes == "object" ? Object.keys(slotAttributes) : [];
        if (keys.length > 0) {
            keys.forEach((key) => slot.setTargeting(key, slotAttributes[key]));
        }
    } else {
        console.log("Slot not found");
    }
};

/**
 * @returns Attaches Page level targeting values, this would attach to all the ads on the Page
 */
AdsGenerator.prototype.addPageLevelTargeting = function(pageAttributes) {   
    const keys = typeof pageAttributes == "object" ? Object.keys(pageAttributes) : [];
    window.googletag = window.googletag || {
        cmd: []
    };

    if (keys.length > 0) {
        keys.forEach((key) => googletag.pubads().setTargeting(key, pageAttributes[key]));
    }
};

/**
 * @returns Clears Page level targeting values
 */
AdsGenerator.prototype.clearPageLevelTargeting = function() {
    googletag.pubads().clearTargeting();
};

/**
 * @returns Clears Slot level targeting for an Ad object
 */
AdsGenerator.prototype.clearSlotLevelTargeting = function(attributes) {
    const slot = this.getSlot();
    if (slot) {
        if (Array.isArray(attributes)) {
            attributes.map((att) => {
                slot.clearTargeting(att);
            })
        }
    } else {
        console.log("Slot not found");
    }
};

/**
 * @returns Refreshes a AD slot 
 */
AdsGenerator.prototype.refreshSlot = function() {
    const slot = this.getSlot();
    if (slot) {
        googletag.pubads().refresh([slot]);
    } else {
        console.log("Slot not found");
    }
};

/**
 * @returns Function to display multiple Ads using SRA architechture
 */
AdsGenerator.prototype.displaySlotSRA = function(adElems) {
    if (Array.isArray(adElems) && adElems.length > 0) {
        googletag.cmd.push(function() {
            adElems.map((adElem, index) => {
                return adElem.getSlot();
            });
            // Enable SRA and services.
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
        });

        googletag.cmd.push(function() {
            googletag.display(adElems[0].getSlot());
        });
    }
};

/**
 * @returns Function to lazy load Ads on particular Page
 */
AdsGenerator.prototype.lazyLoadAds = function() {
    googletag.cmd.push(function() {

        googletag.pubads().enableLazyLoad({
            fetchMarginPercent: 100,
            renderMarginPercent: 100,
            mobileScaling: 2.0
        });
    });
};

/**
 * @returns Function to create Ad from an Ad Slot
 */
AdsGenerator.prototype.createAd = function(index) {
    this.enableServices();
    if (index == 1) {
        this.addSlotLevelTargeting({
            "color": "green",
            "test": "privacy"
        });
    }
    this.displaySlot();
};

/**
 * @returns Function to destroy an Ad Slot
 */
AdsGenerator.prototype.destroySlot = function() {
    const slot = this.getSlot();
    if (slot) {
        googletag.destroySlots([slot]);
    } else {
        console.log("Slot not found");
    }
};


//========================= Ads Helper Function for Custom Languages level handling =========================// 

/**
 * Ads Helper function to save Ads config and create Ads
 * @param {*} _config 
 */
const AdsHelper = function(_config) {
    this.config = _config;
}

/**
 * @returns Function to return Ads Config
 */
AdsHelper.prototype.getConfig = function() {
    return this.config;
}

/**
 * @returns Function to set new Ads Config
 */
AdsHelper.prototype.setConfig = function(_config){
    const newConfig = {...this.getConfig(), ..._config};
     this.config = newConfig;
}

/**
 * @returns Function to Initialize Ads config to be used for Ads Creation
 */
AdsHelper.prototype.initialize = function() {
    const initializeAd = new AdsGenerator();
    const config = this.getConfig();
    const { adsData, secName } = config ;
    const newAdsData = wapAdsGenerator(adsData, secName);
    config.adsData = newAdsData;
    const adsMap = new Map();
    adsMap.set("initialAd", initializeAd);
    config.adsMap = adsMap;
    this.setConfig(config);
    initializeAd.addPageLevelTargeting(config.targeting || {});
    if (config && config.enableLazyLoad) {
        initializeAd.lazyLoadAds();
    }
}

/**
 * @returns Function to update Config
 */
AdsHelper.prototype.updateConfig = function(newConfig) {
    const config = this.getConfig();
    const initializeAd = config?.adsMap.get("initialAd");

    if(newConfig?.targeting){
        initializeAd.clearPageLevelTargeting();
        initializeAd.addPageLevelTargeting(newConfig.targeting);
    }

    if (newConfig?.enableLazyLoad) {
        initializeAd.lazyLoadAds();
    }
    const { secName } = newConfig ;
    const  oldSecname = config.secName;
    const newAdsData = wapAdsGenerator(config.adsData, secName, oldSecname);

    newConfig.adsData = newAdsData;
    this.setConfig(newConfig);
}

/**
 * @returns Function to create Ad paths based on adsec
 */
const wapAdsGenerator = (adsData, newSecName, oldSecName = "others") => {
    if(adsData && newSecName && newSecName.toLowerCase() != "others"){
     let wapAdsData = JSON.stringify(adsData).toLowerCase();
     wapAdsData = wapAdsData.toLowerCase().replaceAll(`_${oldSecName}`, `_${newSecName.toLowerCase()}`);
     return JSON.parse(wapAdsData);
    }

    return adsData;
};

/**
 * @returns Function to create Ads based on prerender class
 */
AdsHelper.prototype.collectAllElems = function() {
    let allAdElems = document.getElementsByClassName("prerender");
    let config = this.getConfig();
    const { enableSRA, adsData, adsMap } = config || {};
    let _SRAAdSlots = [];

    const createDivId = (elem, adData) => {
        if(elem && adData){
            const id = adData?.id + Math.floor((Math.random() * 100) + 1);
            elem.setAttribute("id", id);
            return id;
        }
    }

    if (allAdElems.length > 0) {
        for (let i = 0; i < allAdElems.length; i++) {
            const adElem = allAdElems[i];

            const mstype = adElem.getAttribute("mstype");
            const specificAdData = adsData && adsData[mstype];

            const path = adElem.getAttribute("data-path") || specificAdData && specificAdData.name;
            const id = adElem.getAttribute("id") || createDivId(adElem, specificAdData);
            const size = JSON.parse(adElem.getAttribute("data-size")) || specificAdData && specificAdData.size;

            if(adsMap && adsMap.has(id)){
                const adObj = adsMap.get(id);
                adObj.destroySlot();
            }

            const adSlot = new AdsGenerator(path, size, id);
            config.adsMap.set(id, adSlot);

            if (!enableSRA) {
                adSlot.createAd(i);
            } else {
                _SRAAdSlots.push(adSlot);
                if (i == 0) {
                    firstSRAAdSlot = adSlot;
                }
            }
        }

        if (enableSRA) {
            firstSRAAdSlot.displaySlotSRA(_SRAAdSlots);
        }
    }
}

const adshelper = new AdsHelper({
    enableSRA: false,
    targeting: {
        "scn": "news",
        "subSCN": "cricket",
        "BL": "0"
    },
    enableLazyLoad: false,
    adsData : {
        atf: {
          id: "div-gpt-ad-9135510865388-0",
          name: "/7176/NBT_MWeb/NBT_MWeb_Others/NBT_Mweb_Others_ATF",
          size: [
            [300, 250],
            [320, 100],
            [320, 50],
            [336, 280],
            [250, 250],
            [300, 50],
          ],
        },
        fbn: {
          id: "div-gpt-ad-9135510865388-2",
          name: "/7176/NBT_MWeb/NBT_MWeb_Others/NBT_Mweb_Others_FBN",
          size: [
            [320, 50],
            [300, 50],
          ],
        },
        mrec1: {
          id: "div-gpt-ad-9135510865388-mrec1",
          name: "/7176/NBT_MWeb/NBT_MWeb_Others/NBT_Mweb_Others_MREC1",
          size: [
            [336, 280],
            [320, 250],
            [300, 250],
            [250, 250],
            [200, 200],
            [180, 150],
          ],
        },
        mrec2: {
          id: "div-gpt-ad-9135510865388-mrec2",
          name: "/7176/NBT_MWeb/NBT_MWeb_Others/NBT_Mweb_Others_MREC2",
          size: [
            [336, 280],
            [320, 250],
            [300, 250],
            [250, 250],
            [200, 200],
            [180, 150],
          ],
        },
        mrec3: {
          id: "div-gpt-ad-9135510865388-mrec3",
          name: "/7176/NBT_MWeb/NBT_MWeb_Others/NBT_Mweb_Others_MREC3",
          size: [
            [336, 280],
            [320, 250],
            [300, 250],
            [250, 250],
            [200, 200],
            [180, 150],
          ],
        },
        mrec4: {
          id: "div-gpt-ad-9135510865388-mrec4",
          name: "/7176/NBT_MWeb/NBT_MWeb_Others/NBT_Mweb_Others_MREC4",
          size: [
            [336, 280],
            [320, 250],
            [300, 250],
            [250, 250],
            [200, 200],
            [180, 150],
          ],
        },
        mrecinf: {
          id: "div-gpt-ad-9135510865388-mrecInf",
          name: "/7176/NBT_MWeb/NBT_MWeb_Others/NBT_Mweb_Others_MrecINF",
          size: [
            [336, 280],
            [320, 250],
            [300, 250],
            [250, 250],
            [200, 200],
            [180, 150],
          ],
        },
        slug: {
          id: "div-gpt-ad-9135510865388-slug",
          name: "/7176/NBT_MWeb/NBT_MWeb_Others/NBT_Mweb_Others_Slug1",
          size: [
            [300, 100],
            [320, 100],
          ],
        },
        parallax: {
          id: "div-gpt-ad-9135510865388-parallax",
          name: "/7176/NBT_Mweb/NBT_Mweb_Others/NBT_Mweb_Others_FC",
          size: [[300, 600]],
        },
        refreshnews: "/7176/NBT_MWeb/NBT_Mweb_News/NBT_Mweb_News",
      },
    secName: "homepage"
});

adshelper.initialize();
adshelper.collectAllElems();
