const saveLocation = async (req, res) => {

    try {

        const { uid, latitude, longitude } = req.body;

        if (!uid || latitude === undefined || longitude === undefined) {

            return res.status(400).json({
                success: false,
                message: "UID, latitude and longitude are required."
            });

        }

        return res.status(201).json({
            success: true,
            message: "Location saved successfully.",
            data: {
                uid,
                latitude,
                longitude
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getLocation = async (req, res) => {

    try {

        const { uid } = req.params;


        return res.status(200).json({
            success: true,
            message: "Location fetched successfully.",
            data: {
                uid,
                latitude: 10.8505,
                longitude: 76.2711
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
    saveLocation,
    getLocation
};