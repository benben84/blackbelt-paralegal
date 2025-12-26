import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [hearingDate, setHearingDate] = useState(new Date());

  const createMatter = async () => {
    if (!client || !caseType || !court) return alert('Fill all fields');

    // 1. Save the matter
    const { data: matter, error: matterError } = await supabase
      .from('matters')
      .insert([{ client_name: client, case_type: caseType, court }])
      .select()
      .single();
    if (matterError) return alert('Error: ' + matterError.message);

    // 2. Auto-insert 3 CA deadlines
    const deadlines = [
      { title: '16-court-day notice (CCP §1005)', days: 16 },
      { title: 'Discovery cutoff', days: 30 },
      { title: 'Tentative ruling check (L.A. rule)', days: 7 },
    ];

    for (const d of deadlines) {
      const due = new Date(hearingDate);
      due.setDate(due.getDate() - d.days);
      await supabase.from('deadlines').insert({
        matter_id: matter.id,
        title: d.title,
        due_date: due.toISOString(),
      });
    }

    alert('Matter + 3 deadlines saved to cloud!');
    setClient(''); setCaseType(''); setCourt(''); setHearingDate(new Date());
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blackbelt Paralegal</Text>
      <TextInput style={styles.input} placeholder="Client Name" value={client} onChangeText={setClient} />
      <TextInput style={styles.input} placeholder="Case Type" value={caseType} onChangeText={setCaseType} />
      <TextInput style={styles.input} placeholder="Court" value={court} onChangeText={setCourt} />
      <DateTimePicker value={hearingDate} mode="date" display="default" onChange={(_, date) => date && setHearingDate(date)} />
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
