USE NEW_PHAR;

-- 1. Update Categories to New Indian Pharmacy Categories
UPDATE categories SET 
  name = 'Fever & Pain Relief', 
  description = 'Antipyretics, analgesics, and anti-inflammatory formulations for acute pain and fever management.' 
WHERE id = 1;

UPDATE categories SET 
  name = 'Cold, Cough & Allergy', 
  description = 'Decongestants, non-drowsy syrups, and antihistamines for respiratory allergies and seasonal flu.' 
WHERE id = 2;

UPDATE categories SET 
  name = 'Digestive & Gastric Care', 
  description = 'Antacids, digestive enzymes, anti-flatulents, and proton pump inhibitors for gastrointestinal wellness.' 
WHERE id = 3;

UPDATE categories SET 
  name = 'Diabetes Care', 
  description = 'Oral anti-diabetic therapeutics, herbal Swaras, and glycemic stabilizers for daily blood glucose regulation.' 
WHERE id = 4;

UPDATE categories SET 
  name = 'Heart & Blood Pressure', 
  description = 'Cardiovascular formulations, lipid regulators, and blood pressure management therapies.' 
WHERE id = 5;

UPDATE categories SET 
  name = 'Skin & Dermatology', 
  description = 'Dermatological cleansers, barrier repair lotions, and medicated topical applications.' 
WHERE id = 6;

UPDATE categories SET 
  name = 'Vitamins & Supplements', 
  description = 'Vital micronutrients, high-potency multivitamins, and bone density mineral supplements.' 
WHERE id = 7;

-- 2. Update First 14 Medicines with New Fictional Indian Formulations
UPDATE medicines SET
  name = 'Paracip Calmer 650',
  brand = 'AuraPharma',
  composition = 'Paracetamol IP 650mg',
  dosage = '650mg',
  unit_type = 'tablets',
  units_per_pack = 15,
  description = 'Fictional antipyretic and analgesic formulation for temporary relief of mild to moderate fever and body aches. Follow packaging dosage.',
  price = 39.00,
  stock_quantity = 120,
  category_id = 1,
  requires_prescription = 0,
  image_url = '/products/fever-pain.svg',
  ailment = 'Fever and body aches',
  badge = 'BEST SELLER',
  updated_at = NOW()
WHERE id = 1;

UPDATE medicines SET
  name = 'Ibugesic Forte 400',
  brand = 'Zenith Remedies',
  composition = 'Ibuprofen 400mg + Paracetamol 325mg',
  dosage = '400mg/325mg',
  unit_type = 'tablets',
  units_per_pack = 10,
  description = 'Fictional dual-action analgesic formulation for muscular stiffness, headache, and dental pain discomfort.',
  price = 65.00,
  stock_quantity = 85,
  category_id = 1,
  requires_prescription = 0,
  image_url = '/products/fever-pain.svg',
  ailment = 'Body ache and muscle pain',
  badge = 'POPULAR',
  updated_at = NOW()
WHERE id = 2;

UPDATE medicines SET
  name = 'Toradol Spasm Relief Rx',
  brand = 'AuraPharma',
  composition = 'Ketorolac Tromethamine 10mg',
  dosage = '10mg',
  unit_type = 'tablets',
  units_per_pack = 10,
  description = 'Fictional acute severe pain formulation. Dispensed strictly upon submission of an approved medical practitioner prescription.',
  price = 145.00,
  stock_quantity = 25,
  category_id = 1,
  requires_prescription = 1,
  image_url = '/products/fever-pain.svg',
  ailment = 'Severe acute pain',
  badge = 'RX REQUIRED',
  updated_at = NOW()
WHERE id = 3;

