import {FromWebActionName, FromWebActions} from '@type/message.types';

export const sendMessageToRN = <ActionName extends FromWebActionName>(
  action: ActionName,
  payload: FromWebActions[ActionName],
) => {
  //@ts-ignore
  if (window?.ReactNativeWebView) {
    //@ts-ignore
    window.ReactNativeWebView.postMessage(JSON.stringify({action, payload}));
  }
};
