import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export default function App() {
  const [client, setClient] = useState('');
  const [caseType, setCaseType] = useState('');
  const [court, setCourt] = useState('');

  const createMatter = async () => {
    if (!client || !caseType || !court) return alert('Fill all fields');
    const { error } = await supabase
      .from('matters')
      .insert([{ client_name: client, case_type: caseType, court }]);
    if (error) alert('Error: ' + error.message);
    else {
      alert('Matter saved to cloud!');
      setClient(''); setCaseType(''); setCourt('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blackbelt Paralegal</Text>
      <TextInput style={styles.input} placeholder="Client Name" value={client} onChangeText={setClient} />
      <TextInput style={styles.input} placeholder="Case Type" value={caseType} onChangeText={setCaseType} />
      <TextInput style={styles.input} placeholder="Court" value={court} onChangeText={setCourt} />
      <Button title="Create New Matter" onPress={createMatter} />
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
    color: '#005CB9',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#005CB9',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginVertical: 6,
  },
});
