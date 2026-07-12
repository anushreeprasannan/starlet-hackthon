const saveMedical = async (req, res) => {

    try {

        const {
            uid,
            bloodGroup,
            allergies,
            medications,
            emergencyContact
        } = req.body;

        if (!uid || !bloodGroup || !emergencyContact) {

            return res.status(400).json({
                success: false,
                message: "UID, blood group and emergency contact are required."
            });

        }

        return res.status(201).json({
            success: true,
            message: "Medical information saved successfully.",
            data: {
                uid,
                bloodGroup,
                allergies,
                medications,
                emergencyContact
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getMedical = async (req, res) => {

    try {

        const { uid } = req.params;


        return res.status(200).json({
            success: true,
            message: "Medical information fetched successfully.",
            data: {
                uid,
                bloodGroup: "O+",
                allergies: "Peanuts",
                medications: "Paracetamol",
                emergencyContact: "+91 9876543210"
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    saveMedical,
    getMedical
};