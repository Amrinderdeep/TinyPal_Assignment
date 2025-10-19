import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';

const tinuImg = require('../../assets/tinu.png');

export default function TinuMiniBar({ onOpen }) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.shell}>
        <Image source={tinuImg} style={styles.tinu} />
        <Text style={styles.text}>What are considered distractions?</Text>
        <Pressable style={styles.ask} onPress={onOpen}>
          <Text style={{ fontWeight: '700' }}>Ask Tinu</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, bottom: 12, alignItems: 'center', zIndex: 1000 },
  shell: { width: '92%', backgroundColor: '#fff', borderRadius: 28, padding: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, elevation: 4 },
  tinu: { width: 44, height: 44, marginRight: 12 },
  text: { flex: 1, color: '#111' },
  ask: { backgroundColor: '#ffd6e0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
});
