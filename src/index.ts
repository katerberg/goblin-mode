import './index.scss';
import * as ROT from 'rot-js';
import {board} from './constants';
import {Game} from './game';
import {Intro} from './intro';

const boardWidth = board.width;
const boardHeight = board.height;

globalThis.height = boardHeight + 3;

globalThis.display = new ROT.Display({width: board.width, height: globalThis.height, fg: '#000', spacing: 2});

window.addEventListener('load', () => {
  const container = globalThis.display.getContainer() as HTMLCanvasElement;
  if (container) {
    const gameElement = document.getElementById('game');
    if (gameElement) {
      globalThis.gameElement = gameElement;
      gameElement.appendChild(container);
      gameElement.onwheel = (event): void => {
        event.preventDefault();
      };
    }
  }
  async function startGame(): Promise<void> {
    const game = new Game(boardWidth, boardHeight);
    while (!game.isLost() && !game.isWon()) {
      // eslint-disable-next-line no-await-in-loop
      await game.startNextLevel();
    }
  }

  new Intro(startGame);
});

globalThis.goblinNames = [
  'Aaftaax',
  'Adlirg',
  'Aggohx',
  'Aggu',
  'Ags',
  'Ailluilas',
  'Akkosz',
  'Alkar',
  'Along',
  'Ant Strong',
  'Arkus',
  'Atmong',
  'Baats',
  'Bait',
  'Bankit',
  'Bannuk',
  'Bebkuird',
  'Belch Loud',
  'Bentarms',
  'Bigchin',
  'Billywig',
  'Biotmaart',
  'Bisiolmea',
  'Blomvez',
  'Blur',
  'Blyts',
  'Bodrol',
  'Bogragg',
  'Boipsah',
  'Brainmush',
  'Brevzethee',
  'Brias',
  'Brodnott',
  'Bruil',
  'Bruivor',
  'Brunknas',
  'Brwaos',
  'Bugragg',
  'Buibsiort',
  'Cagrerk',
  'Ceel',
  'Cekx',
  'Cenqea',
  'Charbazz',
  'Chor',
  'Chowder',
  'Churkigs',
  'Cigonk',
  'Clalkard',
  'Claz',
  'Clietmyn',
  'Clukzaakt',
  'Craang',
  'Crasoas',
  'Creahx',
  'Creahx',
  'Crict',
  'Cruszuil',
  'Del',
  'Delduk',
  'Depolm',
  'Derigz',
  'Dies Horribly',
  'Donais',
  'Drarm',
  'Dreesb',
  'Drejask',
  'Drionvogz',
  'Drisz',
  'Druics',
  'Duggart',
  'Dullarms',
  'Dusk Brighty',
  'Dyrd',
  'Eagansa',
  'Eart',
  'Eglus',
  'Envygz',
  'Erioos',
  'Erm',
  'Ernuk',
  'Farnaff',
  'Farrod',
  'Fatleg',
  'Filragg',
  'Fiokvas',
  'Fiolx',
  'Foiz',
  'Frailtooth',
  'Fralk',
  'Freanaact',
  'Freesrylb',
  'Freias',
  'Fribdalb',
  'Frilk',
  'Frold',
  'Frursard',
  'Fugh',
  'Fugh',
  'Furguss',
  'Furliarm',
  'Furrak',
  'Gag',
  'Garlaff',
  'Garrast',
  'Gary Goodgoblin',
  'Geemusz',
  'Gehkiaz',
  'Gim Seobang Dokkaebi',
  'Glahuird',
  'Glevzaagz',
  'Gliehbiabs',
  'Gliosb',
  'Globarm',
  'Glymzogs',
  'Gnaalsia',
  'Gnaalsia',
  'Gnianagia',
  'Go Dokkaebi',
  'GoldaGoblin',
  'Gorluk',
  'Goutmaw',
  'Graggrat',
  'Gragnok',
  'Gralbianq',
  'Granguss',
  'Grapezz Shrillsteam',
  'Grejia',
  'Grikveeld',
  'Grinkrat',
  'Grishnar',
  'Grizzle',
  'Gruigs',
  'Grukgrat',
  'Grutaat',
  'Guix Saltyfault',
  'Gully',
  'Gurgrot',
  'Gurnuff',
  'Gux',
  'Harzokx',
  'Heakt',
  'Hiah',
  'Hiord',
  'Hokoiszea',
  'Htejas',
  'Huiglioft',
  'Huntero',
  'Hurrub',
  'Iazz',
  'Iharxa',
  'Ilsung',
  'Iq',
  'Ir',
  'IzIz',
  'Izqird Grimmind',
  'Jact',
  'Jan',
  'Jiarziog',
  'Jiaspas',
  'Jisriank',
  'Jurt',
  'Jykeegs',
  'Jykeegs',
  'Kalkuig',
  'Kalo',
  'Karguff',
  'Karnott',
  'Keart',
  'Khothi',
  'Kiengi',
  'Klialiabs',
  'Klolbort',
  'Klusez',
  'Kmasoas',
  'Koglig',
  'Kragraff',
  'Krevzaard',
  'Kroberd',
  'Krordois',
  'Krugnott',
  'Kruic',
  'Kuhzizz',
  'Kuilogz',
  'Kuqi',
  'Kurluk',
  'Kyuasas',
  'Lagnuff',
  'Larnar',
  'Liocs',
  'Lmaysu',
  'Lodvel',
  'Lognerk',
  'Louse',
  'Lurd',
  'Lurkit',
  'Lymzehx',
  'Lysdiez',
  'Mida',
  'Milvok',
  'Mitemouth',
  'Moldnose',
  'Mongrel',
  'Muaskas',
  'Muchot',
  'Mudmug',
  'Munkle Wrenchsnap',
  'Nadkrus',
  'Nadrak',
  'Naglok',
  'Nagnus',
  'Niafzia',
  'Nibras',
  'Nilx',
  'Nindi Rapidflow',
  'Nunoilee',
  'Nurgras',
  'Nurteyun',
  'Nyajas',
  'Obur',
  'Oenun Dokkaebi',
  'Olk',
  'Olteqe',
  'Omtuinqea',
  'Onk',
  'Opasas',
  'Owlball',
  'Pagneeg',
  'Pats',
  'Pauli',
  'Peon',
  'Phalruiltai',
  'Pheattung',
  'Phesx',
  'Piz',
  'Plegrirm',
  'Plekniesb',
  'Pler',
  'Pmasyg',
  'Pozzik',
  'Pradfoic',
  'Prarx',
  'Prizokx',
  'Prorreekz',
  'Pryhxa',
  'Prysvoikx',
  'Pudzekt',
  'Pyzge Meanbelt',
  'Qeassa',
  'Qebranda',
  'Qeldar',
  'Qiang',
  'Qoldin',
  'Quirulkee',
  'Qywjais',
  'Raazguirk',
  'Ragrat',
  'Ranluk',
  'Reenk',
  'Revilgaz',
  'Revilgaz',
  'Rit',
  'Riti Cheapboot',
  'Rodgott',
  'Rodrast',
  'Ronxa',
  'Roztiokz',
  'Rulgran',
  'Shake Spear',
  'ShakeSpear',
  'Silkeqia',
  'Sionxee',
  'Sjasooas',
  'Slaabzacs',
  'Slart',
  'Slek',
  'Slilse',
  'Sliszeabs',
  'Slozabs',
  'Snailnose',
  'Snotear',
  'Srats',
  'Sreevuld',
  'Srekt',
  'Sroisvuq',
  'Srufbih',
  'Srult',
  'Stiasnic',
  'Stinkarm',
  'Stolb',
  'Stot',
  'Strild',
  'Struiveect',
  'Sweerx',
  'Swelm',
  'Tes',
  'Thelx',
  'Thren',
  'Tik',
  'Tirx',
  'Tjoaks',
  'Toenail',
  'Tribuiq',
  'Trirta',
  'Trirzex',
  'Trung',
  'Tugdark',
  'Ubs',
  'Ugkit',
  'Uigz',
  'Uiheald',
  'Uil',
  'Ukoasla',
  'Ulnat',
  'Ulnuff',
  'Umialk',
  'Umtash',
  'Unjaks',
  'Urlus',
  'Ux',
  'Vaming',
  'Vasegz',
  'Vasse',
  'Verdrak',
  'Vigdarg',
  'Voguz',
  'Voisax',
  'Vragek',
  'Vregroqai',
  'Vrer',
  'Vrestolt',
  'Vriozz',
  'Vrudgark',
  'Vrur',
  'Vrutlus',
  'Vyasoas',
  'Wags',
  'Waz Powertooth',
  'Weasel',
  'Wernaal',
  'Wiaisokas',
  'Wonk',
  'Wraathai',
  'Wriseel',
  'Wukx',
  'Xect',
  'Xeebboq',
  'Xiagluld',
  'Xiasokas',
  'Xiogdurm',
  'Yameeka',
  'Ygs',
  'Yoasas',
  'Yraark',
  'Zarl',
  'Zear',
  'Zeekleerk',
  'Zigz',
  'Zmaskas',
  'Zok',
  'Zoz',
  'Zrurdok',
  'Zrux',
  'Zryl',
  'Zudal',
];
