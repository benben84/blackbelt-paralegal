import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  return (
  <View style={styles.container}>
  <Text style={styles.title}>Blackbelt Paralegal</Text>
  <Button
    title="Create New Matter"
    onPress={() => alert('Matter created!')}
  />
</View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#005CB9', // California-blue
  },
});
