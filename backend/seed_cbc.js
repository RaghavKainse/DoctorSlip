const mongoose = require('mongoose');
require('dotenv').config();
const Test = require('./models/Test');

async function seedCBC() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic-slip');
  
  const cbcParams = [
    { paramName: 'HEMOGLOBIN', unit: 'gm%', referenceRange: '12 - 16', group: 'CBC' },
    { paramName: 'RBC COUNT', unit: 'Millions/cumm', referenceRange: '4.1 - 5.1', group: 'CBC' },
    { paramName: 'TOTAL WBC COUNT', unit: '/cumm', referenceRange: '4500 - 13000', group: 'CBC' },
    { paramName: 'NEUTROPHILS', unit: '%', referenceRange: '40 - 75', group: 'Differential Count : -' },
    { paramName: 'LYMPHOCYTES', unit: '%', referenceRange: '20 - 45', group: 'Differential Count : -' },
    { paramName: 'MONOCYTES', unit: '%', referenceRange: '1 - 10', group: 'Differential Count : -' },
    { paramName: 'EOSINOPHILS', unit: '%', referenceRange: '1 - 6', group: 'Differential Count : -' },
    { paramName: 'BASOPHILS', unit: '%', referenceRange: '0 - 1', group: 'Differential Count : -' },
    { paramName: 'HCT', unit: '%', referenceRange: '33 - 51', group: 'Indices' },
    { paramName: 'MEAN CORPUSCULAR VOLUME(MCV)', unit: 'fl', referenceRange: '78 - 102', group: 'Indices' },
    { paramName: 'MEAN CORPUSCULAR Hb(MCH)', unit: 'pg', referenceRange: '25 - 35', group: 'Indices' },
    { paramName: 'MEAN CORP.HEMO.CONC(MCHC)', unit: 'g/dl', referenceRange: '32 - 36', group: 'Indices' },
    { paramName: 'RED CELL DISTRIBUTION(RDW-CV)', unit: '%', referenceRange: '11 - 16', group: 'Indices' },
    { paramName: 'PLATELET COUNT', unit: '/cu.mm', referenceRange: '150000 - 450000', group: 'Indices' },
    { paramName: 'MEAN PLATELET VOLUME(MPV)', unit: 'fl', referenceRange: '8 - 11', group: 'Indices' },
    { paramName: 'PLATELET DISTRIBUTION(PDW)', unit: 'fl', referenceRange: '9 - 17', group: 'Indices' }
  ];

  await Test.findOneAndUpdate({ name: 'CBC' }, { parameters: cbcParams });
  console.log('CBC seeded with parameters.');
  process.exit();
}
seedCBC();
