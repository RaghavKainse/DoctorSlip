const mongoose = require('mongoose');
require('dotenv').config();
const Test = require('./models/Test');

async function seedMoreTests() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic-slip');
  
  const lftParams = [
    { paramName: 'BILIRUBIN (TOTAL)', unit: 'mg/dl', referenceRange: '0.2 - 1.2', group: 'Liver Function Test' },
    { paramName: 'BILIRUBIN (DIRECT)', unit: 'mg/dl', referenceRange: '0.0 - 0.3', group: 'Liver Function Test' },
    { paramName: 'BILIRUBIN (INDIRECT)', unit: 'mg/dl', referenceRange: '0.2 - 0.9', group: 'Liver Function Test' },
    { paramName: 'SGOT (AST)', unit: 'U/L', referenceRange: '5 - 40', group: 'Liver Function Test' },
    { paramName: 'SGPT (ALT)', unit: 'U/L', referenceRange: '5 - 41', group: 'Liver Function Test' },
    { paramName: 'ALKALINE PHOSPHATASE', unit: 'U/L', referenceRange: '40 - 129', group: 'Liver Function Test' },
    { paramName: 'TOTAL PROTEIN', unit: 'g/dl', referenceRange: '6.4 - 8.3', group: 'Liver Function Test' },
    { paramName: 'ALBUMIN', unit: 'g/dl', referenceRange: '3.5 - 5.2', group: 'Liver Function Test' },
    { paramName: 'GLOBULIN', unit: 'g/dl', referenceRange: '2.5 - 3.4', group: 'Liver Function Test' },
    { paramName: 'A/G RATIO', unit: '', referenceRange: '1.1 - 2.2', group: 'Liver Function Test' }
  ];

  const kftParams = [
    { paramName: 'BLOOD UREA', unit: 'mg/dl', referenceRange: '15 - 45', group: 'Kidney Function Test' },
    { paramName: 'SERUM CREATININE', unit: 'mg/dl', referenceRange: '0.5 - 1.2', group: 'Kidney Function Test' },
    { paramName: 'URIC ACID', unit: 'mg/dl', referenceRange: '2.4 - 6.0', group: 'Kidney Function Test' },
    { paramName: 'CALCIUM (TOTAL)', unit: 'mg/dl', referenceRange: '8.6 - 10.2', group: 'Kidney Function Test' },
    { paramName: 'PHOSPHORUS', unit: 'mg/dl', referenceRange: '2.5 - 4.5', group: 'Kidney Function Test' }
  ];

  const lipidParams = [
    { paramName: 'TOTAL CHOLESTEROL', unit: 'mg/dl', referenceRange: '130 - 200', group: 'Lipid Profile' },
    { paramName: 'TRIGLYCERIDES', unit: 'mg/dl', referenceRange: '30 - 150', group: 'Lipid Profile' },
    { paramName: 'HDL CHOLESTEROL', unit: 'mg/dl', referenceRange: '40 - 60', group: 'Lipid Profile' },
    { paramName: 'LDL CHOLESTEROL', unit: 'mg/dl', referenceRange: '70 - 130', group: 'Lipid Profile' },
    { paramName: 'VLDL CHOLESTEROL', unit: 'mg/dl', referenceRange: '5 - 30', group: 'Lipid Profile' },
    { paramName: 'TOTAL CHOL / HDL RATIO', unit: 'Ratio', referenceRange: '3.3 - 5.0', group: 'Lipid Profile' },
    { paramName: 'LDL / HDL RATIO', unit: 'Ratio', referenceRange: '0.5 - 3.0', group: 'Lipid Profile' }
  ];

  const thyroidParams = [
    { paramName: 'TRI-IODOTHYRONINE (T3)', unit: 'ng/ml', referenceRange: '0.58 - 1.59', group: 'Thyroid Profile' },
    { paramName: 'THYROXINE (T4)', unit: 'ug/dl', referenceRange: '4.87 - 11.72', group: 'Thyroid Profile' },
    { paramName: 'TSH', unit: 'uIU/ml', referenceRange: '0.35 - 4.94', group: 'Thyroid Profile' }
  ];

  const widalParams = [
    { paramName: 'Salmonella Typhi O', unit: 'Titre', referenceRange: 'Negative', group: 'Widal Test' },
    { paramName: 'Salmonella Typhi H', unit: 'Titre', referenceRange: 'Negative', group: 'Widal Test' },
    { paramName: 'Salmonella Paratyphi AH', unit: 'Titre', referenceRange: 'Negative', group: 'Widal Test' },
    { paramName: 'Salmonella Paratyphi BH', unit: 'Titre', referenceRange: 'Negative', group: 'Widal Test' },
    { paramName: 'WIDAL IMPRESSION', unit: '', referenceRange: 'Negative', group: 'Widal Test' }
  ];

  const rbsParams = [
    { paramName: 'BLOOD SUGAR (RANDOM)', unit: 'mg/dl', referenceRange: '70 - 140', group: 'Biochemistry' }
  ];
  
  const fbsParams = [
    { paramName: 'BLOOD SUGAR (FASTING)', unit: 'mg/dl', referenceRange: '70 - 100', group: 'Biochemistry' },
    { paramName: 'URINE SUGAR (FASTING)', unit: '', referenceRange: 'Absent', group: 'Biochemistry' }
  ];

  const map = {
    'LFT (Liver Function Test)': lftParams,
    'KFT / RFT (Renal Function Test)': kftParams,
    'Lipid Profile': lipidParams,
    'Thyroid Profile (T3, T4, TSH)': thyroidParams,
    'Widal Test': widalParams,
    'Blood Sugar (Random)': rbsParams,
    'Blood Sugar (Fasting)': fbsParams
  };

  for(let testName of Object.keys(map)) {
    await Test.findOneAndUpdate({ name: testName }, { parameters: map[testName] });
    console.log(`${testName} seeded!`);
  }

  console.log('All extra tests seeded successfully.');
  process.exit();
}
seedMoreTests();
