import type { CareGuide, Plant, PlantCategory } from './types'

/** Demo catalog only: every sample price is editable here and availability is not a stock claim. */
const seed: Array<[string, string, string, string, number, string, string, string, boolean, boolean, boolean]> = [
  // Hindi, English, botanical name, category, demo INR price, light, watering, size, flowering, indoor, featured
  ['मनी प्लांट','Money Plant','Epipremnum aureum','indoor',99,'तेज़ परोक्ष रोशनी','मिट्टी की ऊपरी परत सूखने पर','4–6 इंच गमला',false,true,true],
  ['स्नेक प्लांट','Snake Plant','Dracaena trifasciata','indoor',199,'कम से तेज़ परोक्ष रोशनी','मिट्टी सूखने के बाद','6 इंच गमला',false,true,true],
  ['एलोवेरा','Aloe Vera','Aloe vera','medicinal',99,'तेज़ रोशनी / धूप','मिट्टी पूरी सूखने पर','4–6 इंच गमला',false,true,true],
  ['स्पाइडर प्लांट','Spider Plant','Chlorophytum comosum','indoor',149,'तेज़ परोक्ष रोशनी','मिट्टी हल्की नम रहे','4–6 इंच गमला',false,true,false],
  ['पीस लिली','Peace Lily','Spathiphyllum wallisii','indoor',349,'मध्यम परोक्ष रोशनी','मिट्टी हल्की नम रहे','6 इंच गमला',true,true,true],
  ['अरेका पाम','Areca Palm','Dypsis lutescens','indoor',499,'तेज़ परोक्ष रोशनी','ऊपरी मिट्टी सूखने पर','8 इंच गमला',false,true,true],
  ['रबर प्लांट','Rubber Plant','Ficus elastica','indoor',299,'तेज़ परोक्ष रोशनी','मिट्टी सूखने पर','6 इंच गमला',false,true,false],
  ['ZZ प्लांट','ZZ Plant','Zamioculcas zamiifolia','indoor',399,'कम से तेज़ परोक्ष रोशनी','मिट्टी सूखने के बाद','6 इंच गमला',false,true,false],
  ['फर्न','Boston Fern','Nephrolepis exaltata','indoor',249,'छनी हुई रोशनी','नियमित, मिट्टी नम रखें','6 इंच गमला',false,true,false],
  ['क्रोटन','Croton','Codiaeum variegatum','ornamental',199,'तेज़ रोशनी','ऊपरी मिट्टी सूखने पर','6 इंच गमला',false,true,false],
  ['गुलाब','Rose','Rosa','flowering',149,'रोज़ 5–6 घंटे धूप','ऊपरी मिट्टी सूखने पर','6 इंच गमला',true,false,true],
  ['गुड़हल','Hibiscus','Hibiscus rosa-sinensis','flowering',129,'पूरी धूप','नियमित, जलभराव से बचें','6 इंच गमला',true,false,true],
  ['गेंदा','Marigold','Tagetes erecta','seasonal',49,'पूरी धूप','मिट्टी हल्की नम रखें','4 इंच गमला',true,false,true],
  ['चमेली','Jasmine','Jasminum officinale','flowering',199,'धूप से हल्की छाँव','ऊपरी मिट्टी सूखने पर','6 इंच गमला',true,false,false],
  ['मोगरा','Arabian Jasmine','Jasminum sambac','flowering',199,'सुबह की धूप','नियमित, जलभराव नहीं','6 इंच गमला',true,false,true],
  ['अपराजिता','Butterfly Pea','Clitoria ternatea','climber',99,'पूरी धूप','मिट्टी नम रखें','4 इंच गमला',true,false,false],
  ['सदाबहार','Madagascar Periwinkle','Catharanthus roseus','seasonal',49,'पूरी धूप','मिट्टी सूखने पर','4 इंच गमला',true,false,false],
  ['कनेर','Oleander','Nerium oleander','ornamental',149,'पूरी धूप','कम से मध्यम पानी','6 इंच गमला',true,false,false],
  ['बोगनवेलिया','Bougainvillea','Bougainvillea glabra','climber',199,'पूरी धूप','कम पानी, मिट्टी सूखने पर','6 इंच गमला',true,false,true],
  ['चंपा','Plumeria','Plumeria rubra','flowering',249,'पूरी धूप','मिट्टी सूखने पर','8 इंच गमला',true,false,false],
  ['आम','Mango','Mangifera indica','fruit',249,'पूरी धूप','गहराई से, मिट्टी सूखने पर','ग्राफ्टेड पौधा',false,false,true],
  ['अमरूद','Guava','Psidium guajava','fruit',199,'पूरी धूप','नियमित, जलभराव से बचें','ग्राफ्टेड पौधा',false,false,true],
  ['नींबू','Lemon','Citrus limon','fruit',199,'पूरी धूप','ऊपरी मिट्टी सूखने पर','ग्राफ्टेड पौधा',true,false,true],
  ['अनार','Pomegranate','Punica granatum','fruit',199,'पूरी धूप','मध्यम, जलभराव नहीं','ग्राफ्टेड पौधा',false,false,false],
  ['पपीता','Papaya','Carica papaya','fruit',99,'पूरी धूप','नियमित, मिट्टी नम रहे','सैपलिंग',false,false,false],
  ['केला','Banana','Musa','fruit',149,'पूरी धूप / हल्की छाँव','नियमित, मिट्टी नम रहे','सैपलिंग',false,false,false],
  ['आँवला','Indian Gooseberry','Phyllanthus emblica','fruit',199,'पूरी धूप','स्थापित होने तक नियमित','सैपलिंग',false,false,false],
  ['जामुन','Java Plum','Syzygium cumini','shade-tree',249,'पूरी धूप','स्थापित होने तक नियमित','सैपलिंग',false,false,false],
  ['सीताफल','Custard Apple','Annona squamosa','fruit',199,'पूरी धूप','मध्यम, जलभराव नहीं','सैपलिंग',false,false,false],
  ['कटहल','Jackfruit','Artocarpus heterophyllus','fruit',249,'पूरी धूप','स्थापित होने तक नियमित','सैपलिंग',false,false,false],
  ['तुलसी','Holy Basil','Ocimum tenuiflorum','medicinal',49,'सुबह की धूप','नियमित, जलभराव नहीं','4 इंच गमला',true,true,true],
  ['नीम','Neem','Azadirachta indica','shade-tree',199,'पूरी धूप','स्थापित होने तक नियमित','सैपलिंग',false,false,false],
  ['गिलोय','Giloy','Tinospora cordifolia','climber',99,'धूप से हल्की छाँव','मिट्टी हल्की नम रखें','जड़ सहित कटिंग',false,false,false],
  ['करी पत्ता','Curry Leaf','Murraya koenigii','medicinal',149,'तेज़ धूप','ऊपरी मिट्टी सूखने पर','6 इंच गमला',false,false,true],
  ['अश्वगंधा','Ashwagandha','Withania somnifera','medicinal',79,'पूरी धूप','कम पानी, मिट्टी सूखने पर','4 इंच गमला',false,false,false],
  ['पुदीना','Mint','Mentha spicata','medicinal',49,'सुबह की धूप','नियमित, मिट्टी नम रखें','4 इंच गमला',false,true,false],
  ['लेमनग्रास','Lemongrass','Cymbopogon citratus','medicinal',99,'पूरी धूप','नियमित, जलभराव नहीं','सैपलिंग',false,false,false],
  ['ब्राह्मी','Brahmi','Bacopa monnieri','medicinal',79,'हल्की धूप','मिट्टी लगातार नम रखें','4 इंच गमला',true,true,false],
  ['अशोक','Ashoka Tree','Monoon longifolium','shade-tree',299,'पूरी धूप / हल्की छाँव','स्थापित होने तक नियमित','सैपलिंग',false,false,true],
  ['बांस','Bamboo','Bambusoideae','shade-tree',199,'धूप से हल्की छाँव','नियमित, मिट्टी नम रखें','क्लम्पिंग किस्म',false,false,false],
  ['पाम','Ornamental Palm','','ornamental',499,'तेज़ परोक्ष रोशनी','ऊपरी मिट्टी सूखने पर','8 इंच गमला',false,true,false],
  ['फाइकस','Ficus','Ficus benjamina','ornamental',299,'तेज़ परोक्ष रोशनी','ऊपरी मिट्टी सूखने पर','6 इंच गमला',false,true,false],
  ['चांदनी','Crape Jasmine','Tabernaemontana divaricata','flowering',149,'धूप से हल्की छाँव','मिट्टी हल्की नम रखें','6 इंच गमला',true,false,false],
  ['मौलश्री','Spanish Cherry','Mimusops elengi','shade-tree',299,'पूरी धूप / हल्की छाँव','स्थापित होने तक नियमित','सैपलिंग',true,false,false],
  ['रातरानी','Night-Blooming Jasmine','Cestrum nocturnum','flowering',149,'सुबह की धूप','मध्यम, जलभराव नहीं','6 इंच गमला',true,false,false],
  ['रंगून क्रीपर','Rangoon Creeper','Combretum indicum','climber',199,'पूरी धूप','नियमित, जलभराव से बचें','6 इंच गमला',true,false,false],
  ['मधुमालती','Garlic Vine','Mansoa alliacea','climber',199,'पूरी धूप / हल्की छाँव','मिट्टी हल्की नम रखें','6 इंच गमला',true,false,false],
  ['कैक्टस','Cactus','Cactaceae','succulent',99,'तेज़ रोशनी','मिट्टी पूरी सूखने पर','3 इंच गमला',false,true,false],
  ['जेड प्लांट','Jade Plant','Crassula ovata','succulent',149,'तेज़ रोशनी','मिट्टी पूरी सूखने पर','4 इंच गमला',false,true,false],
  ['एचेवेरिया','Echeveria','Echeveria elegans','succulent',149,'तेज़ रोशनी','मिट्टी सूखने पर','3 इंच गमला',false,true,false],
  ['मनी प्लांट बेल','Golden Pothos Vine','Epipremnum aureum','climber',149,'परोक्ष रोशनी','ऊपरी मिट्टी सूखने पर','हैंगिंग बास्केट',false,true,false],
  ['मधुमालती बेल','Garlic Vine Climber','Mansoa alliacea','climber',249,'पूरी धूप','मध्यम, स्थापित होने पर','बेल सहित',true,false,false],
  ['कचनार','Mountain Ebony','Bauhinia variegata','shade-tree',249,'पूरी धूप','स्थापित होने तक नियमित','सैपलिंग',true,false,false],
  ['गुलमोहर','Flame Tree','Delonix regia','shade-tree',249,'पूरी धूप','स्थापित होने तक नियमित','सैपलिंग',true,false,false],
  ['सूरजमुखी','Sunflower','Helianthus annuus','seasonal',49,'पूरी धूप','नियमित, मिट्टी नम रखें','4 इंच गमला',true,false,false],
  ['डहेलिया','Dahlia','Dahlia pinnata','seasonal',99,'सुबह की धूप','नियमित, जलभराव नहीं','6 इंच गमला',true,false,false],
  ['बोनसाई फाइकस','Ficus Bonsai','Ficus microcarpa','bonsai',899,'तेज़ परोक्ष रोशनी','ऊपरी मिट्टी सूखने पर','तैयार बोनसाई',false,true,false],
  ['टेराकोटा गमला','Terracotta Pot','', 'supplies',99,'—','—','6 इंच गमला',false,false,false],
  ['पॉटिंग मिक्स','Potting Mix','', 'supplies',149,'—','—','5 किलो पैक',false,false,false],
  ['जैविक कम्पोस्ट','Organic Compost','', 'supplies',99,'—','—','2 किलो पैक',false,false,false],
  ['प्लांटर सेट','Planter Set','', 'supplies',349,'—','—','3 गमलों का सेट',false,false,false],
]

