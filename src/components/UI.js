import React from 'react';
import { View, Text, Pressable, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const Card = ({ title, subtitle, image, onPress, variant = 'default' }) => {
  if (variant === 'full') {
    return (
      <Pressable style={styles.fullCard} onPress={onPress}>
        {image ? <Image source={image} style={styles.fullImage} resizeMode="cover" /> : null}
        <View style={styles.fullBody}>
          <Text style={styles.fullIndex}>{/* optional index */}</Text>
          <Text style={styles.fullTitle}>{title}</Text>
          {subtitle ? <Text style={styles.fullSubtitle}>{subtitle}</Text> : null}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {image ? <Image source={image} style={styles.cardImage} /> : null}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
};

export const Chip = ({ children, onPress }) => (
  <Pressable style={styles.chip} onPress={onPress}>
    <Text style={styles.chipText}>{children}</Text>
  </Pressable>
);

export const IconButton = ({ children, onPress }) => (
  <Pressable style={styles.iconButton} onPress={onPress}>
    <Text>{children}</Text>
  </Pressable>
);

const CARD_WIDTH = width - 32;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 13, color: '#666', marginTop: 4 },

  // full-bleed card styles (like screenshots)
  fullCard: {
    width: CARD_WIDTH,
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  fullImage: {
    width: '100%',
    height: CARD_WIDTH * 0.6,
  },
  fullBody: {
    padding: 18,
    backgroundColor: '#f3f4f6',
  },
  fullIndex: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', paddingHorizontal: 8, borderRadius: 12 },
  fullTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  fullSubtitle: { color: '#1f2937', lineHeight: 20 },

  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  chipText: { fontSize: 13 },
  iconButton: { padding: 8 },
});
