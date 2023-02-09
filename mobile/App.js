import 'react-native-gesture-handler';
import React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './screens/SignIn';
import HomeScreen from './screens/Home';
import SignUpScreen from './screens/SignUp';
import ProfileScreen from './screens/Profile';
import DoctorsScreen from './screens/Doctors';

const Stack = createStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    NotoFont: require('./assets/fonts/NotoKufiArabic-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: 'right',
            fontFamily: 'NotoFont',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />

        <Stack.Screen
          name="SignIn"
          options={{
            title: 'تسجيل الدخول',
          }}
          component={SignInScreen}
        />

        <Stack.Screen
          name="SignUp"
          options={{
            title: 'حساب جديد',
          }}
          component={SignUpScreen}
        />

        <Stack.Screen
          name="Profile"
          options={{
            title: 'الملف الشخصي',
          }}
          component={ProfileScreen}
        />

        <Stack.Screen
          name="Doctors"
          options={{
            title: 'الأطباء',
          }}
          component={DoctorsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