UPDATE medicines SET
  name = 'Kofnil Herbal Expecto',
  brand = 'Herbora India',
  composition = 'Tulsi, Vasaka, Honey & Licorice Extract',
  dosage = '100 ml',
  unit_type = 'bottle',
  units_per_pack = 1,
  description = 'Fictional non-drowsy herbal cough syrup formulated for soothing chest congestion, dry cough, and irritation.',
  price = 98.00,
  stock_quantity = 60,
  category_id = 2,
  requires_prescription = 0,
  image_url = '/products/cold-cough.svg',
  ailment = 'Cough and throat irritation',
  badge = 'BEST SELLER',
  updated_at = NOW()
WHERE id = 4;

UPDATE medicines SET
  name = 'Cetrizet All-Day 10',
  brand = 'Zenith Remedies',
  composition = 'Cetirizine Hydrochloride 10mg',
  dosage = '10mg',
  unit_type = 'tablets',
  units_per_pack = 10,
  description = 'Fictional 24-hour antihistamine tablet for effective relief of seasonal allergic rhinitis, sneezing, and itchy watery eyes.',
  price = 45.00,
  stock_quantity = 95,
  category_id = 2,
  requires_prescription = 0,
  image_url = '/products/cold-cough.svg',
  ailment = 'Allergy and sneezing',
  badge = 'POPULAR',
  updated_at = NOW()
WHERE id = 5;

UPDATE medicines SET
  name = 'Montelukast-L Allero Rx',
  brand = 'Vitalis Biotech',
  composition = 'Montelukast Sodium 10mg + Levocetirizine 5mg',
  dosage = '15mg',
  unit_type = 'tablets',
  units_per_pack = 10,
  description = 'Fictional combination broncho-allergic therapy for chronic evening cough and allergy flare-ups. Prescription required.',
  price = 185.00,
  stock_quantity = 30,
  category_id = 2,
  requires_prescription = 1,
  image_url = '/products/cold-cough.svg',
  ailment = 'Chronic allergic rhinitis',
  badge = 'RX REQUIRED',
  updated_at = NOW()
WHERE id = 6;

UPDATE medicines SET
  name = 'GastroGuard Gel Mint',
  brand = 'AuraPharma',
  composition = 'Magaldrate 480mg + Simethicone 20mg',
  dosage = '200 ml',
  unit_type = 'bottle',
  units_per_pack = 1,
  description = 'Fictional fast-acting sugar-free cooling antacid suspension for heartburn relief, hyperacidity, and gastric gas distress.',
  price = 125.00,
  stock_quantity = 75,
  category_id = 3,
  requires_prescription = 0,
  image_url = '/products/digestive-care.svg',
  ailment = 'Acidity and heartburn',
  badge = 'BEST SELLER',
  updated_at = NOW()
WHERE id = 7;

UPDATE medicines SET
  name = 'Isabgol Cleanse Husk',
  brand = 'Herbora India',
  composition = 'Natural Psyllium Husk 99% Pure Grade',
  dosage = '100 g',
  unit_type = 'jar',
  units_per_pack = 1,
  description = 'Fictional soluble dietary fiber supplement supporting regular bowel motility, gut microbiome health, and digestive ease.',
  price = 160.00,
  stock_quantity = 40,
  category_id = 3,
  requires_prescription = 0,
  image_url = '/products/digestive-care.svg',
  ailment = 'Constipation and digestive health',
  badge = 'POPULAR',
  updated_at = NOW()
WHERE id = 8;

UPDATE medicines SET
  name = 'PantoShield DSR Rx',
  brand = 'Vitalis Biotech',
  composition = 'Pantoprazole Sodium 40mg + Domperidone 30mg SR',
  dosage = '70mg',
  unit_type = 'capsules',
  units_per_pack = 10,
  description = 'Fictional sustained-release gastro-resistant formulation for severe GERD, acid reflux, and nausea relief. Prescription mandated.',
  price = 195.00,
  stock_quantity = 4,
  category_id = 3,
  requires_prescription = 1,
  image_url = '/products/digestive-care.svg',
  ailment = 'GERD and acid peptic disorder',
  badge = 'LOW STOCK',
  updated_at = NOW()
