import React, {createContext, useState} from 'react'


const userContext = createContext();


export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const setUsersData = (data) => {
    setUsers(data);
  };

  const getUser = async (id) => {
    let user = users.find((user) => user.id === id);
    if (user) return user;
  };

  return (
    <userContext.Provider value={{ users, setUsersData, getUser }}>
      {children}
    </userContext.Provider>
  );
};