import {Suspense} from 'react';
import {Provider} from 'jotai';

import {SchemeRenderer} from '@features/SchemeRenderer';
import {FullScreenLoader} from '@components/FullScreenLoader';
import {onMessageFromRN} from '@utils/message/RNMessageHandler';
import 'react-toastify/dist/ReactToastify.css';
import {Toaster} from "react-hot-toast";

// @ts-ignore
window.onMessageFromRN = onMessageFromRN;

export const App = () => {
  return (
    <Provider>
      <Suspense fallback={<FullScreenLoader text="Загружается схема..." />}>
        <SchemeRenderer />
        <Toaster position="bottom-center" toastOptions={{
          style: {
            marginBottom: '100px',
          },
        }} />
      </Suspense>
    </Provider>
  );
};
