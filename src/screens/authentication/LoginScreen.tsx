import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { Formik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../api/api';
import { requestFCMPermission } from '../../firebase/firebase';
import i18n from '../../assets/i18n/i18n';
import { createLoginSchema } from '../../utils/validation';
import { styles } from './style';

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const handleLogin = async (values: any) => {
    try {
      const res = await api.post('/auth/login', values);
      const { access_token, user } = res.data.data;

      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('userId', user.id);
      console.log('User logged in, token saved');

      console.log('Requesting FCM permission...');
      await requestFCMPermission(true);

      Alert.alert(i18n.t('success'), 'Login successful!');
      navigation.replace('ChatList');
    } catch (err: any) {
      const message =
        err.response?.data?.message ??
        err.message ??
        i18n.t('something_went_wrong');
      Alert.alert('Login Failed', message);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/image.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{i18n.t('login')}</Text>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={createLoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#666"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#666"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  secureTextEntry
                />
                {touched.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.buttonText}>{i18n.t('login')}</Text>
                </TouchableOpacity>

                <View style={styles.bottomTextContainer}>
                  <Text style={styles.normalText}>Don’t have an account? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                  >
                    <Text style={styles.linkText}>{i18n.t('register')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </ImageBackground>
  );
}
