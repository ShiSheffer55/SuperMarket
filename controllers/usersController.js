const bcrypt = require('bcrypt');
const User = require('../models/user');

// Render login form
const renderLoginForm = (req, res) => {
    res.render('login');
};

// Render register form
const renderRegisterForm = (req, res) => {
    res.render('register');
};



// Handle user registration
const registerUser = async (req, res) => {
    const { userName, fName, lName, password, gmail, tel, city, isLivesInCenter, role } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.render('register', {
                error_msg: 'Username already exists'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            userName,
            fName,
            lName,
            password: hashedPassword,
            gmail,
            tel,
            city,
            isLivesInCenter,
            role
        });

        // Save the new user to the database
        await newUser.save();

        // Redirect to the login page with a success message
        res.render('login', {
            success_msg: 'You are now registered and can log in'
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.render('register', {
            error_msg: 'Error registering user'
        });
    }
};

// Handle user login
const loginUser = async (req, res) => {
    const { userName, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ userName });

        if (!user) {
            console.log('User not found');
            return res.render('login', {
                error_msg: 'Invalid username or password'
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('Password does not match');
            return res.render('login', {
                error_msg: 'Invalid username or password'
            });
        }

        // Set session
        req.session.user = {
            _id: user._id,
            userName: user.userName,
            role: user.role
        };

        res.redirect('/');
    } catch (err) {
        console.error('Error logging in:', err);
        res.render('login', {
            error_msg: 'Something went wrong'
        });
    }
};

// Handle user logout
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err);
            req.flash('error_msg', 'Something went wrong');
        } else {
            req.flash('success_msg', 'You have been logged out');
        }
        res.redirect('/');
    });
};

// Render the form to add a user
const renderAddUserForm = (req, res) => {
    res.render('admin/addUser', { user: req.session.user });
};

// Handle adding a new user
const addUser = async (req, res) => {
    const newUser = new User(req.body);

    try {
        await newUser.save();
        req.flash('success_msg', 'User added successfully');
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Error adding user:', err);
        req.flash('error_msg', 'Failed to add user');
        res.redirect('/admin/users/add');
    }
};

// Render the form to edit a user
const renderEditUserForm = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash('error_msg', 'User not found');
            return res.redirect('/admin/users');
        }
        res.render('admin/editUser', { user, user: req.session.user });
    } catch (err) {
        console.error('Error fetching user:', err);
        req.flash('error_msg', 'Failed to fetch user');
        res.redirect('/admin/users');
    }
};

// Handle updating a user
const updateUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        req.flash('success_msg', 'User updated successfully');
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Error updating user:', err);
        req.flash('error_msg', 'Failed to update user');
        res.redirect(`/admin/users/edit/${req.params.id}`);
    }
};

// Handle deleting a user
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'User deleted successfully');
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Error deleting user:', err);
        req.flash('error_msg', 'Failed to delete user');
        res.redirect('/admin/users');
    }
};

// Handle searching users
const searchUsers = async (req, res) => {
    const query = req.query.q;
    try {
        const users = await User.find({
            $or: [
                { userName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        });
        res.render('admin/adminUsers', { users, user: req.session.user });
    } catch (err) {
        console.error('Error searching users:', err);
        req.flash('error_msg', 'Failed to search users');
        res.redirect('/admin/users');
    }
};

// Export all functions at the end
module.exports = {
    renderLoginForm,
    renderRegisterForm,
    loginUser,
    registerUser,
    logoutUser,
    renderAddUserForm,
    addUser,
    renderEditUserForm,
    updateUser,
    deleteUser,
    searchUsers
};
