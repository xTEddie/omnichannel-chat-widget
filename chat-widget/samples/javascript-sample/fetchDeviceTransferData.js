const fetchDeviceTransferData = () => {
    let data = "";
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("devicetransferdata") !== null) {
        data = urlParams.get("devicetransferdata");
    }
    return data;
};

export default fetchDeviceTransferData;