(() => {
  'use strict';
  let html;
  try {
    html=window.opener?.DeterminantesPrintHTML;
    if(html)delete window.opener.DeterminantesPrintHTML;
  } catch { /* A direct visit has no current record. */ }
  if(typeof html!=='string')return;
  document.open();document.write(html);document.close();window.opener=null;
})();
