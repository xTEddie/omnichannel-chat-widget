import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { DimLayer } from "../dimlayer/DimLayer";
import useChatSDKStore from "../../hooks/useChatSDKStore";
import useChatContextStore from "../../hooks/useChatContextStore";
import { ILiveChatWidgetContext } from "../../contexts/common/ILiveChatWidgetContext";
import { ILiveChatWidgetAction } from "../../contexts/common/ILiveChatWidgetAction";
import { LiveChatWidgetActionType } from "../../contexts/common/LiveChatWidgetActionType";
import LiveChatContext from "@microsoft/omnichannel-chat-sdk/lib/core/LiveChatContext";

export const DeviceTransferQrPaneStateful = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, dispatch]: [ILiveChatWidgetContext, Dispatch<ILiveChatWidgetAction>] = useChatContextStore();
    const chatSDK: any = useChatSDKStore(); // eslint-disable-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [deviceTransferQr, setDeviceTransferQr] = useState<any>(undefined); // eslint-disable-line @typescript-eslint/no-explicit-any

    useEffect(() => {
        console.log("[DeviceTransferQrPaneStateful]");
        const encodeData = (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            const stringifiedData = JSON.stringify(data);
            const encodedData = (window as any).btoa(stringifiedData); // eslint-disable-line @typescript-eslint/no-explicit-any
            return encodedData;
        };

        const createAlternativeData = (liveChatContext: LiveChatContext) => {
            const alternativeData: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
            alternativeData.requestId = (liveChatContext as LiveChatContext).requestId;
            alternativeData.chatId = (liveChatContext as LiveChatContext).chatToken.chatId;
            alternativeData.reconnectId = (liveChatContext as LiveChatContext).reconnectId || undefined;
            return alternativeData;
        };

        const createQrUrl = (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            const url = new URL(window.location.href);
            url.searchParams.append("devicetransferdata", data);
            const qrURL = url.href;
            return qrURL;
        };

        const readBlobAsDataURL = (blob: Blob) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    resolve(reader.result);
                };
            });
        };

        const retrieveQrCode = async (qrData: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
            const response = await fetch(qrApiUrl);
            const blobResponse = await response.blob();
            const blobUrl = await readBlobAsDataURL(blobResponse);
            return blobUrl;
        };

        const init = async () => {
            const liveChatContext = await chatSDK?.getCurrentLiveChatContext();
            let encodedData = encodeData(liveChatContext);

            const useAlternativeData = true;
            const encodedDataThreshold = 2000; // QRCode fails to be generated when chars length > ~2k
            if (useAlternativeData || encodedData.length > encodedDataThreshold) {
                const alternativeData = createAlternativeData(liveChatContext as LiveChatContext);
                encodedData = encodeData(alternativeData);
            }

            const qrURL = createQrUrl(encodedData);
            console.log(qrURL);

            const blobUrl = await retrieveQrCode(qrURL);
            console.log(blobUrl);

            setDeviceTransferQr(blobUrl);
        };

        init();
    }, []);

    const onClose = useCallback(() => {
        console.log("[onClose]");
        dispatch({type: LiveChatWidgetActionType.SET_SHOW_DEVICE_TRANSFER_QR_PANE, payload: false});
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paneStyle: any = {
        zIndex: 9999,
        position: "absolute",
        display: "flex",
        flexDirection: "column"
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actionBarStyle: any = {
        padding: "10px 0"
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const closeButtonStyle: any ={
        width: "100%"
    };


    return (
        <>
            <DimLayer brightness={"0.2"} />
            <div style={paneStyle}>
                <img src={deviceTransferQr} alt="Device Transfer QR Code"/>
                <div style={actionBarStyle}>
                    <button onClick={onClose} style={closeButtonStyle}> Close </button>
                </div>
            </div>
        </>
    );
};

export default DeviceTransferQrPaneStateful;