export const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const plants: Plant[] = seed.map(([nameHi, nameEn, scientificName, categorySlug, priceINR, sunlight, watering, size, flowering, indoor, featured], index) => {
  const slug = slugify(nameEn)
  const supply = categorySlug === 'supplies'
  return {
    id: `plant-${String(index + 1).padStart(3, '0')}`, slug, nameHi, nameEn,
    ...(scientificName ? { scientificName } : {}), categorySlug,
    descriptionHi: supply ? `${nameHi} — बागवानी के लिए एक नमूना उत्पाद।` : `${nameHi} (${nameEn}) — घर या बगीचे के लिए एक पौधा। पौधे का आकार, किस्म और उपलब्धता नर्सरी से पूछकर तय करें।`,
    descriptionEn: supply ? `${nameEn} for a sample gardening supplies catalog.` : `A ${nameEn.toLowerCase()} plant for a home or garden. Confirm the exact variety and size with the nursery before ordering.`,
    image: `/plants/${slug}.webp`, alt: `${nameHi} · ${nameEn} plant photograph`, priceINR, size, sunlight, watering,
    soil: supply ? '—' : 'अच्छी जल-निकासी वाली मिट्टी; किस्म और मौसम के अनुसार देखभाल करें।',
    difficulty: supply ? '—' : index < 20 ? 'आसान' : 'सामान्य', flowering, indoor, featured,
    availability: 'unknown',
    variants: [
      { id: `${slug}-standard`, label: `मानक · ${size}`, size, priceINR },
      { id: `${slug}-large`, label: 'बड़ा पौधा · कीमत उदाहरण', size: 'बड़ा आकार', priceINR: Math.round(priceINR * 1.85 / 10) * 10 },
    ],
  }
})

