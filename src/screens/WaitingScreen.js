import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,RefreshControl 
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useFocusEffect  } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { guestWaiting } from "../services/operations/onArrivalApi";

export default function WaitingScreen({societyId, route}) {
  const navigation = useNavigation();
  const id = societyId || route.params?.societyId;  
 


  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  

  const fetchVisitors = async () => {
    try {
      setIsLoading(true);
      setRefreshing(true);

      const response = await guestWaiting(id);
      console.log("API Response:", response?.data?.data);
  
      if (Array.isArray(response?.data?.data)) {
        const allVisitors = response.data.data;
        
        // Get today's date in "YYYY-MM-DD" format
        const today = new Date().toISOString().split("T")[0];
  
        // Filter visitors where `TimeOfArrival` is today's date
        const filteredVisitors = allVisitors.filter((visitor) => {
          if (!visitor.TimeOfArrival) return false; 
          
          const arrivalDate = new Date(visitor.TimeOfArrival)
            .toISOString()
            .split("T")[0];
  
          return arrivalDate === today;
        });
  
        setVisitors(filteredVisitors);
      } else {
        setVisitors([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch visitors. Please try again.", [
        { text: "OK" },
      ]);
      setVisitors([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);

    }
  };


   useEffect(() => {
    if (id) {
      fetchVisitors(id);
    }
  }, [id]);
  
  

  // useEffect(() => {
  //   fetchVisitors();
  // }, [societyId]);

  const handleVerify = (visitor) => {
    console.log("Verifying:", visitor.Name);
  };

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

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#000"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView style={styles.scrollView} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchVisitors} />
        }>
          {visitors.map((visitor) => (
            <View key={visitor._id} style={styles.visitorCard}>
              <View style={styles.visitorInfo}>
                <Text style={styles.visitorName}>{visitor.Name}</Text>
                <Text style={styles.visitorPhone}>Mobile No : {visitor.PhoneNumber}</Text>
                <Text style={styles.visitorType}>Purpose : {visitor.PurposeOfVisit}</Text>
                <Text style={styles.visitorType}>Flat Number : {visitor.House?.Name}</Text>
              </View>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={() => handleVerify(visitor)}
              >
                <Text style={styles.verifyButtonText}>{visitor.Status}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: 35,
  },
  backButton: { padding: 8 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#333",
  },
  scrollView: { flex: 1 },
  visitorCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 30,
  },
  visitorInfo: { flex: 1 },
  visitorName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  visitorPhone: { fontSize: 14, color: "#666", marginBottom: 2 },
  visitorType: { fontSize: 14, color: "#888" },
  verifyButton: {
    backgroundColor: "#ffc107",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 16,
  },
  verifyButtonText: { color: "#000", fontSize: 14, fontWeight: "600" },
});
