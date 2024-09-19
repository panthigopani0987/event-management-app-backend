const User = require('../models/userModel');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

//Register a new User
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400), json({ message: "User already exists" });
        }

        const user = new User({
            username,
            email,
            password
        });
        await user.save();
        res.status(201).json({ message: 'User Register' });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user' });
    }
}

//Login user

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });
    } catch (err) {
        res.status(400).json({ error: err });
        console.log(err);
    }
}

module.exports = {
    login,
    register
}