const categoryMeta: Array<[string,string,string,string]> = [
  ['indoor','इनडोर पौधे','Indoor plants','कमरे में हरियाली के लिए'], ['outdoor','आउटडोर पौधे','Outdoor plants','खुली हवा और धूप के लिए'],
  ['flowering','फूलों वाले पौधे','Flowering plants','रंग और खुशबू के साथ'], ['fruit','फलदार पौधे','Fruit plants','फलदार पौधों के विकल्प'],
  ['medicinal','औषधीय पौधे','Medicinal plants','परंपरागत बागवानी पसंद'], ['ornamental','सजावटी पौधे','Ornamental plants','हर कोने की शोभा'],
  ['shade-tree','छायादार पेड़','Shade trees','आँगन और खुली जगह के लिए'], ['climber','बेल और लताएँ','Climbers & vines','दीवार और जाली को सजाएँ'],
  ['succulent','कैक्टस एवं सक्युलेंट','Cacti & succulents','कम पानी पसंद करने वाले'], ['supplies','गमले एवं बागवानी','Pots & gardening','गमले और बागवानी सामग्री'],
  ['seasonal','मौसमी फूल','Seasonal flowers','मौसम के रंग'], ['bonsai','बोनसाई','Bonsai','छोटे रूप में सुंदर पेड़'],
]
export const categories: PlantCategory[] = categoryMeta.map(([slug,nameHi,nameEn,summary]) => ({
  slug,nameHi,nameEn,summary,image: plants.find(p => p.categorySlug === slug)?.image || '/images/prayagraj-nursery-hero.webp',
}))

