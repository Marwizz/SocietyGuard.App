import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  groupVisitorOTP,
  addGuestEntry,
} from "../services/operations/preApproveApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GroupPreapprove = ({ route }) => {
  const { societyId } = route.params;
  const navigation = useNavigation();
  const [groupInvites, setGroupInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPartyCode, setSelectedPartyCode] = useState("");
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    mobile: "",
    houseId: "",
  });

  const fetchGroupInvites = async () => {
    try {
      const response = await groupVisitorOTP(societyId);
      console.log(response.data.data);

      if (response?.data) {
        setGroupInvites(response.data.data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch group invites. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupInvites();
  }, [societyId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleAddGuest = async () => {
    if (!guestDetails.mobile.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "Authentication failed. Please log in again.");
        return;
      }

      const guestData = {
        guestName: guestDetails.name,
        guestPhone: guestDetails.mobile,
        houseId: guestDetails.houseId
      };

      const response = await addGuestEntry(selectedPartyCode, guestData);
      console.log("Guest Data:", guestData);
      console.log("Response:", response.data);

      if (response?.data) {
        Alert.alert("Success", "Guest added successfully", [
          {
            text: "OK",
            onPress: () => {
              setModalVisible(false);
              setGuestDetails({ name: "", mobile: "", houseId: "" });
              fetchGroupInvites();
            },
          },
        ]);
      } else {
        Alert.alert("Error", response?.data?.message || "Failed to add guest.");
      }
    } catch (error) {
      console.error("Add Guest Error:", error);
      Alert.alert("Error", "Failed to add guest. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (partyCode, invite) => {
    setSelectedPartyCode(partyCode);
    // Get the houseId from the selected invite
    const houseId = invite.createdBy?.HouseId?._id || "";
    setGuestDetails((prev) => ({ ...prev, houseId: houseId }));
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          {/* Fixed: Wrapped icon in Text component */}
          <Text style={styles.backButtonText}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Invite</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading invites...</Text>
        ) : !Array.isArray(groupInvites) || groupInvites.length === 0 ? (
          <Text style={styles.noDataText}>No group invites found</Text>
        ) : (
          groupInvites.map((invite, index) => (
            <View key={invite._id || index} style={styles.card}>
              <TouchableOpacity onPress={() => openModal(invite.partyCode, invite)}>
                <View style={styles.cardContent}>
                  <View style={styles.leftContent}>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>House Number : </Text>
                      <Text style={styles.value}>
                        {invite.createdBy?.HouseId?.Name || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Purpose : </Text>
                      <Text style={styles.value}>
                        {invite.description || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Date : </Text>
                      <Text style={styles.value}>
                        {formatDate(invite.partyDate)}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Created By : </Text>
                      <Text style={styles.value}>
                        {invite.createdBy?.memberName || "N/A"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.codeContainer}>
                    <Text style={styles.codeText}>{invite.partyCode}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Guest details</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                {/* Fixed: Wrapped icon in Text component */}
                <Text>
                  <Ionicons name="close" size={24} color="black" />
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter guest name"
              value={guestDetails.name}
              onChangeText={(text) =>
                setGuestDetails((prev) => ({ ...prev, name: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              value={guestDetails.mobile}
              onChangeText={(text) =>
                setGuestDetails((prev) => ({ ...prev, mobile: text }))
              }
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddGuest}>
              <Text style={styles.addButtonText}>Add Guest</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E4DE",
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
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  codeContainer: {
    backgroundColor: "#043942",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 16,
  },
  codeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "80%",
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
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#FFC600",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});

export default GroupPreapprove;