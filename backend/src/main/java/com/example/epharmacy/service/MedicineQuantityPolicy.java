package com.example.epharmacy.service;

import com.example.epharmacy.entity.Medicine;
import com.example.epharmacy.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MedicineQuantityPolicy {

    @Value("${medicine.quantity.limit:100}")
    private long quantityLimit;

    @Value("${medicine.prescription.quantity.limit:200}")
    private long prescriptionQuantityLimit;

    public long getQuantityLimit() {
        return quantityLimit;
    }

    public long getPrescriptionQuantityLimit() {
        return prescriptionQuantityLimit;
    }

    public boolean isPrescriptionRequired(Medicine medicine, int packQuantity) {
        long individualUnits = (long) packQuantity * (medicine.getUnitsPerPack() > 0 ? medicine.getUnitsPerPack() : 1);
        return Boolean.TRUE.equals(medicine.getRequiresPrescription()) || individualUnits > quantityLimit;
    }

    public boolean exceedsLimit(Medicine medicine, int packQuantity) {
        long individualUnits = (long) packQuantity * (medicine.getUnitsPerPack() > 0 ? medicine.getUnitsPerPack() : 1);
        return individualUnits > quantityLimit;
    }

    public boolean exceedsPrescriptionLimit(Medicine medicine, int packQuantity) {
        long individualUnits = (long) packQuantity * (medicine.getUnitsPerPack() > 0 ? medicine.getUnitsPerPack() : 1);
        return individualUnits > prescriptionQuantityLimit;
    }

    public void validate(Medicine medicine, int packQuantity, boolean hasValidPrescription) {
        long individualUnits = (long) packQuantity * (medicine.getUnitsPerPack() > 0 ? medicine.getUnitsPerPack() : 1);

        if (individualUnits > prescriptionQuantityLimit) {
            throw new BadRequestException("Quantity limit exceeded. The maximum limit is "
                    + prescriptionQuantityLimit + " units per order, even with an approved prescription.");
        }

        boolean rxRequired = Boolean.TRUE.equals(medicine.getRequiresPrescription());
        boolean highQuantity = individualUnits > quantityLimit;

        if ((rxRequired || highQuantity) && !hasValidPrescription) {
            if (rxRequired) {
                throw new BadRequestException("An approved doctor prescription is required to purchase "
                        + medicine.getName() + ".");
            } else {
                throw new BadRequestException("Quantity limit exceeded. Purchasing more than "
                        + quantityLimit + " units of " + medicine.getName()
                        + " requires an approved doctor prescription.");
            }
        }
    }
}

