const cookie = require('cookie');

// Function to set a cookie
function setCookie(res, name, value, days) {
    const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const cookieOptions = {
      maxAge: days * 24 * 60 * 60 * 1000, // Use maxAge instead of expires
      httpOnly: false,
      // You can add more options as needed
    };
    res.setHeader('Set-Cookie', cookie.serialize(name, value, cookieOptions));
  }

// Function to get a cookie
function getCookie(req, name) {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies[name] || null;
}

// Function to delete a cookie
function deleteCookie(res, name) {
  const expires = new Date(0);
  const cookieOptions = {
    expires,
    httpOnly: true,
  };
  res.setHeader('Set-Cookie', cookie.serialize(name, '', cookieOptions));
}

module.exports = { setCookie, getCookie, deleteCookie };

