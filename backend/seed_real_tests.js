const mongoose = require('mongoose');
require('dotenv').config();

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'General' },
});

const Test = mongoose.models.Test || mongoose.model('Test', testSchema);

const realTests = [
  { name: 'Heamoglobin', price: 20 },
  { name: 'TLC,DLC', price: 80 },
  { name: 'MP (Slide)', price: 50 },
  { name: 'ESR', price: 50 },
  { name: 'TLC,DLC MP (Slide)', price: 150 },
  { name: 'CBC', price: 200 },
  { name: 'Platelet Count', price: 120 },
  { name: 'AEC', price: 100 },
  { name: 'MP Card (Antigen)', price: 200 },
  { name: 'PBF', price: 250 },
  { name: 'Blood Sugar (Gluco Meter)', price: 40 },
  { name: 'Blood Sugar', price: 30 },
  { name: 'Blood Urea', price: 60 },
  { name: 'Serum Creatinine', price: 60 },
  { name: 'Serum Uric Acid', price: 60 },
  { name: 'Serum Cholestrol', price: 60 },
  { name: 'Serum Bilirubin', price: 60 },
  { name: 'Serum Lipase', price: 400 },
  { name: 'Serum ALK Phophatase', price: 100 },
  { name: 'S.G.O.T.', price: 60 },
  { name: 'S.G.P.T.', price: 60 },
  { name: 'Serum Amylase', price: 250 },
  { name: 'Serum Triglycerides', price: 150 },
  { name: 'VDRL', price: 150 },
  { name: 'Serum Total Protein(TSP,DSP)', price: 150 },
  { name: 'HbsAg(Card)', price: 150 },
  { name: 'HCV(Card)', price: 300 },
  { name: 'HIV(Card)', price: 300 },
  { name: 'CRP (Slide)', price: 150 },
  { name: 'CRP (Quantitative)', price: 300 },
  { name: 'ASO (Slide)', price: 200 },
  { name: 'ASO (Titre)', price: 350 },
  { name: 'V.D.R.L. Card', price: 150 },
  { name: 'R.A.Factor (Slide)', price: 100 },
  { name: 'R.A. Factor (Quantitative Local)', price: 400 },
  { name: 'Widal (Slide)', price: 70 },
  { name: 'Widal (Card)', price: 300 },
  { name: 'Dengu Card', price: 600 },
  { name: 'Chikungunya', price: 600 },
  { name: 'T3-T4-TSH', price: 400 },
  { name: 'Culture & Senstivity(Urine)', price: 250 },
  { name: 'BT-CT', price: 70 },
  { name: 'R.F.T(B.U,S.Cr,S. Cal, U.A)', price: 250 },
  { name: 'L.F.T.(S.Bill.,OT,PT,S.ALP,TSP,DSP)', price: 300 },
  { name: 'Lipid Profile', price: 300 },
  { name: 'Semen Test', price: 100 },
  { name: 'Montoux Test', price: 150 },
  { name: 'Serum Electrolytes', price: 300 },
  { name: 'Serum Calcium', price: 100 },
  { name: 'HbA1c', price: 400 },
  { name: 'Urine Complete', price: 50 },
  { name: 'Urine Pregnancy', price: 80 },
  { name: 'Stool For Ova & Cyst', price: 100 },
  { name: 'Stool For Occult Blood', price: 250 },
  { name: 'Blood Group', price: 50 },
  { name: 'CPK MB', price: 350 },
  { name: 'APTT', price: 300 },
  { name: 'PTI', price: 200 },
  { name: 'Phosphorous', price: 150 },
  { name: 'Trop-I', price: 800 },
  { name: 'Trop-T', price: 1000 },
  { name: 'Toxoplasma', price: 350 },
  { name: 'Coombs Test Direct', price: 400 },
  { name: 'Coombs Test Indirect', price: 400 },
  { name: 'Vitamin -D', price: 800 },
  { name: 'Vitamin -B/12', price: 700 },
  { name: 'LH', price: 350 },
  { name: 'FSH', price: 350 },
  { name: 'PROLACTIN', price: 350 },
  { name: 'FREE TFT', price: 550 },
  { name: 'TESTO', price: 550 },
  { name: 'TPO', price: 1000 }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic-slip');
  
  // Clear old tests
  await Test.deleteMany({});
  
  // Insert new tests
  await Test.insertMany(realTests);
  console.log('Real tests from image seeded successfully!');
  
  process.exit();
}

run();
