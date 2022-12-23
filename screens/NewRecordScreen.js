import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const NewRecordScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [doctor, setDoctor] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const newRec = async () => {
    const token = await AsyncStorage.getItem('@token')
    await axios.post('http://192.168.29.106:5000/addRecord', {
      "title": title,
      "description": desc,
      "doctor_name": doctor,
      "location": location,
      "date_of_actual_record": date
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).then(response => {
      console.log('here newRec', response.data);
      navigation.navigate("Dashboard")
    }).catch(err => {
      console.error('error', err.toJSON());
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a new Record</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Title"
          placeholderTextColor="#003f5c"
          onChangeText={(title) => setTitle(title)}
        />
      </View>

      <View style={styles.inputViewDesc}>
        <TextInput
          style={styles.TextInput}
          placeholder="Description"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          multiline
          onChangeText={(desc) => setDesc(desc)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Doctor Name"
          placeholderTextColor="#003f5c"
          onChangeText={(doctor) => setDoctor(doctor)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Location"
          placeholderTextColor="#003f5c"
          onChangeText={(location) => setLocation(location)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Date (in any format)"
          placeholderTextColor="#003f5c"
          onChangeText={(date) => setDate(date)}
        />
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={() => {
        newRec()
      }}>
        <Text style={styles.loginText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    marginBottom: 60,
    color: 'black',
    fontWeight: 'bold',
  },
  inputView: {
    backgroundColor: "#00A372",
    borderRadius: 30,
    width: "70%",
    height: 50,
    marginBottom: 20,
  },
  inputViewDesc: {
    backgroundColor: "#00A372",
    borderRadius: 30,
    width: "70%",
    height: 150,
    marginBottom: 20,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  forgot_button: {
    height: 30,
    marginTop: 30,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#00A372",
  },
});

export default NewRecordScreen;