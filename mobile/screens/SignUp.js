import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { ScrollView, KeyboardAvoidingView, View, Text } from "react-native";
import Checkbox from "expo-checkbox";
import styles from "./styles/authStyles";
import ScreenTitle from "../components/ScreenTitle";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import axios from "../config/axios";
import { SIGNUP_URL } from "../config/urls";

function SignUpScreen(props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    speialization: "",
    phone: "",
    address: "",
    workingHours: "",
    userType: false,
    location: null,
  });
  const [location, setLocation] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ messages: null, type: "" });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert({ messages: null });
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert.messages]);

  const changeFormValue = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const validate = () => {
    const {
      name,
      email,
      password,
      userType,
      speialization,
      address,
      phone,
      workingHours,
    } = formData;
    let validationErrors = [];
    let passed = true;
    if (!name) {
      validationErrors.push("الرجاء إدخال اسم المستخدم");
      passed = false;
    }

    if (!email) {
      validationErrors.push("الرجاء إدخال البريد الإلكتروني");
      passed = false;
    }

    if (!password) {
      validationErrors.push("الرجاء إدخال كلمة المرور");
      passed = false;
    }

    if (userType) {
      if (!speialization) {
        validationErrors.push("الرجاء إدخال التخصص ");
        passed = false;
      }

      if (!address) {
        validationErrors.push("الرجاء إدخال العنوان");
        passed = false;
      }

      if (!workingHours) {
        validationErrors.push("الرجاء إدخال ساعات العمل");
        passed = false;
      }

      if (!phone) {
        validationErrors.push("الرجاء إدخال رقم الهاتف");
        passed = false;
      }
    }

    if (validationErrors.length > 0) {
      setAlert({ messages: validationErrors, type: "danger" });
    }
    return passed;
  };

  const _signUp = () => {
    (async () => {
      if (!validate()) return;
      setLoading(true);
      const {
        name,
        email,
        password,
        speialization,
        address,
        phone,
        workingHours,
        userType,
      } = formData;
      const body = {
        name,
        email,
        password,
        userType: userType ? "doctor" : "normal",
        speialization,
        address,
        phone,
        workingHours,
        location: {
          latitude: location ? location.coords.latitude : null,
          longitude: location ? location.coords.longitude : null,
        },
      };

      try {
        await axios.post(SIGNUP_URL, body);
        setFormData({
          name: "",
          email: "",
          password: "",
          speialization: "",
          address: "",
          phone: "",
          workingHours: "",
          location: null,
          userType: false,
        });

        setLoading(false);

        props.navigation.navigate("SignIn", {
          alert: { messages: "تم تسجيل حسابك بنجاح", type: "success" },
        });
      } catch (e) {
        console.log(e);
        setAlert({ messages: e.response.data.message, type: "danger" });
      }
    })();
  };

  const {
    name,
    email,
    password,
    speialization,
    address,
    phone,
    workingHours,
    userType,
  } = formData;
  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
      <Loader title="جاري إنشاء حساب جديد" loading={isLoading} />
      <Alert messages={alert.messages} type={alert.type} />
      <View style={styles.container}>
        <ScreenTitle title="إنشاء حساب جديد" icon="md-person-add" />
        <KeyboardAvoidingView behavior="padding" enabled>
          <Input
            onChangeText={(text) => changeFormValue("name", text)}
            value={name}
            placeholder="الاسم"
          />
          <Input
            onChangeText={(text) => changeFormValue("email", text)}
            value={email}
            placeholder="البريد الإلكتروني"
          />
          <Input
            onChangeText={(text) => changeFormValue("password", text)}
            value={password}
            secureTextEntry
            placeholder="كلمة المرور"
          />

          <View style={styles.checkboxContainer}>
            <Checkbox
              style={styles.checkbox}
              value={userType}
              onValueChange={() => changeFormValue("userType", !userType)}
            />
            <Text style={styles.checkboxLabel}>طبيب</Text>
          </View>
          {userType && (
            <React.Fragment>
              <Input
                onChangeText={(text) => changeFormValue("speialization", text)}
                value={speialization}
                placeholder="التخصص"
              />
              <Input
                onChangeText={(text) => changeFormValue("workingHours", text)}
                value={workingHours}
                placeholder="ساعات العمل"
              />
              <Input
                onChangeText={(text) => changeFormValue("address", text)}
                value={address}
                placeholder="العنوان"
              />
              <Input
                onChangeText={(text) => changeFormValue("phone", text)}
                value={phone}
                placeholder="الهاتف"
              />
            </React.Fragment>
          )}

          <Button text="إنشاء" onPress={_signUp} />
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
}

export default SignUpScreen;
