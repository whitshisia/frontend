import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const nav = useNavigate();

  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [onChange, setOnChange] = useState(false);
  const [auth_token, setAuth_token] = useState(() =>
    localStorage.getItem("access_token") ? localStorage.getItem("access_token") : null
  );



  const server_url = "http://127.0.0.1:5000"; 
  // REGISTER USER
  const signup_user = (username, email, password, is_admin) => {
    fetch(`${server_url}/users`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        is_admin: is_admin,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((res) =>{
      if(res.success)
      {
        toast.success(res.success)
        nav("/login")
      }
      else if(res.error)
      {
        toast.error(res.error)
      }
      else {
        toast.error("An error occured")
      }
    });
}

  // LOGIN USER
  const login_user = (email, password) => {
    fetch(`${server_url}/login`, {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(response.json)
        return response.json();
      })
      .then((res) => {
        setAuth_token(res.access_token);
        localStorage.setItem("access_token", res.access_token);
        toast.success("Logged in Successfully!");
        nav("/profile");
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        toast.error("An error occurred while logging in");
      });
  };

  // LOGOUT
  const logout = () => {
    fetch(`${server_url}/logout`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((res) => {
        localStorage.removeItem("access_token");
        setCurrentUser(null);
        setAuth_token(null);
        setOnChange(!onChange);
        toast.success(res.message);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
        toast.error("An error occurred while logging out");
      });
  };

  useEffect(() => {
    if (auth_token) {
      fetch(`${server_url}/books`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((error) => {
          console.error('Error fetching current user:', error);
          localStorage.removeItem("access_token");
          setCurrentUser(null);
          setAuth_token(null);
          nav("/login");
        });
    }
  }, [auth_token, onChange]);

  const contextData = {
    username,
    setUsername,
    auth_token,
    currentUser,
    setCurrentUser,
    signup_user,
    login_user,
    logout,
  };

  return (
    <UserContext.Provider value={contextData}>
      {children}
    </UserContext.Provider>
  );
};
