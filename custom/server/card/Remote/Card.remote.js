const StringUtil = require('zero-util/src/StringUtil');

module.exports = class CardRemote {

  /**
   * @param {import('zero-system/src/Collector/RemoteCollector')} collector 
   */
  static define(collector) {
    collector.add('card');
  }

  constructor() {
    this.icons = {

      GLEICH: {
        label: 'Gleich',
        description: 'Ein Wert muss gleich sein.',
        type: ['condition'],
        icon: [{ type: 'strong', value: '=' }],
      },
      UNGLEICH: {
        label: 'Ungleich',
        description: 'Ein Wert muss ungleich sein.',
        type: ['condition'],
        icon: [{ type: 'strong', value: '≠' }],
      },
      GERADE: {
        label: 'Gerade',
        description: 'Ein Wert muss gerade sein. (Durch 2 teilbar.)',
        type: ['condition'],
        icon: [{ type: 'strong', value: '◯' }],
      },
      LEGEND: {
        label: 'Legendäre Aktion',
        description: 'Eine Legendäre Aktion.',
        type: ['legend', 'aktion'],
        icon: [{ type: 'unicode', value: '🌟' }],
      },
      F: {
        label: 'Funktion',
        description: 'Eine Funktion als formel.',
        type: ['formal'],
        icon: [{ type: 'strong', value: 'ƒ' }],
      },
      '=>': {
        label: 'Funktionspfeil',
        description: 'Der Funktionspfeil für formeln.',
        type: ['formal'],
        icon: [{ type: 'strong', value: '⇒' }],
      },
      UNGERADE: {
        label: 'Ungerade',
        description: 'Ein Wert muss ungerade sein. (Durch 2 nicht teilbar.)',
        type: ['condition'],
        icon: [{ type: 'strong', value: '⌀', classes: ['odd'] }],
      },
      GES: {
        label: 'Geschicklichkeit',
        description: 'Der Geschicklichkeitswert des Charackters.',
        type: ['charackter', 'value', 'attribute'],
        icon: [{ type: 'fa', icon: ['fas', 'person-running'] }],
      },
      STR: {
        label: 'Stärke',
        description: 'Der Stärkewert des Charackters.',
        type: ['charackter', 'value', 'attribute'],
        icon: [{ type: 'fa', icon: ['fas', 'dumbbell'] }],
      },
      WEIS: {
        label: 'Weisheit',
        description: 'Der Weisheitwert des Charackters.',
        type: ['charackter', 'value', 'attribute'],
        icon: [{ type: 'fa', icon: ['fas', 'book-open'] }],
      },
      CHA: {
        label: 'Charisma',
        description: 'Der Charismawert des Charackters.',
        type: ['charackter', 'value', 'attribute'],
        icon: [{ type: 'fa', icon: ['fas', 'theater-masks'] }],
      },
      CON: {
        label: 'Konstitution',
        description: 'Der Konstitutionwert des Charackters.',
        type: ['charackter', 'value', 'attribute'],
        icon: [{ type: 'fa', icon: ['fas', 'lungs'] }],
      },
      NOACTIONS: {
        label: 'No Aktions',
        description: 'Der Konstitutionwert des Charackters.',
        type: ['charackter', 'value', 'attribute'],
        icon: [{ type: 'ra', icon: ['ra-cancel'] }],
      },
      BLUT: {
        label: 'Blut',
        description: 'Blut Magie Kosten / Erstellen.',
        type: ['blut', 'cost', 'create'],
        icon: [{ type: 'fa', icon: ['fas', 'tint'] }],
      },
      HALBIERE: {
        label: 'Halbiere',
        description: 'Halbiere einen Wert.',
        type: ['formel', 'value'],
        icon: [{ type: 'fa', icon: ['fas', 'divide'] }],
      },
      KI: {
        label: 'KI',
        description: 'KI Magie Kosten / Erstellen.',
        type: ['ki', 'cost', 'create'],
        icon: [{ type: 'fa', icon: ['fas', 'yin-yang'] }],
      },
      RIFT: {
        label: 'RIFT',
        description: 'RIFT Magie Kosten / Erstellen.',
        type: ['rift', 'cost', 'create'],
        icon: [{ type: 'ra', icon: ['ra-doubled'] }],
      },
      INIT: {
        label: 'INIT',
        description: 'Initiative',
        type: ['init'],
        icon: [{ type: 'fa', icon: ['fas', 'bolt'] }],
      },
      PERM: {
        label: 'Permanenter Bonus',
        description: 'Ein Bonus solange das equiped ist.',
        type: ['bonus'],
        icon: [{ type: 'fa', icon: ['fas', 'infinity'] }],
      },
      MAGIE: {
        label: 'Magie',
        description: 'Magie type Schaden.',
        type: ['type', 'schaden'],
        icon: [{ type: 'ra', icon: ['ra-level-four'] }],
      },
      POWER: {
        label: 'Power',
        description: 'Eine frei gewählte Energie.',
        type: ['type', 'schaden'],
        icon: [{ type: 'fa', icon: ['fas', 'certificate'] }],
      },
      WIEDER: {
        label: 'Wiederbenutzung',
        description: 'Diese Fähigkeit kannst du nochmal benutzen.',
        type: ['type', 'schaden'],
        icon: [{ type: 'fa', icon: ['fas', 'sync'] }],
      },
      SPLIT: {
        label: 'Teilen',
        description: 'Teile einen Würfel in 2.',
        type: ['würfel', 'teilen'],
        icon: [{ type: 'fa', icon: ['fas', 'sitemap'] }],
      },
      LEICHT: {
        label: 'Leichte Waffe',
        description: 'Du kannst 2 leichte Waffen tragen.',
        type: ['waffe'],
        icon: [{ type: 'fa', icon: ['fas', 'feather-alt'] }],
      },
      RK: {
        label: 'Rüstungsklasse',
        description: 'Der Rüstungsklassewert.',
        type: ['charackter', 'rüstung', 'value'],
        icon: [{ type: 'fa', icon: ['fas', 'shield'] }],
      },
      REAKTION: {
        label: 'Reaktion',
        description: 'Dies ist eine Reaktionfähigkeit.',
        type: ['reaktion'],
        icon: [{ type: 'fa', icon: ['fas', 'exchange'] }],
      },
      MAG: {
        label: 'Magie Modifier',
        description: 'Der Passende Magiemodifier.',
        type: ['charackter', 'value', 'attribute', 'dynamic'],
        icon: [{ type: 'fa', icon: ['fas', 'sun'] }],
      },
      WANKEN: {
        label: 'Wanken',
        description: 'Einheit im Wanken, wird umgestoßen wenn nochmal Schaden.',
        type: ['zustand', 'geschicklichkeit'],
        icon: [{ type: 'fa', icon: ['fas', 'person-falling'] }],
      },
      FEUER: {
        label: 'Feuer',
        description: 'Magische Kraft Feuer.',
        type: ['type', 'schade'],
        icon: [{ type: 'ra', icon: ['ra-burning-embers'] }],
      },
      FREI: {
        label: 'Freie Aktion',
        description: 'Eine Freie Aktion.',
        type: ['action', 'free'],
        icon: [{ type: 'fa', icon: ['fas', 'star-of-life'] }],
      },
      BONUS: {
        label: 'Bonus Aktion',
        description: 'Eine Bonus Aktion.',
        type: ['action', 'bonus'],
        icon: [{ type: 'fa', icon: ['fas', 'play'], classes: ['bonus'] }],
      },
      BRAUE: {
        label: 'Gebräu',
        description: 'Ein Gebräu.',
        type: ['brau', 'combo'],
        icon: [{ type: 'ra', icon: ['ra-fizzing-flask'] }],
      },
      SICHT: {
        label: 'Sichtweite',
        description: 'Die Sichtweite.',
        type: ['sicht'],
        icon: [{ type: 'fa', icon: ['fas', 'eye'] }],
      },
      SCHADEN: {
        label: 'Schaden',
        description: 'Der Schaden.',
        type: ['schaden'],
        icon: [{ type: 'fa', icon: ['fas', 'explosion'] }],
      },
      STABIL: {
        label: 'Stabil',
        description: 'Stabile Chemikalie.',
        type: ['chemikalie', 'type'],
        icon: [{ type: 'fa', icon: ['fas', 'cube'] }],
      },
      INSTABIL: {
        label: 'Instabil',
        description: 'Instabile Chemikalie.',
        type: ['chemikalie', 'type'],
        icon: [{ type: 'fa', icon: ['fas', 'radiation'] }],
      },
      REAKTIV: {
        label: 'Reaktive',
        description: 'Reaktive Chemikalie.',
        type: ['chemikalie', 'type'],
        icon: [{ type: 'ra', icon: ['ra-bottle-vapors'] }],
      },
      KATALYTISCH: {
        label: 'Katalytisch',
        description: 'Katalytisch Chemikalie.',
        type: ['chemikalie', 'type'],
        icon: [{ type: 'ra', icon: ['ra-regeneration'] }],
      },
      TOXIN: {
        label: 'Toxisch',
        description: 'Toxische Chemikalie.',
        type: ['chemikalie', 'type'],
        icon: [{ type: 'ra', icon: ['ra-poison-cloud'] }],
      },
      EIS: {
        label: 'Eis',
        description: 'Eis oder Frost Schaden.',
        type: ['schaden', 'damage', 'type'],
        icon: [{ type: 'ra', icon: ['ra-snowflake'] }],
      },
      HEILUNG: {
        label: 'Heilung',
        description: 'Heilung.',
        type: ['heal', 'heilung', 'schaden', 'damage'],
        icon: [{ type: 'ra', icon: ['ra-health'] }],
      },
      MISS: {
        label: 'Misserfolg',
        description: 'Ein Misserfolg einer Prüfung.',
        type: ['misserfolg', 'prüfung', 'challenge'],
        icon: [{ type: 'strong', value: '✘' }],
      },
      SOUND: {
        label: 'Hören',
        description: 'Das Ziel kann etwas hören.',
        type: ['hören'],
        icon: [{ type: 'ra', icon: ['ra-aware'] }],
      },
      RETTUNG: {
        label: 'Rettungswurf',
        description: 'Rettungswurf.',
        type: ['challenge', 'rettung', 'wurf'],
        icon: [{ type: 'ra', icon: ['ra-cracked-shield'] }],
      },
 
    };
  }

  getTextComponents(text) {
    return StringUtil.getTextComponents(text, ({ symbol, value }) => {
      if (symbol) {
        const match = /(.*)([\d\)#]+)D(\d+)(.*)/.exec(symbol);
        if (match) {
          const icons = [];
          if (match[1]) {
            icons.push({ type: 'strong', value: match[1] });
          }
          icons.push({ type: 'strong', value: match[2] });
          icons.push({ type: 'dice', icon: 'df-d' + match[3] + '-' + match[3] });
          if (match[4]) {
            icons.push({ type: 'strong', value: match[4] });
          }
          return icons;
        } else if (this.icons[symbol]) {
          return JSON.parse(JSON.stringify(this.icons[symbol].icon));
        } else {
          return [{ type: 'strong', value: symbol }];
        }
      }
      return [{ type: 'string', value }];
    });
  }

  getIcons() {
    return this.icons;
  }

}