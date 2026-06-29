import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

//createContext(): Crée un "conteneur global" pour les données
//user:  Les infos de l'utilisateur connecté
//token:  Le token JWT sauvegardé
//login():  Sauvegarde user + token quand on se connecte
//logout():  Supprime tout quand on se déconnecte
//AuthProvider:  Entoure toute l'app pour que tout le monde accède aux données
//useAuth():  Hook pour utiliser ces données dans n'importe quel composant