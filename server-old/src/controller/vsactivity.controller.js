
const stadevs = async (req, res) => {
    try {
        console.log(req.body);
    } catch (err) {
        res.status(500).json({ message: 'Error in vs acativity', error: err.message });
    }
};
module.exports = {
    stadevs
};