const DOM = (() => {
    const elements = {
        inputName: document.querySelector("#name"),
        inputCreator: document.querySelector("#creator"),
        inputVersion: document.querySelector("#currentVersion"),
        btnSubmit: document.querySelector("#btnSubmit"),
        radioVersion: document.getElementsByName("version"),
        radioNetwork: document.getElementsByName("network"),
    };
    return elements;
})();

const radioValuetoBoolean = () => {
    /**
     * NEW
     * how to get value of radio button in JavaScript
     * radio buttons are associated together via the name attribute
     * so, above in the DOM iife, radioVersion is a collection of radio buttons that share the name version
     */
    const versionValue = Array.from(DOM.radioVersion).find((currentValue) => currentValue.checked).value;
    const networkValue = Array.from(DOM.radioNetwork).find((currentValue) => currentValue.checked).value;
    return {
        version: versionValue === "yes" ? true : false,
        network: networkValue === "yes" ? true : false,
    };
};

DOM.btnSubmit.addEventListener("click", () => {
    const pluginData = {
        name: DOM.inputName.value,
        creator: DOM.inputCreator.value,
        currentVersion: DOM.inputVersion.value,
        latestVersion: radioValuetoBoolean().version,
        isNetworkActive: radioValuetoBoolean().network,
    };
    console.log(pluginData);
});
