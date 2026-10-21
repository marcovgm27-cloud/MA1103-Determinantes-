/* Tiempo activo local: nunca se infiere actividad a partir del reloj de pared. */
window.DeterminantesActivity = (() => {
  'use strict';
  const MINIMUM_MS=60*60*1000, IDLE_MS=45000;
  class StudyClock {
    constructor(record,now=()=>performance.now()) {
      this.record=record;this.now=now;this.lastTick=now();this.lastAction=null;
      if(!Number.isFinite(record.activeMs)||record.activeMs<0)record.activeMs=0;
      if(!Number.isInteger(record.actions)||record.actions<0)record.actions=0;
    }
    tick({visible,focused,eligible}) {
      const now=this.now(),elapsed=now-this.lastTick;
      if(visible&&focused&&eligible&&this.lastAction!==null&&elapsed>0&&elapsed<=2500) {
        const start=Math.max(this.lastTick,this.lastAction),end=Math.min(now,this.lastAction+IDLE_MS);
        if(end>start)this.record.activeMs+=end-start;
      }
      this.lastTick=now;return this.record.activeMs;
    }
    action(context) {this.tick(context);if(context.visible&&context.focused&&context.eligible){this.lastAction=this.now();this.record.actions++;}}
  }
  const eligible=(state,stages)=>state.metrics.activeMs>=MINIMUM_MS&&state.metrics.actions>0&&stages.every((stage,n)=>stage.type!=='video'||state.videos[stage.video.id]?.confirmed===true);
  return {StudyClock,MINIMUM_MS,IDLE_MS,eligible};
})();
