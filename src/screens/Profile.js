import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import React, { useContext } from "react";
import { GuardContext } from "../GuardContext";
import { Ionicons } from "@expo/vector-icons";
import { EXPO_PUBLIC_IMAGE_BASE_URL } from "@env";
import { useNavigation } from "@react-navigation/native";

export default function GuardProfile({ route }) {
  const { societyId } = route.params;
  const { user, logout } = useContext(GuardContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Logout Confirmation", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
        
            <Ionicons name="chevron-back" size={24} color="black" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guard Profile</Text>
      </View>

      <View style={styles.profileSection}>
        {user?.Photo ? (
          <Image
            source={{ uri: `${user.Photo}` }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="person" size={60} color="#555" />
          </View>
        )}

        <Text style={styles.name}>
          {user?.FullName || "Name Not Available"}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.fieldLabel}>MOBILE</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldValue}>
            {user?.Mobile || "Not Available"}
          </Text>
        </View>

        <Text style={styles.fieldLabel}>SHIFT</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldValue}>
            {user?.Shift || "Not Available"}
          </Text>
        </View>


        <Text style={styles.fieldLabel}>USER ID</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldValue}>
            {user?.UserId || "Not Available"}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FBBF24",
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FBBF24",
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
  },
  infoSection: {
    paddingVertical: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
    marginBottom: 8,
    marginLeft: "4%",
  },
  fieldContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    maxWidth: "90%",
    marginLeft: "4%",
  },
  fieldValue: {
    fontSize: 16,
    color: "#333333",
  },
  logoutButton: {
    backgroundColor: "#FBBF24",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginVertical: 24,
    borderRadius: 10,
    elevation: 2,
    maxWidth: "90%",
    marginLeft: "4%",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
