import { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";

AuthProvider.propTypes = {
  children: PropTypes.node,
};
const AuthContext = createContext();
const initialState = {
  isAuthenticated: false,
  user: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, isAuthenticated: true, user: action.payload };
    case "logout":
      return { ...state, isAuthenticated: false, user: null };
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
  };

  const [{ isAuthenticated, user }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  function login(email, password) {
    if (FAKE_USER.email === email && FAKE_USER.password === password)
      dispatch({ type: "login", payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Auth Context was used outside AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
