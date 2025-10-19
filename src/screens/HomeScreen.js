import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function HomeScreen({ onSelect }) {
  return (
    <View style={styles.container}>
        <View style={styles.footer}>
        <Text style={styles.submitterLabel}>Submission by</Text>
        <Text style={styles.submitterName}>Amrinderdeep Singh Bhatt</Text>
        <Text style={styles.submitterContact}>9814820822 • amrinderdeepbhatt@gmail.com</Text>
      </View>
      <Text style={styles.title}>TinyPal</Text>
      <Text style={styles.subtitle}>Evidence-based parenting tips, simplified</Text>

      <View style={styles.buttons}>
        <Pressable style={styles.card} onPress={() => onSelect('didyouknow')}>
          <Text style={styles.cardTitle}>Did You Know</Text>
          <Text style={styles.cardDesc}>Short evidence-backed insights</Text>
        </Pressable>
        <Pressable style={styles.card} onPress={() => onSelect('flashcard')}>
          <Text style={styles.cardTitle}>Flash Cards</Text>
          <Text style={styles.cardDesc}>Quick actionable tips</Text>
        </Pressable>
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff7fb' },
  title: { fontSize: 32, fontWeight: '900', marginBottom: 6, color: '#2b021f' },
  subtitle: { color: '#6b21a8', marginBottom: 24 },
  buttons: { width: '100%' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 14, marginVertical: 8, alignItems: 'flex-start', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, border: '1px solid #000' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#2b021f' },
  cardDesc: { color: '#6b21a8', marginTop: 6 },
  footer: { position: 'absolute', top: 28, alignItems: 'center' },
  submitterLabel: { color: '#999', fontSize: 12 },
  submitterName: { fontWeight: '700', marginTop: 4, color: '#2b021f' },
  submitterContact: { color: '#6b21a8', marginTop: 2 },
});
