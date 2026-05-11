const User = require("../models/User");
const FarmProfile = require("../models/FarmProfile");

// ── @GET /api/admin/users ──────────────────────────────────────────
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users except passwords
        const users = await User.find({}).select("-password");

        // Fetch all farm profiles to augment farmer data with crop/farm info (optional)
        const profiles = await FarmProfile.find({});

        // Map profiles by userId for quick lookup
        const profileMap = {};
        profiles.forEach(p => {
            profileMap[p.userId.toString()] = p;
        });

        const enrichedUsers = users.map(user => {
            const pData = profileMap[user._id.toString()];
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                district: user.district || (pData ? pData.district : "N/A"),
                state: user.state || (pData ? pData.state : "N/A"),
                isActive: user.isActive,
                farmSize: pData ? pData.farmSize : null,
                soilType: pData ? pData.soilType : null,
                village: pData && pData.village ? pData.village : "N/A",
                createdAt: user.createdAt
            };
        });

        res.json(enrichedUsers);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};

module.exports = { getAllUsers };
