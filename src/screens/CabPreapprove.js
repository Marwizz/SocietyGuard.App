import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from "@expo/vector-icons";


export default function CabPreapprove() {
  const navigation = useNavigation();
  const [selectedCab, setSelectedCab] = useState(null);

  const cabCompanies = [
    { id: 0, name: 'Uber', houseId: 'A-105', vehicleNumber: '6789' },
    { id: 1, name: 'Ola', houseId: 'C-202', vehicleNumber: '4532' },
    { id: 2, name: 'Rapido', houseId: 'B-408', vehicleNumber: '9087' },
    { id: 3, name: 'Meru', houseId: 'D-205', vehicleNumber: '3421' },
    { id: 4, name: 'BluSmart', houseId: 'A-101', vehicleNumber: '7654' },
  ];

  const handleCabSelect = (cab) => {
    setSelectedCab(cab.id);
    console.log('Selected cab:', cab.name);
  };

  const handleVerifyEntry = () => {
    if (selectedCab !== null) {
      console.log('Verify entry for:', cabCompanies.find(c => c.id === selectedCab));
    }
  };

  const handleVerifyExit = () => {
    if (selectedCab !== null) {
      console.log('Verify exit for:', cabCompanies.find(c => c.id === selectedCab));
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
          <Text style={styles.backButtonText}> <Ionicons name="chevron-back" size={24} color="black" /></Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cab Verification</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>Company</Text>
          <Text style={[styles.columnHeader, styles.centerText]}>Vehicle #</Text>
          <Text style={[styles.columnHeader, styles.rightText]}>House ID</Text>
        </View>

        {/* Cab List */}
        <ScrollView style={styles.scrollView}>
          {cabCompanies.map((cab) => (
            <TouchableOpacity
              key={cab.id}
              style={[
                styles.cabRow,
                selectedCab === cab.id && styles.selectedRow
              ]}
              onPress={() => handleCabSelect(cab)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.companyName,
                selectedCab === cab.id && styles.selectedText,
                styles.flex1
              ]}>
                {cab.name}
              </Text>
              <Text style={[
                styles.vehicleNumber,
                selectedCab === cab.id && styles.selectedText,
                styles.flex1,
                styles.centerText
              ]}>
                {cab.vehicleNumber}
              </Text>
              <Text style={[
                styles.houseId,
                selectedCab === cab.id && styles.selectedText,
                styles.flex1,
                styles.rightText
              ]}>
                {cab.houseId}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Verification Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.verifyEntryButton,
              selectedCab === null && styles.disabledButton
            ]}
            onPress={handleVerifyEntry}
            disabled={selectedCab === null}
          >
            <Text style={styles.buttonText}>Verify Entry</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.verifyExitButton,
              selectedCab === null && styles.disabledButton
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 35,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  columnHeader: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  cabRow: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedRow: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 1,
  },
  selectedText: {
    color: '#2196f3',
    fontWeight: '600',
  },
  companyName: {
    fontSize: 16,
    color: '#333',
  },
  vehicleNumber: {
    fontSize: 16,
    color: '#333',
  },
  houseId: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  verifyEntryButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyExitButton: {
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  flex1: {
    flex: 1,
  },
  centerText: {
    textAlign: 'center',
  },
  rightText: {
    textAlign: 'right',
  },
});