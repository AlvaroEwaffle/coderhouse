// sessionValidation.js
import axios from 'axios';

const validateSession = (setName, setUsertype, navigate) => {
  axios.get('http://localhost:8080/api/sessions/validate')
    .then(response => {
      console.log(response.data);
      if (response.data.valid) {
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

export default validateSession;
