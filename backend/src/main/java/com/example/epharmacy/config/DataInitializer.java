package com.example.epharmacy.config;

import com.example.epharmacy.entity.Category;
import com.example.epharmacy.entity.Medicine;
import com.example.epharmacy.entity.RoleName;
import com.example.epharmacy.entity.User;
import com.example.epharmacy.repository.CategoryRepository;
import com.example.epharmacy.repository.MedicineRepository;
import com.example.epharmacy.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/** Seeds the initial administrator and fictional Indian e-pharmacy demo catalog. */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final MedicineRepository medicineRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CategoryRepository categoryRepository,
                           MedicineRepository medicineRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.medicineRepository = medicineRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findAll().stream().noneMatch(user -> user.getRole() == RoleName.ROLE_ADMIN)) {
            userRepository.save(new User(
                    "Administrator",
                    "admin@epharmacy.com",
                    passwordEncoder.encode("Admin@123"),
                    null,
                    null,
                    RoleName.ROLE_ADMIN
            ));
        }

        if (categoryRepository.count() == 0 && medicineRepository.count() == 0) {
            seedDemoCatalog();
        }
    }

    private void seedDemoCatalog() {
        Category fever = category("Fever & Pain Relief", "Antipyretics, analgesics, and anti-inflammatory formulations for acute pain and fever management.");
        Category cold = category("Cold, Cough & Allergy", "Decongestants, non-drowsy syrups, and antihistamines for respiratory allergies and seasonal flu.");
        Category digestive = category("Digestive & Gastric Care", "Antacids, digestive enzymes, anti-flatulents, and proton pump inhibitors for gastrointestinal wellness.");
        Category diabetes = category("Diabetes Care", "Oral anti-diabetic therapeutics, herbal Swaras, and glycemic stabilizers for daily blood glucose regulation.");
        Category heart = category("Heart & Blood Pressure", "Cardiovascular formulations, lipid regulators, and blood pressure management therapies.");
        Category skin = category("Skin & Dermatology", "Dermatological cleansers, barrier repair lotions, and medicated topical applications.");
        Category vitamins = category("Vitamins & Supplements", "Vital micronutrients, high-potency multivitamins, and bone density mineral supplements.");

        add("Paracip Calmer 650", "AuraPharma", "Paracetamol IP 650mg", "650mg", "tablets", 15,
                "Fictional antipyretic and analgesic formulation for temporary relief of mild to moderate fever and body aches.", "39.00", 120, fever, false, "Fever and body aches", "BEST SELLER");
        add("Ibugesic Forte 400", "Zenith Remedies", "Ibuprofen 400mg + Paracetamol 325mg", "400mg/325mg", "tablets", 10,
                "Fictional dual-action analgesic formulation for muscular stiffness, headache, and dental pain discomfort.", "65.00", 85, fever, false, "Body ache and muscle pain", "POPULAR");
        add("Toradol Spasm Relief Rx", "AuraPharma", "Ketorolac Tromethamine 10mg", "10mg", "tablets", 10,
                "Fictional acute severe pain formulation. Dispensed strictly upon submission of an approved medical practitioner prescription.", "145.00", 25, fever, true, "Severe acute pain", "RX REQUIRED");

        add("Kofnil Herbal Expecto", "Herbora India", "Tulsi, Vasaka, Honey & Licorice Extract", "100 ml", "bottle", 1,
                "Fictional non-drowsy herbal cough syrup formulated for soothing chest congestion, dry cough, and irritation.", "98.00", 60, cold, false, "Cough and throat irritation", "BEST SELLER");
        add("Cetrizet All-Day 10", "Zenith Remedies", "Cetirizine Hydrochloride 10mg", "10mg", "tablets", 10,
                "Fictional 24-hour antihistamine tablet for effective relief of seasonal allergic rhinitis, sneezing, and watery eyes.", "45.00", 95, cold, false, "Allergy and sneezing", "POPULAR");
        add("Montelukast-L Allero Rx", "Vitalis Biotech", "Montelukast Sodium 10mg + Levocetirizine 5mg", "15mg", "tablets", 10,
                "Fictional combination broncho-allergic therapy for chronic evening cough and allergy flare-ups. Prescription required.", "185.00", 30, cold, true, "Chronic allergic rhinitis", "RX REQUIRED");

        add("GastroGuard Gel Mint", "AuraPharma", "Magaldrate 480mg + Simethicone 20mg", "200 ml", "bottle", 1,
                "Fictional fast-acting cooling antacid suspension for heartburn relief, hyperacidity, and gastric gas distress.", "125.00", 75, digestive, false, "Acidity and heartburn", "BEST SELLER");
        add("Isabgol Cleanse Husk", "Herbora India", "Natural Psyllium Husk 99% Pure Grade", "100 g", "jar", 1,
                "Fictional soluble dietary fiber supplement supporting regular bowel motility, gut microbiome health, and digestive ease.", "160.00", 40, digestive, false, "Constipation and digestive health", "POPULAR");
        add("PantoShield DSR Rx", "Vitalis Biotech", "Pantoprazole Sodium 40mg + Domperidone 30mg SR", "70mg", "capsules", 10,
                "Fictional sustained-release gastro-resistant formulation for severe GERD, acid reflux, and nausea relief. Prescription mandated.", "195.00", 4, digestive, true, "GERD and acid peptic disorder", "LOW STOCK");

        add("GlucoShield Met 500", "Vitalis Biotech", "Metformin Hydrochloride IP 500mg (SR)", "500mg", "tablets", 20,
                "Fictional sustained-release glycemic management formulation supporting healthy insulin sensitivity and blood glucose balance.", "82.00", 150, diabetes, true, "Type 2 diabetes care", "RX REQUIRED");
        add("DiaVeda Karela Jamun Swaras", "Herbora India", "Wild Karela & Jamun Seed Cold-Pressed Juice", "500 ml", "bottle", 1,
                "Fictional traditional botanical juice supporting healthy metabolic rate, carbohydrate balance, and natural detoxification.", "249.00", 45, diabetes, false, "Metabolic & glycemic wellness", "POPULAR");
        add("TeneliCare M 20/500 Rx", "Vitalis Biotech", "Teneligliptin 20mg + Metformin 500mg", "20mg/500mg", "tablets", 15,
                "Fictional dual oral anti-diabetic therapy for postprandial glucose stability. Registered prescription required.", "290.00", 0, diabetes, true, "Type 2 diabetes care", "SPECIAL OFFER");

        add("CardioProtect Atorva 10", "Vitalis Biotech", "Atorvastatin Calcium IP 10mg", "10mg", "tablets", 15,
                "Fictional lipid regulator formulation supporting healthy cholesterol profiles, LDL control, and cardiovascular wellness.", "135.00", 90, heart, true, "Cholesterol & heart care", "RX REQUIRED");
        add("TelmiPress 40 Duo Rx", "Zenith Remedies", "Telmisartan IP 40mg", "40mg", "tablets", 15,
                "Fictional angiotensin receptor blocker formulation for systematic daily blood pressure maintenance and vascular elasticity.", "115.00", 80, heart, true, "Hypertension & BP care", "RX REQUIRED");
        add("Arjuna Heart Elixir", "Herbora India", "Terminalia Arjuna Bark Extract 500mg", "500mg", "capsules", 60,
                "Fictional botanical cardiac tonic formulated to support strong heart muscle contractions, healthy rhythm, and vascular tone.", "349.00", 6, heart, false, "Cardiovascular vitality", "LOW STOCK");

        add("DermaCalm Calamine Zinc Lotion", "DermaCare Labs", "Calamine 8% + Zinc Oxide 3% + Aloe Vera Gel", "100 ml", "bottle", 1,
                "Fictional soothing antipruritic lotion for heat rash, insect bites, prickly heat, and mild sunburn irritation.", "110.00", 65, skin, false, "Skin irritation & heat rash", "BEST SELLER");
        add("SkinGlow Niacinamide Gel 10%", "DermaCare Labs", "Niacinamide 10% + Zinc PCA 1%", "50 ml", "tube", 1,
                "Fictional clarifying dermatological serum gel for minimizing enlarged pores, dark marks, and balancing excess skin oil.", "285.00", 42, skin, false, "Skin blemishes & oil control", "NEW");
        add("Clindacort Acne Gel Rx", "DermaCare Labs", "Clindamycin Phosphate 1% + Nicotinamide 4%", "20 g", "tube", 1,
                "Fictional topical antibacterial dermatological gel for inflammatory acne vulgaris and redness. Prescription required.", "175.00", 22, skin, true, "Acne and skin infection", "RX REQUIRED");

        add("VitaImmuno C+Zinc Chewables", "NutriVeda Labs", "Vitamin C 500mg + Zinc 10mg + Citrus Bioflavonoids", "500mg", "chewable tablets", 30,
                "Fictional tangy orange chewable tablets for cellular antioxidant defense, cold defense, and daily vitality boost.", "129.00", 110, vitamins, false, "Immunity and antioxidant health", "BEST SELLER");
        add("CalciD3 Max Bone Care", "NutriVeda Labs", "Calcium Carbonate 1250mg + Cholecalciferol (D3) 500 IU", "1250mg", "tablets", 30,
                "Fictional dietary bone mineral supplement supporting bone mineral density, joint cartilage, and muscle flexibility.", "199.00", 85, vitamins, false, "Bone and joint strength", "POPULAR");
        add("NeuroB-Complex Active", "NutriVeda Labs", "Methylcobalamin 1500mcg + Alpha Lipoic Acid 100mg + B-Complex", "1500mcg", "capsules", 15,
                "Fictional high-potency neurotropic formulation for peripheral nerve health, cellular energy metabolism, and reduced fatigue.", "249.00", 38, vitamins, false, "Nerve health and fatigue relief", "NEW");
    }

    private Category category(String name, String description) {
        return categoryRepository.save(new Category(name, description));
    }

    private void add(String name, String brand, String composition, String dosage, String unitType, int unitsPerPack,
                     String description, String price, int stock, Category category, boolean requiresPrescription,
                     String ailment, String badge) {
        Medicine medicine = new Medicine();
        medicine.setName(name);
        medicine.setBrand(brand);
        medicine.setComposition(composition);
        medicine.setDosage(dosage);
        medicine.setUnitType(unitType);
        medicine.setUnitsPerPack(unitsPerPack);
        medicine.setDescription(description);
        medicine.setPrice(new BigDecimal(price));
        medicine.setStockQuantity(stock);
        medicine.setCategory(category);
        medicine.setRequiresPrescription(requiresPrescription);
        medicine.setImageUrl(switch (category.getName()) {
            case "Fever & Pain Relief" -> "/products/fever-pain.svg";
            case "Cold, Cough & Allergy" -> "/products/cold-cough.svg";
            case "Digestive & Gastric Care" -> "/products/digestive-care.svg";
            case "Diabetes Care" -> "/products/diabetes-care.svg";
            case "Heart & Blood Pressure" -> "/products/heart-bp.svg";
            case "Skin & Dermatology" -> "/products/skin-derma.svg";
            default -> "/products/vitamins-supplements.svg";
        });
        medicine.setAilment(ailment);
        medicine.setBadge(badge);
        medicineRepository.save(medicine);
    }
}
