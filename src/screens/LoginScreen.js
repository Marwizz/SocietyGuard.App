import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { GuardContext } from "../GuardContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { guardLogin } from "../services/operations/authApi";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setUser, setIsAuthenticated  } = useContext(GuardContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setIsLoading(false);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
  
    setIsLoading(true);
  
    try {
  
      const response = await guardLogin(email, password);
      console.log("Login Response:", response.data.data);
      
  
      if (response?.data?.data) {
        await AsyncStorage.setItem("userToken", response.data.token);
        setUser(response.data.data);
        setIsAuthenticated(true);
        resetFields();
        Alert.alert("Success", "Logged in successfully", [{ text: "OK"}]);
      } else {
        Alert.alert("Error", response?.data?.message || "Invalid credentials.");
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Login error:", error);
  
      let errorMessage = "Login failed. Please try again.";
  
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Svg height="300" width="600" style={styles.backgroundSvg}>
            <Circle cx="180" cy="10" r="200" fill="#ffc600" opacity="0.2" />
            <Circle cx="350" cy="40" r="140" fill="#ffc600" opacity="0.3" />
          </Svg>

          <View style={styles.topSection}>
            <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.getStartedText}>Go Back</Text>
          </View>

          <View style={styles.logoSection}>
            <Text style={styles.logoText}>
              Resi<Text style={styles.highlightText}>do </Text>
              <Text style={styles.logoText}>Guard</Text>
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Email address*</Text>
            <TextInput
              placeholder="Enter your email here"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />

            <Text style={styles.inputLabel}>Password*</Text>
            <TextInput
              placeholder="Enter password"
              style={styles.input2}
              placeholderTextColor="#ccc"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />

            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginLeft: 20,
  },
  backArrow: {
    marginRight: 10,
  },
  getStartedText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Outfit",
    color: "#000",
  },
  logoSection: {
    marginLeft: 30,
    marginTop: 150,
  },
  logoText: {
    fontSize: 52,
    fontWeight: "bold",
    fontFamily: "Outfit-Bold",
    color: "#000",
  },
  highlightText: {
    color: "#ffc600",
  },
  formSection: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Outfit",
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#000",
  },
  input2: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Outfit",
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#000",
  },
  submitButton: {
    backgroundColor: "#ffc600",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginVertical: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Outfit",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});