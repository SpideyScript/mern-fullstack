const ProviderProfile =
    require("../models/ProviderProfile");

exports.createProfile = async (req, res) => {

    try {

        const {
            serviceCategory,
            experience,
            city,
            description
        } = req.body;

        const existingProfile =
            await ProviderProfile.findOne({
                userId: req.user._id
            });

        if (existingProfile) {

            return res.status(400).json({
                message: "Profile already exists"
            });

        }

        const profile =
            await ProviderProfile.create({

                userId: req.user._id,

                serviceCategory,
                experience,
                city,
                description

            });

        res.status(201).json(profile);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};