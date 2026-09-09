/** Inline GA bootstrap: init stub + config first, then load gtag.js (order-safe for static export). */
export function getGtagInlineScript(measurementId: string): string {
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}',location.search.indexOf('ga_debug=1')>-1?{debug_mode:true,send_page_view:true}:{send_page_view:true});(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${measurementId}';document.head.appendChild(s);})();`;
}
