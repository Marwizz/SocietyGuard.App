import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert
} from 'react-native';
import { Image } from 'expo-image';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllAlerts, updateAlerts } from '../services/operations/alertApi';

const SecurityAlerts = ({ route }) => {
  const { societyId } = route.params;
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guardId, setGuardId] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (societyId) {
      fetchAlerts();
    }
  }, [societyId]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setGuardId(parsedData._id);
        // setSocietyId(parsedData.societyId);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await getAllAlerts(societyId); // Use getAllAlerts function
      console.log('Alerts:', response?.data);
      setAlerts(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      Alert.alert('Error', 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAcknowledge = async (alertId, status, guardId) => {
    try {
      const response = await updateAlerts(alertId, status, guardId); // Use updateAlerts function
      fetchAlerts(); // Refresh the list
      Alert.alert('Success', 'Alert acknowledged successfully');
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      Alert.alert('Error', 'Failed to acknowledge alert');
    }
  };

  const handleResolve = async (alertId, status, guardId) => {
    try {
        const response = await updateAlerts(alertId, status, guardId); // Use updateAlerts function
        fetchAlerts(); // Refresh the list
      Alert.alert('Success', 'Alert resolved successfully');
    } catch (error) {
      console.error('Error resolving alert:', error);
      Alert.alert('Error', 'Failed to resolve alert');
    }
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'health':
        return require('../../assets/medicine.gif');
      case 'fire':
        return require('../../assets/fire-sign.gif');
      case 'animal':
        return require('../../assets/golden-retriever.gif');
      case 'lift':
        return require('../../assets/elevator.gif');
      case 'other':
        return require('../../assets/more.gif');
      default:
        return require('../../assets/more.gif');
    }
  };

  const getAlertTypeTitle = (alertType) => {
    switch (alertType) {
      case 'health':
        return 'Health Alert';
      case 'fire':
        return 'Fire Alert';
      case 'animal':
        return 'Animal Threat';
      case 'lift':
        return 'Stuck In Lift';
      case 'other':
        return 'Other Alert';
      default:
        return 'Alert';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View style={styles.alertTypeContainer}>
          <Image 
            source={getAlertIcon(item.alertType) || require('../../assets/more.gif')} 
            style={styles.alertIcon} 
          />
          <Text style={styles.alertType}>{getAlertTypeTitle(item.alertType) || 'Unknown Alert'}</Text>
        </View>
        <Text style={styles.timeAgo}>{moment(item.createdAt).fromNow()}</Text>
      </View>
  
      <View style={styles.divider} />
  
      <View style={styles.userInfo}>
        <Ionicons name="person" size={18} color="#666" />
        <Text style={styles.userName}>{item?.userId?.memberName || 'Unknown User'}</Text>
      </View>
  
      <View style={styles.flatInfo}>
        <Ionicons name="home" size={18} color="#666" />
        <Text style={styles.flatNumber}>
          {item?.flatNumber ? `${item.flatNumber.Name || 'Unknown Block'}` : 'No Flat Info'}
        </Text>
      </View>
  
      <View style={styles.actionButtons}>
        <TouchableOpacity 
            style={[styles.actionButton, styles.acknowledgeButton]}
          onPress={() => handleAcknowledge(item._id, 'acknowledged', guardId)}
        >
        {item.status==='acknowledged' ? <Text style={styles.buttonText}>Acknowledged</Text> : <Text style={styles.buttonText}>Acknowledge</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.resolveButton]}
          onPress={() => handleResolve(item._id, 'resolved', guardId)}
        >
        {item.status==='resolved' ? <Text style={styles.buttonText}>Resolved</Text> : <Text style={styles.buttonText}>Resolve</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency Alerts</Text>
      </View>

      <FlatList
        data={alerts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchAlerts} colors={['#D92D20']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            <Text style={styles.emptyText}>No pending alerts</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  alertCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D92D20',
    marginLeft: 8,
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 14,
    marginLeft: 8,
  },
  flatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  flatNumber: {
    fontSize: 14,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  acknowledgeButton: {
    backgroundColor: '#007AFF',
  },
  resolveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});

export default SecurityAlerts;
