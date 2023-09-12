import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { DimLayer } from "../dimlayer/DimLayer";
import useChatSDKStore from "../../hooks/useChatSDKStore";
import useChatContextStore from "../../hooks/useChatContextStore";
import { ILiveChatWidgetContext } from "../../contexts/common/ILiveChatWidgetContext";
import { ILiveChatWidgetAction } from "../../contexts/common/ILiveChatWidgetAction";
import { LiveChatWidgetActionType } from "../../contexts/common/LiveChatWidgetActionType";

export const DeviceTransferQrPaneStateful = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, dispatch]: [ILiveChatWidgetContext, Dispatch<ILiveChatWidgetAction>] = useChatContextStore();
    const chatSDK: any = useChatSDKStore(); // eslint-disable-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [deviceTransferQr, setDeviceTransferQr] = useState<any>(undefined); // eslint-disable-line @typescript-eslint/no-explicit-any

    useEffect(() => {
        console.log("[DeviceTransferQrPaneStateful]");
        const readBlobAsDataURL = (blob: Blob) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    resolve(reader.result);
                };
            });
        };

        const init = async () => {
            const liveChatContext = await chatSDK?.getCurrentLiveChatContext();
            const data = JSON.stringify(liveChatContext);
            const encodedData = (window as any).btoa(data); // eslint-disable-line @typescript-eslint/no-explicit-any
            const originURL = window.location.href;
            const qrURL = `${originURL}?livechatcontext=${encodedData}`;
            console.log(qrURL);

            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrURL}`;
            const response = await fetch(qrApiUrl);
            const blobResponse = await response.blob();
            const blobUrl = await readBlobAsDataURL(blobResponse);
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

    return (
        <>
            <DimLayer brightness={"0.2"} />
            <div style={paneStyle}>
                <img src={deviceTransferQr} alt="Device Transfer QR Code"/>
                <button onClick={onClose}> Close </button>
            </div>
        </>
    );
};

export default DeviceTransferQrPaneStateful;