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
import { useNavigation } from '@react-navigation/native';
import { api } from '../../api/api';
import i18n from '../../assets/i18n/i18n';
import { createRegisterSchema } from '../../utils/validation';
import { styles } from './style';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  const handleRegister = async (values: any) => {
    try {
      await api.post('/auth/register', values);
      Alert.alert(i18n.t('success'), 'Registration successful! Please login.');
      navigation.navigate('Login');
    } catch (err: any) {
      const message =
        err.response?.data?.message ??
        err.message ??
        i18n.t('something_went_wrong');
      Alert.alert('Error', message);
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
          <Text style={styles.title}>{i18n.t('register')}</Text>

          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={createRegisterSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#666"
                  value={values.name}
                  onChangeText={handleChange('name')}
                />
                {touched.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                )}

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
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange('password')}
                />
                {touched.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.buttonText}>{i18n.t('register')}</Text>
                </TouchableOpacity>

                <View style={styles.bottomTextContainer}>
                  <Text style={styles.normalText}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text style={styles.linkText}>{i18n.t('login')}</Text>
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
