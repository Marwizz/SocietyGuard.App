import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { EXPO_PUBLIC_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GuardContext } from "../../GuardContext";

const DeliveryEntryModal = ({ visible, onClose, onSubmit, societyId }) => {
  const { user } = useContext(GuardContext);

  const [guestData, setGuestData] = useState({
    companyName: "",
    houseNumber: "",
  });

  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);

  useEffect(() => {
    if (visible && societyId) {
      fetchHouses();
    }
  }, [visible, societyId]);

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${EXPO_PUBLIC_BASE_URL}/auth/listHouseBySocietyId/${societyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHouses(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching houses:", err);
      setError("Failed to load house numbers");
      setHouses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleHouseChange = (houseName) => {
    const selectedHouse = houses.find((house) => house.flatNumber === houseName);
    setSelectedHouse(selectedHouse);
    setGuestData({ ...guestData, houseNumber: houseName });
  };
  const createVisitorEntry = async () => {
    if (
      !guestData.companyName ||
      !guestData.houseNumber
    ) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const visitorData = {
        societyId: societyId,
        houseId: selectedHouse._id,
        verifiedBy: user._id,
        companyName: guestData.companyName,
        
        date: new Date().toISOString(),
        IsActive: true,
        validFor: 5,
        startTime: new Date().toISOString(),
      };

      const response = await axios.post(
        `${EXPO_PUBLIC_BASE_URL}/auth/delivery/create`,
        visitorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        Alert.alert("Success", "Visitor entry created successfully");
        onSubmit(response.data);
        setGuestData({
          companyName: "",
          vehicleNumber: "",
          houseNumber: "",
        });
        onClose();
      }
    } catch (err) {
      console.error("Error creating Delivery entry:", err);
      Alert.alert("Error", "Failed to create visitor entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Delivery Entry</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter delivery company name"
                value={guestData.companyName}
                onChangeText={(text) =>
                  setGuestData({ ...guestData, companyName: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>House Number</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#EAB308" />
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={guestData.houseNumber}
                    onValueChange={handleHouseChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select house number" value="" />
                    {houses.map((house) => (
                      <Picker.Item
                        key={house._id}
                        label={house.flatNumber}
                        value={house.flatNumber}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.submitButton]}
              onPress={createVisitorEntry}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Create Entry</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#EAB308",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DeliveryEntryModal;
