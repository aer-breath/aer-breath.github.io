// Client hints also identify Android when Chrome's desktop-site UA omits it.
export function detectedDevice(nav=globalThis.navigator){
 if(/android/i.test(nav?.userAgentData?.platform||'')||/Android/i.test(nav?.userAgent||''))return'android';
 if(/iPhone|iPad|iPod/i.test(nav?.userAgent||'')||nav?.platform==='MacIntel'&&nav.maxTouchPoints>1)return'ios';
 return'desktop';
}
