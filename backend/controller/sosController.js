const sendSOS = async (req, res) => {

    try {

        const {
            uid,
            latitude,
            longitude,
            message
        } = req.body;

        if (!uid || latitude === undefined || longitude === undefined) {

            return res.status(400).json({
                success: false,
                message: "UID, latitude and longitude are required."
            });

        }

        const sosMessage = message || "Emergency! User needs immediate assistance.";


        return res.status(201).json({
            success: true,
            message: "SOS sent successfully.",
            data: {
                uid,
                latitude,
                longitude,
                message: sosMessage
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getSOS = async (req, res) => {

    try {

        const { uid } = req.params

        return res.status(200).json({
            success: true,
            message: "SOS details fetched successfully.",
            data: {
                uid,
                latitude: 10.8505,
                longitude: 76.2711,
                message: "Emergency! User needs immediate assistance."
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
    sendSOS,
    getSOS
};