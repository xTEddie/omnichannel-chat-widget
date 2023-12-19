/* eslint-disable */

import React, { Dispatch, useReducer } from "react";
// import renderer from 'react-test-renderer';
import createAttachmentMiddleware from "./attachmentMiddleware";
import { ChatContextStore } from "../../../../../contexts/ChatContextStore";
import { getLiveChatWidgetContextInitialState } from "../../../../../contexts/common/LiveChatWidgetContextInitialState";
import { ILiveChatWidgetAction } from "../../../../../contexts/common/ILiveChatWidgetAction";
import { ILiveChatWidgetContext } from "../../../../../contexts/common/ILiveChatWidgetContext";
import { createReducer } from "../../../../../contexts/createReducer";

describe("attachmentMiddleware test", () => {
    xit ("foo", () => {
        // jest.mock("../../../../../contexts/ChatContextStore");
        // React.createContext = jest.fn();
        // React.useContext = jest.fn();

        const next = (args: any) => () => args; // eslint-disable-line @typescript-eslint/no-explicit-any
        const attachment = {
            name: "name",
            content: "content",
            type: "type"
        };

        const args = {
            channelData: {
                fileScan: [{status: "in progress"}]
            },
            activity: {
                attachments: [attachment]
            },
            attachment
        };

        console.log("[args]");
        console.log(args);
        const enableInlinePlaying = true;

        const SampleComponent = () => {
            console.log("SampleComponent");
            const results = createAttachmentMiddleware(enableInlinePlaying)()(next)(args);
            console.log(results);
            return null;
        };

        // const state = jest.fn();
        // const dispatch = jest.fn();
        const reducer = createReducer();
        const props: any = {
            chatSDK: jest.fn(),
            telemetryConfig: {
                chatWidgetVersion: "",
                chatComponentVersion: "",
                OCChatSDKVersion: ""
            }
        };
        const [state, dispatch]: [ILiveChatWidgetContext, Dispatch<ILiveChatWidgetAction>] = useReducer(reducer, getLiveChatWidgetContextInitialState(props));

        const Wrapper = () => {

        };

        // renderer.create(
        //     <ChatContextStore.Provider value={[state, dispatch]}>
        //         <SampleComponent />
        //     </ChatContextStore.Provider>
        // );

        expect(true).toBe(true);
    });
});