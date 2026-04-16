const mongoose = require('mongoose');
require('dotenv').config();
const Test = require('./models/Test');

async function seedMassiveData() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic-slip');
  
  const allTestProfiles = [
    {
      name: 'COMPLETE BLOOD COUNT (CBC)',
      price: 300,
      category: 'HAEMATOLOGY',
      parameters: [
        { paramName: 'HEMOGLOBIN', unit: 'g/dL', referenceRange: '13.0 - 17.0', group: 'CBC' },
        { paramName: 'TLC (Total Leucocyte Count)', unit: '/cumm', referenceRange: '4000 - 11000', group: 'CBC' },
        { paramName: 'RBC COUNT', unit: 'mill/cumm', referenceRange: '4.5 - 5.5', group: 'CBC' },
        { paramName: 'PCV', unit: '%', referenceRange: '40 - 50', group: 'CBC' },
        { paramName: 'MCV', unit: 'fl', referenceRange: '82 - 92', group: 'Indices' },
        { paramName: 'MCH', unit: 'pg', referenceRange: '27 - 32', group: 'Indices' },
        { paramName: 'MCHC', unit: 'g/dL', referenceRange: '32 - 36', group: 'Indices' },
        { paramName: 'RDW', unit: '%', referenceRange: '11.5 - 14.5', group: 'Indices' },
        { paramName: 'PLATELET COUNT', unit: '/cumm', referenceRange: '150000 - 450000', group: 'CBC' },
        { paramName: 'NEUTROPHILS', unit: '%', referenceRange: '40 - 75', group: 'Differential Count' },
        { paramName: 'LYMPHOCYTES', unit: '%', referenceRange: '20 - 45', group: 'Differential Count' },
        { paramName: 'MONOCYTES', unit: '%', referenceRange: '2 - 10', group: 'Differential Count' },
        { paramName: 'EOSINOPHILS', unit: '%', referenceRange: '1 - 6', group: 'Differential Count' },
        { paramName: 'BASOPHILS', unit: '%', referenceRange: '0 - 1', group: 'Differential Count' },
        { paramName: 'Absolute Eosinophil Count (AEC)', unit: '/cumm', referenceRange: '40 - 450', group: 'CBC' }
      ]
    },
    {
      name: 'URINE EXAMINATION (ROUTINE)',
      price: 150,
      category: 'CLINICAL PATHOLOGY',
      parameters: [
        { paramName: 'QUANTITY', unit: 'ml', referenceRange: '', group: 'Physical' },
        { paramName: 'COLOUR', unit: '', referenceRange: 'Pale Yellow', group: 'Physical' },
        { paramName: 'APPEARANCE', unit: '', referenceRange: 'Clear', group: 'Physical' },
        { paramName: 'REACTION (pH)', unit: '', referenceRange: '4.5 - 8.0', group: 'Chemical' },
        { paramName: 'ALBUMIN', unit: '', referenceRange: 'Nil', group: 'Chemical' },
        { paramName: 'SUGAR', unit: '', referenceRange: 'Nil', group: 'Chemical' },
        { paramName: 'BILE SALT', unit: '', referenceRange: 'Negative', group: 'Chemical' },
        { paramName: 'BILE PIGMENT', unit: '', referenceRange: 'Negative', group: 'Chemical' },
        { paramName: 'PUS CELLS', unit: '/hpf', referenceRange: '0 - 5', group: 'Microscopic' },
        { paramName: 'EPITHELIAL CELLS', unit: '/hpf', referenceRange: 'Few', group: 'Microscopic' },
        { paramName: 'R.B.C', unit: '/hpf', referenceRange: 'Nil', group: 'Microscopic' },
        { paramName: 'CAST', unit: '', referenceRange: 'Nil', group: 'Microscopic' },
        { paramName: 'CRYSTALS', unit: '', referenceRange: 'Nil', group: 'Microscopic' }
      ]
    },
    {
      name: 'BLOOD GROUP & Rh FACTOR',
      price: 100,
      category: 'IMMUNOLOGY',
      parameters: [
        { paramName: 'BLOOD GROUP', unit: '', referenceRange: '-', group: '' },
        { paramName: 'Rh FACTOR', unit: '', referenceRange: '-', group: '' }
      ]
    },
    {
      name: 'MALARIA PARASITE (MP CARDS)',
      price: 250,
      category: 'SEROLOGY',
      parameters: [
        { paramName: 'M.P (Pv/Pf)', unit: '', referenceRange: 'Negative', group: '' }
      ]
    },
    {
      name: 'DENGUE NS1 / IgM / IgG',
      price: 800,
      category: 'SEROLOGY',
      parameters: [
        { paramName: 'DENGUE NS1 Ag', unit: '', referenceRange: 'Negative', group: 'Dengue' },
        { paramName: 'DENGUE IgM Ab', unit: '', referenceRange: 'Negative', group: 'Dengue' },
        { paramName: 'DENGUE IgG Ab', unit: '', referenceRange: 'Negative', group: 'Dengue' }
      ]
    },
    {
      name: 'STOOL EXAMINATION',
      price: 150,
      category: 'CLINICAL PATHOLOGY',
      parameters: [
        { paramName: 'COLOUR', unit: '', referenceRange: 'Yellowish/Brown', group: 'Physical' },
        { paramName: 'CONSISTENCY', unit: '', referenceRange: 'Semi-formed', group: 'Physical' },
        { paramName: 'MUCUS', unit: '', referenceRange: 'Absent', group: 'Physical' },
        { paramName: 'BLOOD', unit: '', referenceRange: 'Absent', group: 'Physical' },
        { paramName: 'PUS CELLS', unit: '/hpf', referenceRange: 'Nil', group: 'Microscopic' },
        { paramName: 'OVAL/CYSTS', unit: '', referenceRange: 'Nil', group: 'Microscopic' }
      ]
    }
  ];

  for(const test of allTestProfiles) {
    await Test.findOneAndUpdate(
      { name: test.name },
      test,
      { upsert: true, new: true }
    );
    console.log(`Synced ${test.name}`);
  }

  console.log('Massive data seeding completed.');
  process.exit();
}

seedMassiveData();
