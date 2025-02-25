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
  otherVisitor,
  verifyOtherVisitor,
} from "../services/operations/preApproveApi";

export default function OtherVisitor({ route }) {
  const navigation = useNavigation();
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const { societyId } = route.params;

  const fetchVisitors = async () => {
    try {
      const response = await otherVisitor(societyId);

      if (response?.data?.data) {
        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter and transform visitors
        const transformedVisitors = response.data.data
          .filter((visitor) => {
            const visitorDate = new Date(visitor.TimeOfArrival);
            visitorDate.setHours(0, 0, 0, 0);
            return visitorDate.getTime() === today.getTime();
          })
          .map((visitor) => ({
            _id: visitor._id,
            id: visitor._id,
            name: visitor.Name,
            phone: visitor.PhoneNumber,
            type: visitor.PurposeOfVisit,
            verifiedBy: visitor.verifiedBy,
          }));

        setVisitors(transformedVisitors);
        console.log(transformedVisitors);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch visitors. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [societyId]);

  const handleVerify = async (visitor) => {
    try {
      setVerifyingId(visitor._id);

      const response = await verifyOtherVisitor(visitor._id);

      if (response?.data) {
        // Show success message
        Alert.alert("Success", "Visitor verified successfully", [
          { text: "OK" },
        ]);

        // Refresh the visitors list
        fetchVisitors();
      }
    } catch (error) {
      console.error("Verification error:", error);
      Alert.alert("Error", "Failed to verify visitor. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setVerifyingId(null);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Other Visitors</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffc107" />
        </View>
      </SafeAreaView>
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
        <Text style={styles.headerTitle}>Other Visitors</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {visitors.length > 0 ? (
          visitors.map((visitor) => (
            <View key={visitor.id} style={styles.visitorCard}>
              <View style={styles.visitorInfo}>
                <Text style={styles.visitorName}>{visitor.name}</Text>
                <Text style={styles.visitorPhone}>
                  Mobile number: {visitor.phone}
                </Text>
                <Text style={styles.visitorType}>Purpose: {visitor.type}</Text>
              </View>
              {verifyingId === visitor.id ? (
                <View style={styles.verifyButton}>
                  <ActivityIndicator size="small" color="#000" />
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.verifyButton,
                    visitor.verifiedBy ? styles.verifiedButton : null,
                  ]}
                  onPress={() => handleVerify(visitor)}
                  disabled={Boolean(visitor.verifiedBy)}
                >
                  <Text
                    style={[
                      styles.verifyButtonText,
                      visitor.verifiedBy ? { color: "#fff" } : null,
                    ]}
                  >
                    {visitor.verifiedBy ? "Verified" : "Verify"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <View style={styles.noVisitorsContainer}>
            <Text style={styles.noVisitorsText}>No visitors for today</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
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
    backgroundColor: "#ffc107",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 16,
    minWidth: 80,
    alignItems: "center",
  },
  verifiedButton: {
    backgroundColor: "#4CAF50",
  },
  verifyButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  noVisitorsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  noVisitorsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
