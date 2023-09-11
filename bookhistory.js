const express = require('express');
const bookHistoryRouter = express.Router();
const { AccountBooks, Books } = require('./models'); // Import your Sequelize models

// Define a route to retrieve and render the book history view
bookHistoryRouter.get('/book-history', async (req, res) => {
  try {
    // Assuming you have a way to identify the currently logged-in user,
    // you can access the user's ID from your authentication system.
    // For example, if you're using Passport.js with a user object in req.user:
    const currentUserId = req.user ? req.user.id : null; // Replace null with a default value or handle the case where the user is not authenticated

    if (currentUserId) {
      // Retrieve the book names associated with the user's account
      const userBooks = await AccountBooks.findAll({
        where: {
          accountId: currentUserId,
        },
        include: {
          model: Books,
          attributes: ['bookName'], // Only retrieve the book name
        },
      });

      // Render the 'bookHistory.ejs' view and pass the userBooks data
      res.render('book_history', { userBooks });
    } else {
      // Handle the case where the user is not authenticated or no user ID is available
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    console.error('Error retrieving book history:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = bookHistoryRouter;
