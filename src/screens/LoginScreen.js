import React, { useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { GuardContext } from "../GuardContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setIsAuthenticated } = useContext(GuardContext);

  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Background Spheres */}
          <Svg height="300" width="600" style={styles.backgroundSvg}>
            <Circle cx="180" cy="10" r="200" fill="#ffc600" opacity="0.2" />
            <Circle cx="350" cy="40" r="140" fill="#ffc600" opacity="0.3" />
          </Svg>

          {/* Top Section */}
          <View style={styles.topSection}>
            <TouchableOpacity style={styles.backArrow}>
              <AntDesign name="left" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.getStartedText}>Go Back</Text>
          </View>

          {/* Logo Section */}
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
            />

            <Text style={styles.inputLabel}>Password*</Text>
            <TextInput
              placeholder="Enter password"
              style={styles.input2}
              placeholderTextColor="#ccc"
              secureTextEntry={true}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <Text style={styles.submitButtonText}>Login</Text>
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
  orText: {
    fontSize: 16,
    fontFamily: "Outfit",
    color: "#000",
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orSignUpText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontFamily: "Outfit",
    color: "#000",
  },
  googleButton: {
    alignItems: "center",
    marginVertical: 10,
  }
});