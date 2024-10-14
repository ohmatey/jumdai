import {
  type ThaiAlphabet,
  ConsonantGroup,
  ThaiAlphabetType,
} from '@/app/types.d'

const consonants: ThaiAlphabet[] = [
  {
    alphabet: 'ก',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'กอ',
    thaiExampleDescription: 'ไก่',
    romanTransliterationPrefix: 'gaw',
    romanTransliteration: 'gai',
    romanDescription: 'Chicken',
    consonantGroup: ConsonantGroup.Middle,
    imageSrc: '/gaw-gai.webp',
    order: 1
  },
  {
    alphabet: 'จ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'จอ',
    thaiExampleDescription: 'จาน',
    romanTransliterationPrefix: 'jauw',
    romanTransliteration: 'jaan',
    romanDescription: 'Plate',
    consonantGroup: ConsonantGroup.Middle,
    imageSrc: '/jauw-jaan.webp',
    order: 2
  },
  {
    alphabet: 'ด',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ดอ',
    thaiExampleDescription: 'เด็ก',
    romanTransliterationPrefix: 'daw',
    romanTransliteration: 'dek',
    romanDescription: 'Child',
    consonantGroup: ConsonantGroup.Middle,
    imageSrc: '/daw-dek.webp',
    order: 3
  },
  {
    alphabet: 'ฎ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ฎอ',
    thaiExampleDescription: 'ชฎา',
    romanTransliterationPrefix: 'daw',
    romanTransliteration: 'chada',
    romanDescription: 'Headdress',
    consonantGroup: ConsonantGroup.Middle,
    imageSrc: '/daw-chada.webp',
    order: 4
  },
  {
    alphabet: 'ต',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ตอ',
    thaiExampleDescription: 'เต่า',
    romanTransliterationPrefix: 'daw',
    romanTransliteration: 'dtao',
    romanDescription: 'Turtle',
    consonantGroup: ConsonantGroup.Middle,
    imageSrc: '/daw-dtao.webp',
    order: 5
  },
  {
    alphabet: 'ฏ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ฏอ',
    thaiExampleDescription: 'ปฏัก',
    romanTransliterationPrefix: 'daw',
    romanTransliteration: 'padak',
    romanDescription: 'Goad (Cattle prod)',
    consonantGroup: ConsonantGroup.Middle,
    imageSrc: '/daw-padak.webp',
    order: 6
  },
  {
    alphabet: 'บ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'บอ',
    thaiExampleDescription: 'ใบไม้',
    romanTransliterationPrefix: 'baw',
    romanTransliteration: 'bai mai',
    romanDescription: 'Leaf',
    consonantGroup: ConsonantGroup.Middle,
    imageSrc: '/baw-bai-mai.webp',
    order: 7
  },
  {
    alphabet: 'ป',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ปอ',
    thaiExampleDescription: 'ปลา',
    romanTransliterationPrefix: 'baw',
    romanTransliteration: 'bplaa',
    romanDescription: 'Fish',
    consonantGroup: ConsonantGroup.Middle,
    imageSrc: '/baw-bplaa.webp',
    order: 8
  },
  {
    alphabet: 'อ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ออ',
    thaiExampleDescription: 'อ่าง',
    romanTransliterationPrefix: 'aw',
    romanTransliteration: 'ang',
    romanDescription: 'Basin',
    consonantGroup: ConsonantGroup.Middle,
    imageSrc: '/aw-ang.webp',
    order: 9
  },
  {
    alphabet: 'ข',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ขอ',
    thaiExampleDescription: 'ไข่',
    romanTransliterationPrefix: 'kaw',
    romanTransliteration: 'khai',
    romanDescription: 'Egg',
    consonantGroup: ConsonantGroup.High,
    imageSrc: '/kaw-khai.webp',
    order: 10
  },
  {
    alphabet: 'ฉ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ฉอ',
    thaiExampleDescription: 'ฉิ่ง',
    romanTransliterationPrefix: 'chaw',
    romanTransliteration: 'ching',
    romanDescription: 'Cymbals',
    consonantGroup: ConsonantGroup.High,
    imageSrc: '/chaw-ching.webp',
    order: 11
  },
  {
    alphabet: 'ถ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ถอ',
    thaiExampleDescription: 'ถุง',
    romanTransliterationPrefix: 'taw',
    romanTransliteration: 'tung',
    romanDescription: 'Bag',
    consonantGroup: ConsonantGroup.High,
    imageSrc: '/taw-tung.webp',
    order: 12
  },
  {
    alphabet: 'ฐ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ฐอ',
    thaiExampleDescription: 'ฐาน',
    romanTransliterationPrefix: 'taw',
    romanTransliteration: 'taan',
    romanDescription: 'Pedestal',
    consonantGroup: ConsonantGroup.High,
    imageSrc: '/taw-taan.webp',
    order: 13
  },
  {
    alphabet: 'ผ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ผอ',
    thaiExampleDescription: 'ผึ้ง',
    romanTransliterationPrefix: 'paw',
    romanTransliteration: 'phung',
    romanDescription: 'Bee',
    consonantGroup: ConsonantGroup.High,
    imageSrc: '/paw-phung.webp',
    order: 14
  },
  {
    alphabet: 'ฝ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ฝอ',
    thaiExampleDescription: 'ฝา',
    romanTransliterationPrefix: 'faw',
    romanTransliteration: 'faa',
    romanDescription: 'Lid',
    consonantGroup: ConsonantGroup.High,
    imageSrc: '/faw-faa.webp',
    order: 15
  },
  {
    alphabet: 'ศ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ศอ',
    thaiExampleDescription: 'ศาลา',
    romanTransliterationPrefix: 'saw',
    romanTransliteration: 'sala',
    romanDescription: 'Pavilion',
    consonantGroup: ConsonantGroup.High,
    imageSrc: '/saw-sala.webp',
    order: 16
  },
  {
    alphabet: 'ษ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ษอ',
    thaiExampleDescription: 'ฤๅษี',
    romanTransliterationPrefix: 'saw',
    romanTransliteration: 'ruusii',
    romanDescription: 'Hermit',
    consonantGroup: ConsonantGroup.High,
    imageSrc: '/saw-ruusii.webp',
    order: 17
  },
  {
    alphabet: 'ส',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'สอ',
    thaiExampleDescription: 'เสือ',
    romanTransliterationPrefix: 'saw',
    romanTransliteration: 'suaa',
    romanDescription: 'Tiger',
    consonantGroup: ConsonantGroup.High,
    imageSrc: '/saw-suaa.webp',
    order: 18
  },
  {
    alphabet: 'ห',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'หอ',
    thaiExampleDescription: 'หีบ',
    romanTransliterationPrefix: 'haw',
    romanTransliteration: 'heap',
    romanDescription: 'Chest',
    consonantGroup: ConsonantGroup.High,
    imageSrc: '/haw-heap.webp',
    order: 19
  },
  {
    alphabet: 'ค',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'คอ',
    thaiExampleDescription: 'ควาย',
    romanTransliterationPrefix: 'khaw',
    romanTransliteration: 'khwai',
    romanDescription: 'Buffalo',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/khaw-khwai.webp',
    order: 20
  },
  {
    alphabet: 'ฆ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ฆอ',
    thaiExampleDescription: 'ระฆัง',
    romanTransliterationPrefix: 'kaw',
    romanTransliteration: 'rakang',
    romanDescription: 'Bell',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/kaw-rakang.webp',
    order: 21
  },
  {
    alphabet: 'ช',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ชอ',
    thaiExampleDescription: 'ช้าง',
    romanTransliterationPrefix: 'chaw',
    romanTransliteration: 'chaang',
    romanDescription: 'Elephant',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/chaw-chaang.webp',
    order: 22
  },
  {
    alphabet: 'ฌ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ฌอ',
    thaiExampleDescription: 'เฌอ',
    romanTransliterationPrefix: 'chaw',
    romanTransliteration: 'cheur',
    romanDescription: 'Tree',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/chaw-cheur.webp',
    order: 23
  },
  {
    alphabet: 'ท',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ทอ',
    thaiExampleDescription: 'ทหาร',
    romanTransliterationPrefix: 'taw',
    romanTransliteration: 'thahaan',
    romanDescription: 'Soldier',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/taw-thahaan.webp',
    order: 24
  },
  {
    alphabet: 'ธ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ธอ',
    thaiExampleDescription: 'ธง',
    romanTransliterationPrefix: 'taw',
    romanTransliteration: 'thong',
    romanDescription: 'Flag',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/taw-thong.webp',
    order: 25
  },
  {
    alphabet: 'ฒ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ฒอ',
    thaiExampleDescription: 'ผู้เฒ่า',
    romanTransliterationPrefix: 'taw',
    romanTransliteration: 'putow',
    romanDescription: 'Elder',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/taw-putow.webp',
    order: 26
  },
  {
    alphabet: 'พ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'พอ',
    thaiExampleDescription: 'พาน',
    romanTransliterationPrefix: 'phaw',
    romanTransliteration: 'phaan',
    romanDescription: 'Pedestal tray',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/phaw-phaan.webp',
    order: 27
  },
  {
    alphabet: 'ภ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ภอ',
    thaiExampleDescription: 'สำเภา',
    romanTransliterationPrefix: 'phaw',
    romanTransliteration: 'samphao',
    romanDescription: 'Sailing ship',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/phaw-samphao.webp',
    order: 28
  },
  {
    alphabet: 'ฟ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ฟอ',
    thaiExampleDescription: 'ฟัน',
    romanTransliterationPrefix: 'faw',
    romanTransliteration: 'fun',
    romanDescription: 'Tooth',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/faw-fun.webp',
    order: 29
  },
  {
    alphabet: 'ซ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ซอ',
    thaiExampleDescription: 'โซ่',
    romanTransliterationPrefix: 'saw',
    romanTransliteration: 'soo',
    romanDescription: 'Chain',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/saw-soo.webp',
    order: 30
  },
  {
    alphabet: 'ฮ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ฮอ',
    thaiExampleDescription: 'นกฮูก',
    romanTransliterationPrefix: 'hoo',
    romanTransliteration: 'nok hook',
    romanDescription: 'Owl',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/hoo-nok-hook.webp',
    order: 31
  },
  {
    alphabet: 'ง',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'งอ',
    thaiExampleDescription: 'งู',
    romanTransliterationPrefix: 'ngaw',
    romanTransliteration: 'ngu',
    romanDescription: 'Snake',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/ngaw-ngu.webp',
    order: 32
  },
  {
    alphabet: 'น',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'นอ',
    thaiExampleDescription: 'หนู',
    romanTransliterationPrefix: 'naw',
    romanTransliteration: 'nuu',
    romanDescription: 'Mouse',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/naw-nuu.webp',
    order: 33
  },
  {
    alphabet: 'ณ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ณอ',
    thaiExampleDescription: 'เณร',
    romanTransliterationPrefix: 'naw',
    romanTransliteration: 'naan',
    romanDescription: 'Novice monk',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/naw-naan.webp',
    order: 34
  },
  {
    alphabet: 'ม',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'มอ',
    thaiExampleDescription: 'ม้า',
    romanTransliterationPrefix: 'maw',
    romanTransliteration: 'maa',
    romanDescription: 'Horse',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/maw-maa.webp',
    order: 35
  },
  {
    alphabet: 'ย',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ยอ',
    thaiExampleDescription: 'ยักษ์',
    romanTransliterationPrefix: 'yaw',
    romanTransliteration: 'yuk',
    romanDescription: 'Giant',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/yaw-yuk.webp',
    order: 36
  },
  {
    alphabet: 'ญ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ญอ',
    thaiExampleDescription: 'หญิง',
    romanTransliterationPrefix: 'yaw',
    romanTransliteration: 'ying',
    romanDescription: 'Woman',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/yaw-ying.webp',
    order: 37
  },
  {
    alphabet: 'ร',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'รอ',
    thaiExampleDescription: 'เรือ',
    romanTransliterationPrefix: 'raw',
    romanTransliteration: 'rua',
    romanDescription: 'Boat',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/raw-rua.webp',
    order: 38
  },
  {
    alphabet: 'ล',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ลอ',
    thaiExampleDescription: 'ลิง',
    romanTransliterationPrefix: 'law',
    romanTransliteration: 'ling',
    romanDescription: 'Monkey',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/law-ling.webp',
    order: 39
  },
  {
    alphabet: 'ฬ',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'ฬอ',
    thaiExampleDescription: 'จุฬา',
    romanTransliterationPrefix: 'law',
    romanTransliteration: 'julaa',
    romanDescription: 'Kite',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/law-julaa.webp',
    order: 40
  },
  {
    alphabet: 'ว',
    type: ThaiAlphabetType.Consonant,
    thaiExamplePrefix: 'วอ',
    thaiExampleDescription: 'แหวน',
    romanTransliterationPrefix: 'waw',
    romanTransliteration: 'waen',
    romanDescription: 'Ring',
    consonantGroup: ConsonantGroup.Low,
    imageSrc: '/waw-waen.webp',
    order: 41
  },
]

export default consonants