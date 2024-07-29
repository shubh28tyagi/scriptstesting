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
AdsGenerator.prototype.addPageLevelTargetingHB = function(attributes) {
    if(typeof attributes == "object" && Object.keys(attributes).length>0){
    window.Times.adsKeys = targetingObj;
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
AdsGenerator.prototype.createAd = function() {
    this.enableServices();
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
    const { adsData, secName , targeting, targetingHB, adswithHB} = config ;
    if(adsData){
       const newAdsData = wapAdsGenerator(adsData, secName);
       config.adsData = newAdsData;
    }
    const adsMap = new Map();
    adsMap.set("initialAd", initializeAd);
    config.adsMap = adsMap;
    this.setConfig(config);
    if(targeting){
     initializeAd.addPageLevelTargeting(config.targeting);
    }
    if(targetingHB){
    initializeAd.addPageLevelTargetingHB(config.targetingHB);
    if (!window.adsMapDFP) {
        window.adsMapDFP = {};
      }
    }
    if (config && config.enableLazyLoad && !adswithHB) {
        initializeAd.lazyLoadAds();
    }
}

/**
 * @returns Function to update Config
 */
AdsHelper.prototype.updateConfig = function(newConfig) {
    const config = this.getConfig();
    const initializeAd = config?.adsMap.get("initialAd");
    const addTargeting = newConfig.addTargeting;

    if(!addTargeting){
        initializeAd.clearPageLevelTargeting();
    }
    if(newConfig?.targeting){
        initializeAd.addPageLevelTargeting(newConfig.targeting);
    }
    if (newConfig?.enableLazyLoad) {
        initializeAd.lazyLoadAds();
    }
    const { secName } = newConfig ;
    if(secName){
      const  oldSecname = config.secName;
      const newAdsData = wapAdsGenerator(config.adsData, secName, oldSecname);
      newConfig.adsData = newAdsData;
    }
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
AdsHelper.prototype.displayAds = function(adElemsInfo) {
    // let allAdElems = document.getElementsByClassName("prerender");
    let config = this.getConfig();
    const { enableSRA, adsData, adsMap } = config || {};
    let _SRAAdSlots = [];

    if(Array.isArray(adElemsInfo) && adElemsInfo.length>0){
        for(let i in adElemsInfo){
            const adInfo = adElemsInfo[i];
            const { adPath, divId, size } = adInfo || {};
            if(adPath && divId && size){
                if(adsMap && adsMap.has(divId)){
                    const adObj = adsMap.get(divId);
                    adObj.destroySlot();
                }

                const adSlot = new AdsGenerator(adPath, JSON.parse(size), divId);
                config.adsMap.set(divId, adSlot);

                if (!enableSRA) {
                  adSlot.createAd();
                } else {
                  _SRAAdSlots.push(adSlot);
                }
            }
        }

        if (enableSRA && _SRAAdSlots.length > 0) {
           _SRAAdSlots[0].displaySlotSRA(_SRAAdSlots);
        }
    }
}

/**
 * @returns Function to create Ads based on prerender class
 */
AdsHelper.prototype.displayAdsHB = function(adElemsInfo) {
    const adsDataArr = [];

    if(Array.isArray(adElemsInfo) && adElemsInfo.length>0){
        for(let i in adElemsInfo){
            const adInfo = adElemsInfo[i];
            const { adPath, divId, size , mstype} = adInfo || {};
            if(adPath && divId && size){
              if(window.adsMapDFP && window.adsMapDFP.divId){
                if (window._dfpObj && typeof window._dfpObj.destroySlots == "function" && divId) {
                     window._dfpObj.destroySlots(divId);
                }                
              }
             const adDataHB = {
                adCode: adPath,
                divId: divId,
                name: mstype,
                size: size,
             }

              window.adsMapDFP[divId] = mstype;

             if (typeof window.displayAllAdsInArray == "function") {
                window.displayAllAdsInArray([adDataHB]);
              }
            }
        }
    }
}

/**
 * @returns Function to destroy Ad Slots
 */
AdsHelper.prototype.destroyAdSlots = function(divInfo){
    if(Array.isArray(divInfo) && divInfo.length>0){
        let config = this.getConfig();
        for(let i in divInfo){
            const { adsMap } = config; 
            const adSlot = adsMap.get(divInfo[i]);
          if(adSlot){
            adSlot.destroySlot();
            adsMap.delete(divInfo[i]);
          }
        }
    }
}

/**
 * @returns Function to destroy Ad Slots
 */
AdsHelper.prototype.destroyAdSlotsHB = function(divId){
    if (window._dfpObj && typeof window._dfpObj.destroySlots == "function" && divId) {
        window._dfpObj.destroySlots(divId);
      }
}
