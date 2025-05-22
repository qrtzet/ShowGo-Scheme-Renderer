/**
 * Определяет платформу пользователя (Android, iOS или другую).
 * Работает как в браузере, так и в WebView.
 * @returns {'android' | 'ios' | 'other'}
 */
export const detectPlatform = (): 'android' | 'ios' | 'other' => {
  const userAgent = navigator.userAgent || '';

  const isAndroid = /Android/i.test(userAgent);

  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  return isAndroid ? 'android' : isIOS ? 'ios' : 'other';
}