const email = "veer2320.be23@chitkara.edu.in";

exports.checkHealth = (req, res) => {
    return res.status(200).json({
        is_success: true,
        official_email: email
    });
};
