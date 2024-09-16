import {Suspense} from 'react';
import {Provider} from 'jotai';
import {ToastContainer} from 'react-toastify';

import {SchemeRenderer} from '@features/SchemeRenderer';
import {FullScreenLoader} from '@components/FullScreenLoader';
import {onMessageFromRN} from '@utils/message/RNMessageHandler';
import 'react-toastify/dist/ReactToastify.css';

// @ts-ignore
window.onMessageFromRN = onMessageFromRN;

export const App = () => {
  return (
    <Provider>
      <Suspense fallback={<FullScreenLoader text="Загружается схема..." />}>
        <ToastContainer />
        <SchemeRenderer />
      </Suspense>
    </Provider>
  );
};
