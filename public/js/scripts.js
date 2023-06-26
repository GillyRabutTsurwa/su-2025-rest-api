const DOM = (() => {
    const elements = {
        inputPluginName: document.querySelector("#pluginName"),
        inputPluginCreator: document.querySelector("#pluginCreator"),
        inputPluginVersion: document.querySelector("#pluginCurrentVersion"),
        btnSubmitPlugin: document.querySelector("#btnSubmitPlugin"),
        radioPluginVersion: document.getElementsByName("pluginVersion"),
        radioPluginNetwork: document.getElementsByName("pluginNetwork"),
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
    const versionValue = Array.from(DOM.radioPluginVersion).find((currentValue) => currentValue.checked).value;
    const networkValue = Array.from(DOM.radioPluginNetwork).find((currentValue) => currentValue.checked).value;
    return {
        version: versionValue === "yes" ? true : false,
        network: networkValue === "yes" ? true : false,
    };
};

DOM.btnSubmitPlugin.addEventListener("click", async () => {
    const pluginData = {
        name: DOM.inputPluginName.value,
        creator: DOM.inputPluginCreator.value,
        currentVersion: DOM.inputPluginVersion.value,
        latestVersion: radioValuetoBoolean().version,
        isNetworkActive: radioValuetoBoolean().network,
    };
    // console.log(pluginData);

    try {
        const response = await fetch("/plugins", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pluginData),
        });

        if (response.ok) {
            console.log("Data sent to server");
        } else {
            const errorData = await response.json();
            throw errorData;
        }
    } catch (e) {
        console.error(e.error);
    } finally {
        DOM.inputPluginName.value = "";
    }
});
