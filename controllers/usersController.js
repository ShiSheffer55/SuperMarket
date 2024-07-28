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
    const { userName, fName, lName, email, password, tel, city } = req.body;

    try {
        // Hash the password if it's provided
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        // Prepare update object
        const updateData = {
            userName,
            fName,
            lName,
            email,
            tel,
            city
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
        await User.findByIdAndDelete(req.params.id);
        // Redirect with a success message in the query parameters
        res.redirect('/admin/users?success=User deleted successfully!');
    } catch (error) {
        console.error('Error deleting user:', error);
        // Redirect with an error message in the query parameters
        res.redirect('/admin/users?error=Failed to delete user');
    }
};


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
        // Redirect with an error message in the query parameters
        res.redirect('/admin/users?error=Failed to search users');
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
