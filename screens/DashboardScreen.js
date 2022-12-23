import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, RefreshControl } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

export const DashboardScreen = ({ navigation }) => {

  const [data, setData] = useState([])
  const [username, setUsername] = useState("")
  const [refreshing, setRefreshing] = useState(false);

  const allRec = async () => {
    setRefreshing(true)
    const user_name = await AsyncStorage.getItem('@username')
    setUsername(user_name)
    const token = await AsyncStorage.getItem('@token')
    await axios.get('http://192.168.29.106:5000/allRecords', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).then(response => {
      console.log('here', response.data);
      setData(response.data.record);
      setRefreshing(false)
    }).catch(err => {
      console.error('error', err.toJSON());
      setRefreshing(false)
    })
  }

  const getDate = (createdDate) => {
    var dateUTC = new Date(createdDate);
    var dateUTC = dateUTC.getTime()
    var dateIST = new Date(dateUTC);
    //date shifting for IST timezone (+5 hours and 30 minutes)
    dateIST.setHours(dateIST.getHours() + 5);
    dateIST.setMinutes(dateIST.getMinutes() + 30);
    return dateIST.toISOString().replace(/T.*/, '').split('-').reverse().join('-');
  }

  const Item = ({ title, desc, doc, location, date, recId, createdon }) => (
    <TouchableOpacity onPress={() => {
      Alert.alert(
        'Delete Record?',
        `Records once deleted can't be recovered!`,
        [
          { text: 'Cancel' },
          {
            text: 'OK', onPress: async () => {
              setRefreshing(true)
              const token = await AsyncStorage.getItem('@token')
              await axios.delete(`http://192.168.29.106:5000/deleteRecord/${recId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
              })
                .then(response => {
                  allRec()
                })
                .catch(err => {
                  console.log("errors in response ", err);
                });
            }
          }
        ],
        { cancelable: false }
      )
    }}>
      <View style={styles.card}>
        <Text style={styles.attr}>Title: {title}</Text>
        <Text style={styles.attr}>Description: {desc}</Text>
        <Text style={styles.attr}>Doctor Name: {doc}</Text>
        <Text style={styles.attr}>Location: {location}</Text>
        <Text style={styles.attr}>Date of Record: {date}</Text>
        <Text style={styles.attr}>Created on: {getDate(createdon)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} desc={item.description} doc={item.doctor_name} location={item.location} date={item.date_of_actual_record} recId={item._id} createdon={item.created_at}/>
  );

  useEffect(() => {
    allRec()
  }, [])

  const clearAll = async () => {
    try {
      await AsyncStorage.clear()
      navigation.navigate("Sign In")
    } catch (e) {
      // clear error
      console.error(e)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const user_name = await AsyncStorage.getItem('@username')
    setUsername(user_name)
    const token = await AsyncStorage.getItem('@token')
    await axios.get('http://192.168.29.106:5000/allRecords', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).then(response => {
      console.log('here', response.data);
      setData(response.data.record);
      setRefreshing(false)
    }).catch(err => {
      console.error('error', err.toJSON());
      setRefreshing(false)
    })
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeTop}>Welcome, {username}</Text>
        <TouchableOpacity
          onPress={() => {
            clearAll()
          }}
        >
          <Text style={styles.logout}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.welcome}>Create a new Record</Text>
      <View style={styles.newRecordBtn}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Add new Record")}
        >
          <Text style={styles.btnText}>New Record</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.welcome}>Past Records</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
    marginBottom: 8,
  },
  welcomeTop: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
    marginVertical: 8,
    marginBottom: 20,
  },
  logout: {
    fontSize: 18,
    color: 'black',
    marginVertical: 8,
    marginBottom: 20,
  },
  choose: {
    fontSize: 24,
    color: 'black'
  },
  newRecordBtn: {
    backgroundColor: '#00A372',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#00A372',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  attr: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  }
})
