import {FromNativeActionName, FromNativeActions} from '@type/message.types';
import EventEmitter from 'events';
import {useEffect} from 'react';

export const RNEvents = new EventEmitter();

export const registerRNHandler = <ActionName extends FromNativeActionName>(
  action: ActionName,
  callback: (payload: FromNativeActions[ActionName]) => void,
) => {
  RNEvents.on(action, callback);
  return () => RNEvents.off(action, callback);
};

export const useRNHandler = <ActionName extends FromNativeActionName>(
  action: ActionName,
  callback: (payload: FromNativeActions[ActionName]) => void,
) => {
  useEffect(() => {
    const deregister = registerRNHandler(action, callback);
    return () => {
      deregister();
    };
  }, [action, callback]);
};

export const onMessageFromRN = (message: string) => {
  const {action, payload} = JSON.parse(message);
  RNEvents.emit(action, payload);
};
