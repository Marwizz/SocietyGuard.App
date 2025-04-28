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
import React, { useState, useEffect, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { EXPO_PUBLIC_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GuardContext } from "../../GuardContext";


const GuestEntryModal = ({ visible, onClose, onSubmit, societyId }) => {
  const { user } = useContext(GuardContext);
  const [guestData, setGuestData] = useState({
    fullName: "",
    mobileNumber: "",
    purpose: "",
    houseNumber: "",
  });

  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);

  const purposeCategories = [
    "Delivery", 
    "Guest", 
    "Maintenance", 
    "Home repair", 
    "Appliance repair", 
    "Internet repair", 
    "Beautician", 
    "Tutor", 
    "Other"
  ];

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
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${EXPO_PUBLIC_BASE_URL}/auth/listHouseBySocietyId/${societyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("house data is ", response.data);

      setHouses(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching houses:', err);
      setError('Failed to load house numbers');
      setHouses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleHouseChange = (houseName) => {
    const selectedHouse = houses.find(house => house.flatNumber === houseName);
    setSelectedHouse(selectedHouse);
    setGuestData({ ...guestData, houseNumber: houseName });
  };

  const createVisitorEntry = async () => {
    if (!guestData.fullName || !guestData.mobileNumber || !guestData.purpose || !guestData.houseNumber) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    if (!selectedHouse || !selectedHouse._id) {
      Alert.alert("Error", "Please select a valid house number");
      return;
    }

    if (!user || !user._id) {
      Alert.alert("Error", "Security guard information is missing");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const visitorData = {
        SocietyId: societyId,
        HouseId: selectedHouse._id,
        SecurityGuard: user._id,
        Name: guestData.fullName,
        PhoneNumber: guestData.mobileNumber,
        PurposeOfVisit: guestData.purpose,
        TimeOfArrival: new Date().toISOString(),
        IsActive: true
      };

      console.log('Sending visitor data:', visitorData); // Add logging for debugging

      const response = await axios.post(
        `${EXPO_PUBLIC_BASE_URL}/auth/create/visitorVerification`,
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
          fullName: "",
          mobileNumber: "",
          purpose: "",
          houseNumber: "",
        });
        onClose();
      }
    } catch (err) {
      console.error('Error creating visitor entry:', err);
      console.error('Error response:', err.response?.data); // Log the error response
      Alert.alert(
        "Error", 
        err.response?.data?.message || "Failed to create visitor entry. Please try again."
      );
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
            <Text style={styles.modalTitle}>Guest Entry</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter guest's full name"
                value={guestData.fullName}
                onChangeText={(text) => setGuestData({ ...guestData, fullName: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={guestData.mobileNumber}
                onChangeText={(text) => setGuestData({ ...guestData, mobileNumber: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Purpose of Visit</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={guestData.purpose}
                  onValueChange={(itemValue) => 
                    setGuestData({ ...guestData, purpose: itemValue })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select purpose" value="" />
                  {purposeCategories.map((purpose, index) => (
                    <Picker.Item key={index} label={purpose} value={purpose} />
                  ))}
                </Picker>
              </View>
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
              style={[
                styles.submitButton,
              
              ]}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#EAB308',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
 
});

export default GuestEntryModal;