WHERE id = 9;

UPDATE medicines SET
  name = 'GlucoShield Met 500',
  brand = 'Vitalis Biotech',
  composition = 'Metformin Hydrochloride IP 500mg (SR)',
  dosage = '500mg',
  unit_type = 'tablets',
  units_per_pack = 20,
  description = 'Fictional sustained-release glycemic management formulation supporting healthy insulin sensitivity and blood glucose balance.',
  price = 82.00,
  stock_quantity = 150,
  category_id = 4,
  requires_prescription = 1,
  image_url = '/products/diabetes-care.svg',
  ailment = 'Type 2 diabetes care',
  badge = 'RX REQUIRED',
  updated_at = NOW()
WHERE id = 10;

UPDATE medicines SET
  name = 'DiaVeda Karela Jamun Swaras',
  brand = 'Herbora India',
  composition = 'Wild Karela & Jamun Seed Cold-Pressed Juice',
  dosage = '500 ml',
  unit_type = 'bottle',
  units_per_pack = 1,
  description = 'Fictional traditional botanical juice supporting healthy metabolic rate, carbohydrate balance, and natural detoxification.',
  price = 249.00,
  stock_quantity = 45,
  category_id = 4,
  requires_prescription = 0,
  image_url = '/products/diabetes-care.svg',
  ailment = 'Metabolic & glycemic wellness',
  badge = 'POPULAR',
  updated_at = NOW()
WHERE id = 11;

UPDATE medicines SET
  name = 'TeneliCare M 20/500 Rx',
  brand = 'Vitalis Biotech',
  composition = 'Teneligliptin 20mg + Metformin 500mg',
  dosage = '20mg/500mg',
  unit_type = 'tablets',
  units_per_pack = 15,
  description = 'Fictional dual oral anti-diabetic therapy for postprandial glucose stability. Registered prescription required.',
  price = 290.00,
  stock_quantity = 0,
  category_id = 4,
  requires_prescription = 1,
  image_url = '/products/diabetes-care.svg',
  ailment = 'Type 2 diabetes care',
  badge = 'SPECIAL OFFER',
  updated_at = NOW()
WHERE id = 12;

UPDATE medicines SET
  name = 'CardioProtect Atorva 10',
  brand = 'Vitalis Biotech',
  composition = 'Atorvastatin Calcium IP 10mg',
  dosage = '10mg',
  unit_type = 'tablets',
  units_per_pack = 15,
  description = 'Fictional lipid regulator formulation supporting healthy cholesterol profiles, LDL control, and cardiovascular wellness.',
  price = 135.00,
  stock_quantity = 90,
  category_id = 5,
  requires_prescription = 1,
  image_url = '/products/heart-bp.svg',
  ailment = 'Cholesterol & heart care',
  badge = 'RX REQUIRED',
  updated_at = NOW()
WHERE id = 13;

UPDATE medicines SET
  name = 'TelmiPress 40 Duo Rx',
  brand = 'Zenith Remedies',
  composition = 'Telmisartan IP 40mg',
  dosage = '40mg',
  unit_type = 'tablets',
  units_per_pack = 15,
  description = 'Fictional angiotensin receptor blocker formulation for systematic daily blood pressure maintenance and vascular elasticity.',
  price = 115.00,
  stock_quantity = 80,
  category_id = 5,
  requires_prescription = 1,
  image_url = '/products/heart-bp.svg',
  ailment = 'Hypertension & BP care',
  badge = 'RX REQUIRED',
  updated_at = NOW()
WHERE id = 14;

