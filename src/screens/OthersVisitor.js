import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from "@expo/vector-icons";


export default function OtherVisitor() {
  const navigation = useNavigation();

  const visitors = [
    {
      id: 1,
      name: 'Amit Sharma',
      location: 'Gate 2',
      subtitle: 'Amit Khanna',
      phone: '+91 97845 62103',
      type: 'Electrician'
    },
    {
      id: 2,
      name: 'Sakshi Pandey',
      phone: '+91 98563 21458',
      type: 'Plumber'
    },
    {
      id: 3,
      name: 'Ravi Sharma',
      phone: '+91 91234 78569',
      type: 'Guest'
    },
    {
      id: 4,
      name: 'Neha Roy',
      phone: '+91 99887 65432',
      type: 'House Help'
    },
    {
      id: 5,
      name: 'Arjun Patel',
      phone: '+91 88765 41230',
      type: 'Courier'
    },
    {
      id: 6,
      name: 'Priya Malhotra',
      phone: '+91 77123 89456',
      type: 'Visitor'
    },
    {
      id: 7,
      name: 'Rahul Mehra',
      phone: '+91 82234 56789',
      type: 'Delivery'
    }
  ];

  const handleVerify = (visitor) => {
    console.log('Verifying:', visitor.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequent Visitors</Text>
      </View>


      {/* Visitors List */}
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
              <Text style={styles.verifyButtonText}>Verify</Text>
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
    backgroundColor: '#fff',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  visitorPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  visitorType: {
    fontSize: 14,
    color: '#888',
  },
  verifyButton: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 16,
  },
  verifyButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
});