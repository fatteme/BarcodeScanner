import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const serverUrl = 'http://192.168.1.6:8000'

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = (data) => {
    setScanned(true);
    alert(`Barcode has been scanned!`);
    sendDataToServer(data);
  };

  const sendDataToServer = ({ type, data }) => {
    fetch(`${serverUrl}/main/enter/${data}`, {
      method: 'POST',
    })
    .catch((error) => { alert(`Something went wrong with POST request, Please try again!, ${error}`); });
    fetch(`${serverUrl}/main/enter/${data}`, {
      method: 'GET',
    })
    .catch((error) => { alert(`Something went wrong with GET request, Please try again!, ${error}`); });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.ticket}>
          Cinema Ticket
        </Text>
        <Text style={styles.text}>
          Place your ticket barcode inside the frame to scan. avoid shakes to get result quickly.
        </Text>
      </View>
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject, styles.camera}
        />
        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      </View>
      <View style={styles.footer}>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    marginTop: 30,
    marginBottom: 20,
    margin: 20,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    paddingLeft: 10,
    height: 300,
    marginBottom: 10,
    borderWidth: 5,
    borderColor: '#0c60c190',
    height: 300,
    width: 300,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 20,
  },
  ticket: {
    fontWeight: 'bold',
    fontSize: 23,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    paddingLeft: 25,
    paddingRight: 25,
  },
});

