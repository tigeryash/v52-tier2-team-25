import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";


export const useLoginForm = ({ setUser, state}) => {
   
    const [currentScreen, setCurrentScreen] = useState(state === "login" ? 0 : 1);
    const [values, setValues] = useState({
      email: "",
      password: "",
      passwordConfirm: "",
    });
  
    const navigate = useNavigate();
    const handleChangeValues = (event) => {
      setValues((prevValues) => ({
        ...prevValues,
        [event.target.name]: event.target.value,
      }));
    };
  
    const handleFormRegisterSubmit = async (e) => {
      e.preventDefault();
  
      if (values.password !== values.passwordConfirm) {
        console.log("Passwords do not match.");
        return;
      }
      if (values.password.length < 6) {
        console.log("Password must be at least 6 characters long.");
        return;
      }
  
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
  
      if (error) {
        console.error("Error signing up:", error.message);
        return;
      }
  
      console.log("Sign-up successful:", data);
    };
  
    const handleFormLoginSubmit = async (e) => {
      e.preventDefault();
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
  
      if (error) {
        console.error("Error logging in:", error.message);
        return;
      }
  
      const { user } = data;
      setUser(user);
  
      navigate("/userPage");
      console.log("Login successful:", user);
    };
  
    const handleSignOut = async () => {
      const { error } = await supabase.auth.signOut();
  
      if (error) {
        console.error("Error signing out:", error.message);
        return;
      }
  
      navigate("/");
  
      console.log("Sign-out successful.");
      setUser(null);
    };
    
    return {currentScreen, setCurrentScreen, values, setValues, handleChangeValues, handleFormLoginSubmit, handleFormRegisterSubmit, handleSignOut}
}