import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  getAllCabInvite,
  verifyCabInvite,
} from "../services/operations/preApproveApi";

export default function CabPreapprove({ route }) {
  const { societyId } = route.params;
  const navigation = useNavigation();
  const [selectedCab, setSelectedCab] = useState(null);
  const [deliveryData, setDeliveryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recipientid, setRecipientid] = useState(null);

  const fetchCabData = async () => {
    try {
      const response = await getAllCabInvite(societyId);
      console.log("getAllCabInvite API RESPONSE:", response.data);

      if (response) {
        setDeliveryData(response.data);
      }
    } catch (error) {
      console.error("getAllCabInvite API ERROR:", error);
      Alert.alert("Error", "Failed to fetch delivery data. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCabData();
  }, [societyId]);

  const handleCabSelect = (cab) => {
    setSelectedCab(cab._id);
    setRecipientid(cab.userId._id);
    console.log("Selected cab:", cab.userId._id);
  };

  const handleVerifyEntry = async () => {
    if (selectedCab !== null) {
      try {
        setIsLoading(true);
        const response = await verifyCabInvite(selectedCab, {
          action: "entry",
          recipientid: recipientid,
        });

        console.log("Verify entry response:", response);

        if (response?.data) {
          Alert.alert("Success", "Entry verified successfully", [
            { text: "OK", onPress: () => fetchCabData() },
          ]);
        }
      } catch (error) {
        console.error("Verify Entry Error:", error);
        Alert.alert("Error", "Failed to verify entry. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyExit = async () => {
    if (selectedCab !== null) {
      try {
        setIsLoading(true);
        const response = await verifyCabInvite(selectedCab, {
          action: "exit",
        });

        console.log("Verify exit response:", response);

        if (response?.data) {
          Alert.alert("Success", "Exit verified successfully", [
            { text: "OK", onPress: () => fetchCabData() },
          ]);
        }
      } catch (error) {
        console.error("Verify Exit Error:", error);
        Alert.alert("Error", "Failed to verify exit. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            {" "}
            <Ionicons name="chevron-back" size={24} color="black" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cab Verification</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>Company Name</Text>
          <Text style={[styles.columnHeader, styles.centerText]}>
            Vehicle #
          </Text>
          <Text style={[styles.columnHeader, styles.rightText]}>House ID</Text>
        </View>

        {/* Cab List */}
        <ScrollView style={styles.scrollView}>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading deliveries...</Text>
          ) : !Array.isArray(deliveryData) || deliveryData.length === 0 ? (
            <Text style={styles.noDataText}>No cab deliveries found</Text>
          ) : (
            deliveryData.map((cab) => (
              <TouchableOpacity
                key={cab._id}
                style={[
                  styles.cabRow,
                  selectedCab === cab._id && styles.selectedRow,
                ]}
                onPress={() => handleCabSelect(cab)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.cabName,
                    selectedCab === cab._id && styles.selectedText,
                  ]}
                >
                  {cab.companyName}
                </Text>
                <Text
                  style={[
                    styles.vehicleNumber,
                    selectedCab === cab._id && styles.selectedText,
                    styles.flex1,
                    styles.centerText,
                  ]}
                >
                  {cab.vehicleNumber}
                </Text>
                <Text
                  style={[
                    styles.houseId,
                    selectedCab === cab._id && styles.selectedText,
                  ]}
                >
                  {cab?.FlatId?.flatNumber}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Verification Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.verifyEntryButton,
              selectedCab === null && styles.disabledButton,
            ]}
            onPress={handleVerifyEntry}
            disabled={selectedCab === null}
          >
            <Text style={styles.buttonText}>Verify Entry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.verifyExitButton,
              selectedCab === null && styles.disabledButton,
            ]}
            onPress={handleVerifyExit}
            disabled={selectedCab === null}
          >
            <Text style={styles.buttonText}>Verify Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: 35,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 8,
  },
  columnHeader: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  cabRow: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedRow: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
    borderWidth: 1,
  },
  selectedText: {
    color: "#2196f3",
    fontWeight: "600",
  },
  companyName: {
    fontSize: 16,
    color: "#333",
  },
  vehicleNumber: {
    fontSize: 16,
    color: "#333",
  },
  houseId: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 24,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    
  },
  verifyEntryButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  verifyExitButton: {
    backgroundColor: "#f44336",
    padding: 16,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  flex1: {
    flex: 1,
  },
  centerText: {
    textAlign: "center",
  },
  rightText: {
    textAlign: "right",
  },
});
