// sessionValidation.js
import axios from 'axios';

const validateSession = (setName, setUsertype, navigate) => {
  axios.defaults.withCredentials = true;
  axios.post('http://localhost:8080/api/sessions/validate')
    .then(response => {
      console.log("Validate Session Response Data:",response.data.userType);
      if (response.data) {
        setName(response.data.user);
        setUsertype(response.data.userType);
      } else {
        console.log("No hay sesión activa");
        navigate('/login');
      }
    })
    .catch(error => {
      console.log(error);
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
