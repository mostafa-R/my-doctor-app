import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableNativeFeedback,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../config/axios';
import Loader from '../components/Loader';
import Input from '../components/Input';
import { DOCTORS_URL } from '../config/urls';
import { transformName, debounce } from '../config/helpers';
import styles from './styles/doctorsStyles';
import DoctorDetails from './DoctorDetails';

function DoctorsScreen() {
  const [isLoading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    _getDoctors();
  }, []);

  const search = debounce((value) => {
    _getDoctors(value);
  }, 1000);

  const _getDoctors = (query) => {
    (async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        axios.defaults.headers.common.Authorization = `JWT ${token}`;
        const response = await axios.get(DOCTORS_URL, {
          params: { q: query ? query : '' },
        });
        setDoctors(response.data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    })();
  };

  const itemPressHandler = (itemId) => {
    setSelectedDoctor(doctors.find((doctor) => doctor.id === itemId));
  };

  const renderItem = ({ item }) => (
    <TouchableNativeFeedback onPress={() => itemPressHandler(item.id)}>
      <View style={styles.itemContainer}>
        <View style={styles.doctorAvatar}>
          <Text style={styles.doctorAvatarText}>
            {transformName(item.name)}
          </Text>
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.doctorSpec}>{item.profile.specialization}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );

  const keyExtractor = (item) => item.id.toString();

  return (
    <View>
      <Loader title="إحضار الأطباء" loading={isLoading} />
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Input
            inputStyles={styles.searchInput}
            placeholder="ابحث عن طبيب"
            icon="md-search"
            onChangeText={search}
          />
        </View>
      </View>

      <DoctorDetails
        selectedDoctor={selectedDoctor}
        closeModal={() => setSelectedDoctor(null)}
      />

      <SafeAreaView style={styles.doctorsListContainer}>
        {doctors.length !== 0 ? (
          <FlatList
            data={doctors}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        ) : (
          <Text style={styles.noDoctorsText}>لا يوجد أطباء</Text>
        )}
      </SafeAreaView>
    </View>
  );
}

export default DoctorsScreen;
