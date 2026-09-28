// Les chemins sont relatifs à ce module, donc compatibles avec un sous-dossier.
const sprite = (file) => ({ file, url: new URL(`../assets/${file}`, import.meta.url).href,
  display: { scale: 1, offsetX: 0, offsetY: 0 } });

export const sprites = {
  droite1: sprite('droite1.png'), droite2: sprite('droite2.png'),
  gauche1: sprite('gauche1.png'), gauche2: sprite('gauche2.png'),
  face1: sprite('face1.png'), face2: sprite('face2.png'), dos: sprite('dos.png'),
  ennemi1_b: sprite('ennemi1_b.png'), ennemi1_d: sprite('ennemi1_d.png'),
  ennemi1_g: sprite('ennemi1_g.png'), ennemi1_h: sprite('ennemi1_h.png'),
  ennemi2_b: sprite('ennemi2_b.png'), ennemi2_d: sprite('ennemi2_d.png'),
  ennemi2_g: sprite('ennemi2_g.png'), ennemi2_h: sprite('ennemi2_h.png'),
  ennemi3_b: sprite('ennemi3_b.png'), ennemi3_d: sprite('ennemi3_d.png'),
  ennemi3_g: sprite('ennemi3_g.png'), ennemi3_h: sprite('ennemi3_h.png'),
  ennemi4_b: sprite('ennemi4_b.png'), ennemi4_d: sprite('ennemi4_d.png'),
  ennemi4_g: sprite('ennemi4_g.png'), ennemi4_h: sprite('ennemi4_h.png'),
  collectible: sprite('collectible.png'),
  bonus1: sprite('bonus1.png'), bonus1_d: sprite('bonus1_d.png'), bonus1_g: sprite('bonus1_g.png'),
  bonus2: sprite('bonus2.png'), bonus2_d: sprite('bonus2_d.png'), bonus2_g: sprite('bonus2_g.png'),
};

export const directions = { droite: 'Droite', bas: 'Bas', gauche: 'Gauche', haut: 'Haut' };
export const actors = [
  { id: 'joueur', label: 'Le collègue', category: 'Personnage', note: '2 poses par direction · dos fixe',
    directions: { droite: ['droite1', 'droite2'], bas: ['face1', 'face2'], gauche: ['gauche1', 'gauche2'], haut: ['dos'] } },
  { id: 'csi', label: 'CSI', category: 'Fantôme rouge', note: '4 directions · aucune animation',
    directions: { bas: ['ennemi1_b'], droite: ['ennemi1_d'], gauche: ['ennemi1_g'], haut: ['ennemi1_h'] } },
  { id: 'pcq', label: 'PCQ', category: 'Fantôme bleu', note: '4 directions · aucune animation',
    directions: { bas: ['ennemi2_b'], droite: ['ennemi2_d'], gauche: ['ennemi2_g'], haut: ['ennemi2_h'] } },
  { id: 'sagir', label: 'SAGIR', category: 'Fantôme violet', note: '4 directions · aucune animation',
    directions: { bas: ['ennemi3_b'], droite: ['ennemi3_d'], gauche: ['ennemi3_g'], haut: ['ennemi3_h'] } },
  { id: 'teams', label: 'Teams', category: 'Fantôme vert', note: '4 directions · aucune animation',
    directions: { bas: ['ennemi4_b'], droite: ['ennemi4_d'], gauche: ['ennemi4_g'], haut: ['ennemi4_h'] } },
  { id: 'point', label: 'Point', category: 'Collectible', note: 'Image fixe · taille de référence 18 px', frames: ['collectible'] },
  { id: 'biere', label: 'Bière', category: 'Bonus 01', note: 'Centre → droite → centre → gauche', frames: ['bonus1', 'bonus1_d', 'bonus1', 'bonus1_g'] },
  { id: 'cafe', label: 'Café', category: 'Bonus 02', note: 'Centre → droite → centre → gauche', frames: ['bonus2', 'bonus2_d', 'bonus2', 'bonus2_g'] },
];
