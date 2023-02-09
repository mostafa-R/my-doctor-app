import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableNativeFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';

function HomeScreen(props) {
  const { navigation } = props;
  const [token, setToken] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      _checkToken();
    });

    return unsubscribe;
  }, [navigation]);

  const _checkToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    setToken(token);
  };

  return (
    <React.Fragment>
      <ImageBackground
        source={require('../assets/doc-bg.png')}
        style={styles.background}
      >
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>أهلًا بك في طبيبي</Text>
            <Text style={styles.text}>
              التطبيق الأول للربط بين الأطباء والمرضى
            </Text>
          </View>
          {token ? (
            <React.Fragment>
              <Button
                text="استعرض قائمة الأطباء"
                onPress={() => navigation.navigate('Doctors')}
              />
              <TouchableNativeFeedback
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.labelButton}>استعراض الملف الشخصي</Text>
              </TouchableNativeFeedback>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button
                text="تسجيل الدخول"
                onPress={() => navigation.navigate('SignIn')}
              />
              <TouchableNativeFeedback
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.labelButton}>إنشاء حساب جديد</Text>
              </TouchableNativeFeedback>
            </React.Fragment>
          )}
        </View>
      </ImageBackground>
    </React.Fragment>
  );
}

const textStyles = {
  color: '#fff',
  textAlign: 'center',
  fontFamily: 'NotoFont',
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 30,
  },
  title: {
    ...textStyles,
    fontSize: 35,
  },
  text: {
    ...textStyles,
    fontSize: 20,
  },
  labelButton: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
});

export default HomeScreen;
