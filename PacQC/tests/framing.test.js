import { FRAMING, sourceFrame } from '../js/sprite-framing.js';
import { images, drawSprite } from '../js/assets.js';
export function runFramingTests() {
  const results = [];
  const assert = value => { if (!value) throw new Error('Cadrage incorrect'); };
  const test = (name, fn) => { try { fn(); results.push({name,passed:true}); } catch(error) { results.push({name,passed:false,error:error.message}); } };
  test('Cadrages : 30 sources dans les limites des PNG', () => {
    assert(Object.keys(FRAMING).length === 30);
    for (const [id,f] of Object.entries(FRAMING)) {
      const [x,y,w,h] = sourceFrame(id,f.width,f.height);
      assert(x>=0 && y>=0 && w>0 && h>0 && x+w<=f.width+1e-7 && y+h<=f.height+1e-7);
    }
  });
  test('Cadrages : poses stables et repli si dimensions modifiées', () => {
    for (const id of ['bonus1','bonus2']) for (const suffix of ['_d','_g'])
      assert(JSON.stringify(FRAMING[id].box) === JSON.stringify(FRAMING[id+suffix].box));
    assert(JSON.stringify(sourceFrame('face1',100,80)) === '[0,0,100,80]');
  });
  test('Rendu : proportions, échelle et décalage conservés', () => {
    const id='face1', f=FRAMING[id], previous=images.get(id);
    try {
      images.set(id,{naturalWidth:f.width,naturalHeight:f.height});
      let args;
      drawSprite({drawImage(...values){args=values;}},id,100,100,36,{[id]:{scale:1.2,offsetX:4,offsetY:-2}});
      const [,sx,sy,sw,sh,x,y,w,h]=args;
      assert(args.length===9 && Math.abs(w/h-sw/sh)<1e-10);
      assert(Math.abs(Math.max(w,h)-43.2)<1e-10);
      assert(Math.abs(x+w/2-102.25)<1e-10 && Math.abs(y+h/2-98.875)<1e-10);
    } finally { if(previous)images.set(id,previous); else images.delete(id); }
  });
  return results;
}
