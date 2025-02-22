import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  getFrequentInvites,
  recordVisit,
} from "../services/operations/preApproveApi";

export default function FrequentPreapprove({ route }) {
  const { societyId } = route.params;
  const navigation = useNavigation();
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVisitors = async () => {
    try {
      const response = await getFrequentInvites(societyId);
      console.log("getFrequentInvites API RESPONSE:", response.data);

      if (response?.data?.data) {
        const transformedData = response.data.data.map((visitor) => ({
          id: visitor._id,
          name: visitor.guestName,
          phone: visitor.guestPhone,
          type: visitor.purpose,
        }));
        setVisitors(transformedData);
      } else {
        console.error("API response format unexpected:", response.data);
        Alert.alert("Error", "Unexpected API response format.");
      }
    } catch (error) {
      console.error("getFrequentInvites API ERROR:", error);
      Alert.alert(
        "Error",
        "Failed to fetch frequent visitors. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(societyId);
    if (societyId) {
      fetchVisitors();
    }
  }, [societyId]);

  const handleVerify = async (visitor) => {
    try {
        console.log("Verifying visitor:", visitor);
      if (!visitor.id) {
        throw new Error("inviteId is missing in visitor object");
      }

      const response = await recordVisit(visitor.id);
      console.log("Record Visit Response:", response);

      Alert.alert("Success", "Entry recorded successfully.");
    } catch (error) {
      console.error("Record Visit API ERROR:", error);
      Alert.alert("Error", "Failed to record entry. Please try again.");
    }
};
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFC600" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequent Visitors</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {visitors.map((visitor) => (
          <View key={visitor.id} style={styles.visitorCard}>
            <View style={styles.visitorInfo}>
              <Text style={styles.visitorName}>{visitor.name}</Text>
              <Text style={styles.visitorPhone}>{visitor.phone}</Text>
              <Text style={styles.visitorType}>{visitor.type}</Text>
            </View>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={() => handleVerify(visitor)}
            >
              <Text style={styles.verifyButtonText}>Record Entry</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  visitorCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 30,
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  visitorPhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  visitorType: {
    fontSize: 14,
    color: "#888",
  },
  verifyButton: {
    backgroundColor: "#FFC600",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 16,
  },
  verifyButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
});
