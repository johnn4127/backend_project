// // Function to set a cookie in the client
// function setClientCookie(name, value, days) {
//     const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
//     document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
//   }
  
//   // Function to get a cookie from the client
//   function getClientCookie(name) {
//     const cookies = document.cookie.split('; ');
//     for (const cookie of cookies) {
//       const [cookieName, cookieValue] = cookie.split('=');
//       if (cookieName === name) {
//         return cookieValue;
//       }
//     }
//     return null;
//   }
  
//   // Function to delete a cookie in the client
//   function deleteClientCookie(name) {
//     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//   }
  
//   module.exports = { setClientCookie, getClientCookie, deleteClientCookie };

  // Function to set a cookie
  function setCookie(name, value, days, path = '/', domain = '') {
    const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const cookieOptions = {
        maxAge: days * 24 * 60 * 60 * 1000, // Use maxAge instead of expires
        httpOnly: false,
        path: path, // Set the path attribute (default is '/')
        domain: domain, // Set the domain attribute (default is current domain)
        // You can add more options as needed
    };
    document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=${cookieOptions.path}; domain=${cookieOptions.domain}`;
}


// Function to get a cookie
function getCookie(name) {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

// Function to delete a cookie
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
