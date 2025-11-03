
import { LocalBibleData } from '@/services/localBibleService';
import { genesisData } from './genesis';
import { exodusData } from './exodus';
import { leviticusData } from './leviticus';
import { numbersData } from './numbers';
import { deuteronomyData } from './deuteronomy';
import { joshuaData } from './joshua';
import { judgesData } from './judges';
import { ruthData } from './ruth';
import { firstSamuelData } from './1samuel';
import { secondSamuelData } from './2samuel';
import { firstKingsData } from './1kings';
import { secondKingsData } from './2kings';
import { firstChroniclesData } from './1chronicles';
import { secondChroniclesData } from './2chronicles';
import { ezraData } from './ezra';
import { nehemiahData } from './nehemiah';
import { estherData } from './esther';
import { jobData } from './job';
import { psalmsData } from './psalms';
import { proverbsData } from './proverbs';
import { ecclesiastesData } from './ecclesiastes';
import { songOfSolomonData } from './songofsolomon';
import { isaiahData } from './isaiah';
import { jeremiahData } from './jeremiah';
import { lamentationsData } from './lamentations';
import { ezekielData } from './ezekiel';
import { danielData } from './daniel';
import { hoseaData } from './hosea';
import { joelData } from './joel';
import { amosData } from './amos';
import { obadiahData } from './obadiah';
import { jonahData } from './jonah';
import { micahData } from './micah';
import { nahumData } from './nahum';
import { habakkukData } from './habakkuk';
import { zephaniahData } from './zephaniah';
import { haggaiData } from './haggai';
import { zechariahData } from './zechariah';
import { malachiData } from './malachi';
import { matthewData } from './matthew';
import { markData } from './mark';
import { lukeData } from './luke';
import { johnData } from './john';
import { actsData } from './acts';
import { romansData } from './romans';
import { firstCorinthiansData } from './1corinthians';
import { secondCorinthiansData } from './2corinthians';
import { galatiansData } from './galatians';
import { ephesiansData } from './ephesians';
import { philippiansData } from './philippians';
import { colossiansData } from './colossians';
import { firstThessaloniansData } from './1thessalonians';
import { secondThessaloniansData } from './2thessalonians';
import { firstTimothyData } from './1timothy';
import { secondTimothyData } from './2timothy';
import { titusData } from './titus';
import { philemonData } from './philemon';
import { hebrewsData } from './hebrews';
import { jamesData } from './james';
import { firstPeterData } from './1peter';
import { secondPeterData } from './2peter';
import { firstJohnData } from './1john';
import { secondJohnData } from './2john';
import { thirdJohnData } from './3john';
import { judeData } from './jude';
import { revelationData } from './revelation';

export const completeNasbData: LocalBibleData = {
  // Old Testament
  'GEN': genesisData,
  'EXO': exodusData,
  'LEV': leviticusData,
  'NUM': numbersData,
  'DEU': deuteronomyData,
  'JOS': joshuaData,
  'JDG': judgesData,
  'RUT': ruthData,
  '1SA': firstSamuelData,
  '2SA': secondSamuelData,
  '1KI': firstKingsData,
  '2KI': secondKingsData,
  '1CH': firstChroniclesData,
  '2CH': secondChroniclesData,
  'EZR': ezraData,
  'NEH': nehemiahData,
  'EST': estherData,
  'JOB': jobData,
  'PSA': psalmsData,
  'PRO': proverbsData,
  'ECC': ecclesiastesData,
  'SNG': songOfSolomonData,
  'ISA': isaiahData,
  'JER': jeremiahData,
  'LAM': lamentationsData,
  'EZK': ezekielData,
  'DAN': danielData,
  'HOS': hoseaData,
  'JOL': joelData,
  'AMO': amosData,
  'OBA': obadiahData,
  'JON': jonahData,
  'MIC': micahData,
  'NAM': nahumData,
  'HAB': habakkukData,
  'ZEP': zephaniahData,
  'HAG': haggaiData,
  'ZEC': zechariahData,
  'MAL': malachiData,
  
  // New Testament
  'MAT': matthewData,
  'MRK': markData,
  'LUK': lukeData,
  'JHN': johnData,
  'ACT': actsData,
  'ROM': romansData,
  '1CO': firstCorinthiansData,
  '2CO': secondCorinthiansData,
  'GAL': galatiansData,
  'EPH': ephesiansData,
  'PHP': philippiansData,
  'COL': colossiansData,
  '1TH': firstThessaloniansData,
  '2TH': secondThessaloniansData,
  '1TI': firstTimothyData,
  '2TI': secondTimothyData,
  'TIT': titusData,
  'PHM': philemonData,
  'HEB': hebrewsData,
  'JAS': jamesData,
  '1PE': firstPeterData,
  '2PE': secondPeterData,
  '1JN': firstJohnData,
  '2JN': secondJohnData,
  '3JN': thirdJohnData,
  'JUD': judeData,
  'REV': revelationData,
};
