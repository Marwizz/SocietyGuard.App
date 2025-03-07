import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
} from "react-native";
import { verifyVisitorOTP } from "../services/operations/preApproveApi";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";


const { width, height } = Dimensions.get("window");
const FRAME_SIZE = 300;

export default function PreApprovedOtp() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const lastScanRef = useRef(0);
 
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleCodeChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (code[index] === "" && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1].focus();
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };
  
  const isVerifyDisabled = code.some((digit) => digit === "") || isLoading;

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);

      const otpData = { otp: verificationCode };
      await verifyVisitorOTP(otpData);
      resetFields();

      Alert.alert("Success", "OTP verified successfully", [{ text: "OK" }]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to verify OTP. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFields = () => {
    setCode(["", "", "", "", "", ""]);
  };

  // QR Scanner methods
  const openScanner = () => {
    if (!permission?.granted) {
      requestPermission();
      return;
    }
    setScannerVisible(true);
    setScanned(false);
  };

  const closeScanner = () => {
    setScannerVisible(false);
    setScanned(false);
  };

  
  const handleBarCodeScanned = async ({ data }) => {
    const now = Date.now();
    // Avoid multiple scans within 2s
    if (scanned || now - lastScanRef.current < 2000) {
      return;
    }
  
    setScanned(true);
    lastScanRef.current = now;
  
    try {
      // Try to parse the JSON data from QR code
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        // If not JSON, check if it's directly a 6-digit code
        if (/^\d{6}$/.test(data)) {
          parsedData = { otp: data };
        } else {
          throw new Error("Invalid QR data format");
        }
      }
  
      // Extract OTP from parsed data
      const otp = parsedData.otp;
      
      // Validate OTP format
      if (otp && /^\d{6}$/.test(otp)) {
        // Set OTP code from scan
        const otpDigits = otp.split('');
        setCode(otpDigits);
        
        // Close scanner
        setScannerVisible(false);
        
        // Optional: Auto-verify
        // setTimeout(() => handleVerify(), 500);
      } else {
        Alert.alert("Invalid OTP", "The scanned QR code does not contain a valid 6-digit OTP", [
          { text: "OK", onPress: () => setScanned(false) }
        ]);
      }
    } catch (error) {
      console.error("Error processing scan:", error);
      Alert.alert("Scan Error", "Could not process the QR code. Please try again.", [
        { text: "OK", onPress: () => setScanned(false) }
      ]);
    }
  };  const handleScanAgain = () => {
    setScanned(false);
    lastScanRef.current = 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionLabel}>Pre-approved</Text>
        <TouchableOpacity style={{ marginRight: 30 }} onPress={openScanner}>
          <MaterialIcons name="qr-code-scanner" size={50} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.digitBox,
              digit && styles.digitBoxFilled,
              index === code.findIndex((d) => d === "") &&
                styles.digitBoxActive,
            ]}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="phone-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>
     
      <TouchableOpacity
        style={[
          styles.verifyButton,
          isVerifyDisabled && styles.verifyButtonDisabled,
        ]}
        onPress={handleVerify}
        disabled={isVerifyDisabled}
      >
        <Text
          style={[
            styles.verifyText,
            isVerifyDisabled && styles.verifyTextDisabled,
          ]}
        >
          Verify
        </Text>
      </TouchableOpacity>

      {/* QR Scanner Modal */}
      <Modal
        visible={scannerVisible}
        animationType="slide"
        onRequestClose={closeScanner}
      >
        <View style={styles.scannerContainer}>
          {permission?.granted ? (
            <CameraView
              style={StyleSheet.absoluteFillObject}
             
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
            >
              {/* Overlay scanning frame */}
              <View style={styles.scanFrame}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
              </View>

              {/* Instruction Text */}
              <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>
                  Scan QR code containing 6-digit OTP
                </Text>
              </View>

              {/* Back button */}
              <TouchableOpacity style={styles.backButton} onPress={closeScanner}>
                <Text style={styles.buttonText}>Close Scanner</Text>
              </TouchableOpacity>

              {/* Bottom controls */}
              <View style={styles.bottomControls}>

                {scanned && (
                  <TouchableOpacity style={styles.controlButton} onPress={handleScanAgain}>
                    <Text style={styles.buttonText}>Scan Again</Text>
                  </TouchableOpacity>
                )}
              </View>
            </CameraView>
          ) : (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>We need camera permission to scan QR codes.</Text>
              <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                <Text style={styles.buttonText}>Grant Permission</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.permissionButton, { marginTop: 20, backgroundColor: '#555' }]} onPress={closeScanner}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionLabel: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 12,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  digitBox: {
    width: 40,
    height: 50,
    borderBottomWidth: 2,
    borderColor: "#888282",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 23,
  },
  digitBoxFilled: {
    borderColor: "#EAB308",
  },
  digitBoxActive: {
    borderColor: "#EAB308",
    borderBottomWidth: 3,
  },
  verifyButton: {
    backgroundColor: "#EAB308",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  verifyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  verifyTextDisabled: {
    color: "#9CA3AF",
  },
  
  // Scanner styles
  scannerContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  permissionButton: {
    backgroundColor: "#EAB308",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: 200,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
  bottomControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 10,
  },
  scanFrame: {
    position: "absolute",
    top: height / 2 - FRAME_SIZE / 2,
    left: width / 2 - FRAME_SIZE / 2,
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#EAB308",
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#EAB308",
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#EAB308",
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "#EAB308",
  },
  instructionContainer: {
    position: "absolute",
    top: height / 2 - FRAME_SIZE / 2 - 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
});