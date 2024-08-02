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
                error: 'Username already exists'
            });
        }

        // Validate required fields
        if (!userName || !fName || !lName || !password || !gmail || !tel || !city) {
            return res.render('register', {
                error: 'All required fields must be filled'
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

        // Set session for the new user
        req.session.user = {
            _id: newUser._id,
            fName: newUser.fName,
            lName: newUser.lName,
            userName: newUser.userName,
            gmail: newUser.gmail,
            tel: newUser.tel,
            city: newUser.city,
            role: newUser.role
        };

        // Redirect to the home page or any other page you want
        res.redirect('/');
    } catch (err) {
        // Render the registration page with a generic error message
        res.render('register', {
            error: 'Error registering user: ' + err.message
        });
    }
};


const loginUser = async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.render('login', { error: 'שם משתמש שגוי'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'סיסמה שגויה' });
        }

        // Store user data in session
        req.session.user = {
            _id: user._id,
            userName: user.userName,
            fName: user.fName,
            lName: user.lName,
            gmail: user.gmail,
            tel: user.tel,
            city: user.city,
            role: user.role
        };

        res.redirect('/'); // Redirect to a protected route
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Server error');
    }
};



// Handle user logout
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).json({ message: 'Something went wrong' });
        } else {
            res.redirect('/');
        }
    });
};

// Render the form to add a user
const renderAddUserForm = (req, res) => {
    res.render('admin/addUser', { user: req.session.user });
};



const addUser = async (req, res) => {
    const { userName, fName, lName, password, gmail, tel, city, isLivesInCenter, role } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === 'כן' ? 'admin' : 'user';
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
            role: userRole
        });

        // Save the new user to the database
        await newUser.save();
        
        // Redirect to the user management page with a success message in the query parameter
        res.redirect('/admin/users?success=User added successfully!');
    } catch (error) {
        console.error('Error adding user:', error);
        // Redirect to the user management page with an error message in the query parameter
        res.redirect('/admin/users?error=Failed to add user');
    }
};

// Render form to edit user
const renderEditUserForm = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('editUser', { user });
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        req.flash('error_msg', 'Failed to fetch user');
        res.redirect('/admin/users');
    }
};



const updateUser = async (req, res) => {
    const { userName, fName, lName, gmail, password, tel, city, role } = req.body;

    try {
        // Hash the password if it's provided
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const userRole = role === 'כן' ? 'admin' : 'user';
        // Prepare update object
        const updateData = {
            userName,
            fName,
            lName,
            gmail,
            tel,
            city,
            role: userRole
        };
        
        // Include password in the update if it's hashed
        if (hashedPassword) {
            updateData.password = hashedPassword;
        }

        // Update the user
        await User.findByIdAndUpdate(req.params.id, updateData);

        // Redirect with a success message in the query parameters
        res.redirect('/admin/users?success=User updated successfully!');
    } catch (error) {
        console.error('Error updating user:', error);
        // Redirect with an error message in the query parameters
        res.redirect('/admin/users?error=Failed to update user');
    }
};


const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await User.findByIdAndDelete(userId);
        if (result) {
            res.json({ message: 'User deleted successfully!' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};


// Search Users
const searchUsers = async (req, res) => {
    const query = req.query.q;
    try {
        const users = await User.find({
            $or: [
                { userName: { $regex: query, $options: 'i' } },
                { fName: { $regex: query, $options: 'i' } },
                { lName: { $regex: query, $options: 'i' } },
                { gmail: { $regex: query, $options: 'i' } }
            ]
        });
        res.render('adminUsers', { users, user: req.session.user });
    } catch (err) {
        res.render('adminUsers', {
            users: [],
            user: req.session.user,
            error: 'Failed to search users: ' + err.message
        });
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
