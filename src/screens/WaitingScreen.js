import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  guestWaiting,
  cabWaiting,
  deliveryWaiting,
} from "../services/operations/onArrivalApi";

const Tab = createMaterialTopTabNavigator();

// Guest Tab Screen Component
function GuestTabScreen({ societyId, refreshing, onRefresh, isLoading }) {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    fetchGuestVisitors();
  }, [societyId]);

  const fetchGuestVisitors = async () => {
    try {
      const response = await guestWaiting(societyId);
      setVisitors(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching guest visitors:", error);
      setVisitors([]);
    }
  };

  useEffect(() => {
    if (onRefresh) {
      fetchGuestVisitors();
    }
  }, [refreshing]);

  const handleVerify = (visitor) => {
    console.log("Verifying guest:", visitor.Name);
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#000"
        style={{ marginTop: 20 }}
      />
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {visitors.length > 0 ? (
        visitors.map((visitor) => (
          <View key={visitor._id} style={styles.visitorCard}>
            <View style={styles.visitorInfo}>
              <Text style={styles.visitorName}>{visitor.Name}</Text>
              <Text style={styles.visitorPhone}>
                Mobile No : {visitor.PhoneNumber}
              </Text>
              <Text style={styles.visitorType}>
                Purpose : {visitor.PurposeOfVisit}
              </Text>
              <Text style={styles.visitorType}>
                Flat Number : {visitor?.FlatId?.flatNumber}
              </Text>
            </View>
            <TouchableOpacity
             style={[
              styles.verifyButton,
              visitor.Status === "Approved"
                ? { backgroundColor: "rgb(106, 227, 146)" }
                : "#ffc107",
            ]}
              onPress={() => handleVerify(visitor)}
            >
              <Text style={styles.verifyButtonText}>
                {visitor.Status}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No guests waiting</Text>
      )}
    </ScrollView>
  );
}

// Cab Tab Screen Component
function CabTabScreen({ societyId, refreshing, onRefresh, isLoading }) {
  const [cabVisitors, setCabVisitors] = useState([]);

  useEffect(() => {
    fetchCabVisitors();
  }, [societyId]);

  const fetchCabVisitors = async () => {
    try {
      const response = await cabWaiting(societyId);
      setCabVisitors(response?.data?.data || []);
      console.log("cab visitors are ", response?.data?.data )
    } catch (error) {
      console.error("Error fetching cab visitors:", error);
      setCabVisitors([]);
    }
  };

  useEffect(() => {
    if (onRefresh) {
      fetchCabVisitors();
    }
  }, [refreshing]);

  const handleVerify = (visitor) => {
    console.log("Verifying cab:", visitor);
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#000"
        style={{ marginTop: 20 }}
      />
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {cabVisitors.length > 0 ? (
        cabVisitors.map((visitor) => (
          <View key={visitor._id} style={styles.visitorCard}>
            <View style={styles.visitorInfo}>
            <Text style={styles.visitorName}>
             {visitor.companyName}
              </Text>
              <Text style={styles.visitorType}>
                Flat Number : {visitor.FlatId?.flatNumber}
              </Text>
           
              <Text style={styles.visitorType}>
                Vehicle Number : {visitor.vehicleNumber}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                visitor.approvalStatus === "Approved"
                  ? { backgroundColor: "rgb(106, 227, 146)" }
                  : "#ffc107",
              ]}
              onPress={() => handleVerify(visitor)}
            >
              <Text style={styles.verifyButtonText}>
                {visitor.approvalStatus}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No cabs waiting</Text>
      )}
    </ScrollView>
  );
}

// Delivery Tab Screen Component
function DeliveryTabScreen({ societyId, refreshing, onRefresh, isLoading }) {
  const [deliveryVisitors, setDeliveryVisitors] = useState([]);

  useEffect(() => {
    fetchDeliveryVisitors();
  }, [societyId]);

  const fetchDeliveryVisitors = async () => {
    try {
      const response = await deliveryWaiting(societyId);
      console.log("delivery visitors are ", response?.data?.data )
      setDeliveryVisitors(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching delivery visitors:", error);
      setDeliveryVisitors([]);
    }
  };

  useEffect(() => {
    if (onRefresh) {
      fetchDeliveryVisitors();
    }
  }, [refreshing]);

  const handleVerify = (visitor) => {
    console.log("Verifying delivery:", visitor);
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#000"
        style={{ marginTop: 20 }}
      />
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {deliveryVisitors.length > 0 ? (
        deliveryVisitors.map((visitor) => (
          <View key={visitor._id} style={styles.visitorCard}>
            <View style={styles.visitorInfo}>
            <Text style={styles.visitorName}>
               {visitor.companyName}
              </Text>
              <Text style={styles.visitorType}>
                Flat Number: {visitor.FlatId?.flatNumber}
              </Text>
             
            </View>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                visitor.approvalStatus === "Approved"
                  ? { backgroundColor: "rgb(106, 227, 146)" }
                  : "#ffc107",
              ]}
              onPress={() => handleVerify(visitor)}
            >
              <Text style={styles.verifyButtonText}>
                {visitor.approvalStatus}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No deliveries waiting</Text>
      )}
    </ScrollView>
  );
}

export default function WaitingScreen({ societyId, route }) {
  const navigation = useNavigation();
  const id = societyId || route.params?.societyId;
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(false);
    }
  }, [id]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#888',
          tabBarIndicatorStyle: {
            backgroundColor: '#ffc107',
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: '700',
            textTransform: 'none',
          },
          tabBarStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
        }}
      >
        <Tab.Screen name="Guest">
          {() => (
            <GuestTabScreen
              societyId={id}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Cab">
          {() => (
            <CabTabScreen
              societyId={id}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Delivery">
          {() => (
            <DeliveryTabScreen
              societyId={id}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
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
    padding: 8 
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#333",
  },
  scrollView: { 
    flex: 1 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    marginLeft: 30,
    color: "#333",
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
    flex: 1 
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
    marginBottom: 2 
  },
  visitorType: { 
    fontSize: 14, 
    color: "#888" 
  },
  verifyButton: {
    backgroundColor: "#ffc107",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 16,
  },
  verifyButtonText: { 
    color: "#000", 
    fontSize: 14, 
    fontWeight: "600" 
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 40,
  }
});