-- 3. Insert Remaining 7 Fictional Indian Formulations (IDs 15 to 21)
INSERT INTO medicines (id, name, brand, composition, dosage, unit_type, units_per_pack, description, price, stock_quantity, category_id, requires_prescription, image_url, ailment, badge, created_at, updated_at)
VALUES
(15, 'Arjuna Heart Elixir', 'Herbora India', 'Terminalia Arjuna Bark Extract 500mg', '500mg', 'capsules', 60,
 'Fictional botanical cardiac tonic formulated to support strong heart muscle contractions, healthy rhythm, and vascular tone.',
 349.00, 6, 5, 0, '/products/heart-bp.svg', 'Cardiovascular vitality', 'LOW STOCK', NOW(), NOW()),

(16, 'DermaCalm Calamine Zinc Lotion', 'DermaCare Labs', 'Calamine 8% + Zinc Oxide 3% + Aloe Vera Gel', '100 ml', 'bottle', 1,
 'Fictional soothing antipruritic lotion for heat rash, insect bites, prickly heat, and mild sunburn irritation.',
 110.00, 65, 6, 0, '/products/skin-derma.svg', 'Skin irritation & heat rash', 'BEST SELLER', NOW(), NOW()),

(17, 'SkinGlow Niacinamide Gel 10%', 'DermaCare Labs', 'Niacinamide 10% + Zinc PCA 1%', '50 ml', 'tube', 1,
 'Fictional clarifying dermatological serum gel for minimizing enlarged pores, dark marks, and balancing excess skin oil.',
 285.00, 42, 6, 0, '/products/skin-derma.svg', 'Skin blemishes & oil control', 'NEW', NOW(), NOW()),

(18, 'Clindacort Acne Gel Rx', 'DermaCare Labs', 'Clindamycin Phosphate 1% + Nicotinamide 4%', '20 g', 'tube', 1,
 'Fictional topical antibacterial dermatological gel for inflammatory acne vulgaris and redness. Prescription required.',
 175.00, 22, 6, 1, '/products/skin-derma.svg', 'Acne and skin infection', 'RX REQUIRED', NOW(), NOW()),

(19, 'VitaImmuno C+Zinc Chewables', 'NutriVeda Labs', 'Vitamin C 500mg + Zinc 10mg + Citrus Bioflavonoids', '500mg', 'chewable tablets', 30,
 'Fictional tangy orange chewable tablets for cellular antioxidant defense, cold defense, and daily vitality boost.',
 129.00, 110, 7, 0, '/products/vitamins-supplements.svg', 'Immunity and antioxidant health', 'BEST SELLER', NOW(), NOW()),

(20, 'CalciD3 Max Bone Care', 'NutriVeda Labs', 'Calcium Carbonate 1250mg + Cholecalciferol (D3) 500 IU', '1250mg', 'tablets', 30,
 'Fictional dietary bone mineral supplement supporting bone mineral density, joint cartilage, and muscle flexibility.',
 199.00, 85, 7, 0, '/products/vitamins-supplements.svg', 'Bone and joint strength', 'POPULAR', NOW(), NOW()),

(21, 'NeuroB-Complex Active', 'NutriVeda Labs', 'Methylcobalamin 1500mcg + Alpha Lipoic Acid 100mg + B-Complex', '1500mcg', 'capsules', 15,
 'Fictional high-potency neurotropic formulation for peripheral nerve health, cellular energy metabolism, and reduced fatigue.',
 249.00, 38, 7, 0, '/products/vitamins-supplements.svg', 'Nerve health and fatigue relief', 'NEW', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  brand = VALUES(brand),
  composition = VALUES(composition),
  dosage = VALUES(dosage),
  unit_type = VALUES(unit_type),
  units_per_pack = VALUES(units_per_pack),
  description = VALUES(description),
  price = VALUES(price),
  stock_quantity = VALUES(stock_quantity),
  category_id = VALUES(category_id),
  requires_prescription = VALUES(requires_prescription),
  image_url = VALUES(image_url),
  ailment = VALUES(ailment),
  badge = VALUES(badge),
  updated_at = NOW();

-- Clear any stale cart items pointing to old tests so cart starts fresh
DELETE FROM cart_items;
