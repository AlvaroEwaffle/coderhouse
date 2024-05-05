// sessionValidation.js
import axios from 'axios';

const validateSession = (setName, setUsertype, navigate) => {
  axios.defaults.withCredentials = true;
  axios.get('http://localhost:8080/api/sessions/current')
    .then(response => {
      console.log("Validate Session Response Data:", response.data);
      if (response.data.role) {
        setName(response.data.email);
        setUsertype(response.data.role);
      } else {
        console.log("Usuario sin rol?");
        navigate('/login');
      }
    })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized, redirecting to login");
        navigate('/login');
      } else {
        console.log("Error:", error);
      }
    });
};

// Function to get cookie value by name
const getCookie = (name) => {
  const cookieName = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
};

export default validateSession;