export const careGuides: CareGuide[] = [
  { slug:'watering', titleHi:'पौधों में पानी कब दें?', titleEn:'When should you water plants?', excerpt:'पानी देने का सही समय समझें और जड़ों को स्वस्थ रखें।', image:'/plants/money-plant.webp', content:['हर पौधे की पानी की ज़रूरत अलग होती है। पहले गमले की मिट्टी की ऊपरी 2–3 सेंटीमीटर परत छूकर देखें।','अगर मिट्टी नम है तो कुछ दिन रुकें। सूखी लगे तो धीरे-धीरे पानी दें, जब तक अतिरिक्त पानी नीचे के छेद से निकलने लगे।','गमले की तश्तरी में पानी जमा न रहने दें। गर्मी, सर्दी, रोशनी और गमले के आकार के अनुसार पानी की आवृत्ति बदलती है।'] },
  { slug:'soil', titleHi:'पौधों के लिए सही मिट्टी कैसे चुनें?', titleEn:'Choosing the right soil', excerpt:'हवादार और पानी निकालने वाली मिट्टी से करें अच्छी शुरुआत।', image:'/plants/organic-compost.webp', content:['अधिकांश गमलों में ऐसी मिट्टी उपयोगी है जिसमें हवा का संचार हो और अतिरिक्त पानी बाहर निकल सके।','गमले के नीचे जल-निकासी छेद देखें। मिट्टी को बहुत कसकर न दबाएँ।','कैक्टस, सक्युलेंट, फलदार पौधे और फर्न की मिट्टी की ज़रूरतें अलग हो सकती हैं। पौधे की किस्म के लिए नर्सरी से सलाह लें।'] },
  { slug:'light', titleHi:'घर में पौधों को कहाँ रखें?', titleEn:'Finding the right light', excerpt:'पत्तियों और धूप को देखकर पौधे की सही जगह चुनें।', image:'/plants/peace-lily.webp', content:['तेज़ परोक्ष रोशनी का अर्थ है खिड़की से आने वाली रोशनी, जिसमें पत्तियों पर कड़ी सीधी धूप न पड़े।','धूप पसंद करने वाले पौधों को धीरे-धीरे बाहर की धूप का आदी करें। अचानक तेज़ धूप से पत्तियाँ झुलस सकती हैं।','पौधे को कुछ हफ्तों तक देखें: नई बढ़त और पत्तियों का रंग उसकी जगह के बारे में संकेत देते हैं।'] },
  { slug:'fertilizer', titleHi:'पौधों में खाद का सही उपयोग', titleEn:'Using compost and fertilizer', excerpt:'मौसम और पौधे की बढ़त के अनुसार खाद का इस्तेमाल करें।', image:'/plants/potting-mix.webp', content:['खाद या कम्पोस्ट का उपयोग उत्पाद के लेबल और पौधे की किस्म के अनुसार करें।','कम मात्रा से शुरुआत करें; सूखी या तनावग्रस्त मिट्टी में तेज़ खाद न डालें।','नए पौधे, सुप्त मौसम और अलग-अलग प्रजातियों की ज़रूरतें बदलती हैं। किसी उपचार को पौधे की निश्चित समस्या का इलाज न मानें।'] },
  { slug:'seasons', titleHi:'गर्मी और सर्दी में पौधों की देखभाल', titleEn:'Seasonal plant care', excerpt:'मौसम बदलने पर पानी, धूप और सुरक्षा का ध्यान रखें।', image:'/images/prayagraj-nursery-hero.webp', content:['प्रयागराज की गर्मियों में दोपहर की कड़ी धूप से कोमल पत्तियों को बचाएँ और मिट्टी जल्दी सूखती है या नहीं देखते रहें।','सर्दियों में पानी की मात्रा अक्सर कम करनी पड़ती है; मिट्टी देखकर निर्णय लें।','ठंडी हवा, गर्म हवा के झोंके और अचानक स्थान बदलने से पौधों पर असर पड़ सकता है। प्रजाति के अनुसार देखभाल करें।'] },
]

export const money = (value: number) => new Intl.NumberFormat('hi-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(value)
