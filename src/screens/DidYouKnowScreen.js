import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, ImageBackground, Pressable, Dimensions } from 'react-native';
import API from '../api';
import { Card } from '../components/UI';

const didYouKnowImg = require('../../assets/didyouknow.png');
const bulbImg = require('../../assets/bulb.png');
const arrowImg = require('../../assets/arrow.png');

export default function DidYouKnowScreen({ openTinu, onBack }) {
  const [dyk, setDyk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  const { width, height } = Dimensions.get('window');
  const IMAGE_HEIGHT = Math.round(height * 0.4);
  const OVERLAY_TOP = IMAGE_HEIGHT - 60; // overlap by 60px
  const OVERLAY_HEIGHT = Math.round(height * 0.5) + 20;

  useEffect(() => {
    let mounted = true;
    API.fetchP13nAnswers()
      .then((res) => {
        if (!mounted) return;
        const cards = res.dyk_cards || [];
        // normalize fields we expect
        setDyk(
          cards.map((c) => ({
            id: c.id,
            title: c.title || c.heading,
            sub_heading: c.sub_heading || c.subHeading || '',
            content: c.content || c.description || c.summary || '',
            citation: (c.citation && c.citation.label) || '',
            image_url: API.makeImageUrl(c.image_url),
            tinu_activation: c.tinu_activation,
          }))
        );
      })
      .catch((e) => {
        console.warn('fetchP13nAnswers failed', e.message);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backBtn} onPress={() => onBack && onBack()}>
          <Text style={styles.backText}>{'‹'}</Text>
        </Pressable>
        <View style={styles.vertDivider} />
        
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>UNLEARN OLD PATTERNS</Text>
          <Text style={styles.small}>Distractions=No No!</Text>
        </View>
      </View>

      {/* story-like progress bar */}
      {dyk.length > 0 && (
        <View style={styles.storyBarWrap}>
          <View style={styles.storyBarTrack} />
          <View style={[styles.storyBarIndicator, { width: ((index + 1) / Math.max(1, dyk.length)) * 100 + '%' }]} />
        </View>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <View style={{ flex: 1 }}>
          {dyk.length === 0 ? (
            <Text style={{ color: '#666', padding: 16 }}>No cards available</Text>
          ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                ref={listRef}
                data={dyk}
                keyExtractor={(_, i) => String(i)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(ev) => setIndex(Math.round(ev.nativeEvent.contentOffset.x / width))}
                renderItem={({ item, index: idx }) => (
                  <View style={{ width, alignItems: 'center' }}>
                    {/* background image */}
                    <ImageBackground source={ item.image_url ? { uri: item.image_url } : didYouKnowImg } style={[styles.bgImage, { height: IMAGE_HEIGHT, width }]} resizeMode="cover">
                    </ImageBackground>

                    {/* pink overlay card */}
                    <View style={[styles.overlayCard, { top: OVERLAY_TOP, height: OVERLAY_HEIGHT }]}>
                      <Image source={bulbImg} style={styles.overlayBulb} />
                      <View style={styles.chipsRow}>
                        {/* if tinu_activation provides chips or tags, render them; fallback to title fragments */}
                        <View style={styles.chipBox}><Text style={styles.chipText}>{item.title}</Text></View>
                        <Image source={arrowImg} style={styles.arrow} />
                        <View style={styles.chipBox}><Text style={styles.chipText}>{item.sub_heading || item.citation}</Text></View>
                      </View>
                      <Text style={styles.overlayText}>{item.content}</Text>
                      <Text style={styles.citation}>{item.citation}</Text>

                      {/* Ask Tinu CTA */}
                      {item.tinu_activation && (
                        <Pressable
                          onPress={() => {
                            // call activation then open the tinu drawer with context
                            API.activateTinu(item.tinu_activation.parameters).catch((e) => console.warn('activateTinu failed', e.message));
                            openTinu({ context: item.tinu_activation.parameters, source: 'dyk_card', card: item });
                          }}
                          style={{ marginTop: 16, backgroundColor: 'rgba(255,255,255,0.12)', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 }}
                        >
                          <Text style={{ color: '#fff', fontWeight: '700' }}>{item.tinu_activation.cta_label || item.tinu_activation.label || 'Ask Tinu'}</Text>
                        </Pressable>
                      )}
                    </View>

                    {/* spacer for mini bar */}
                    <View style={{ height: 90 }} />
                  </View>
                )}
              />

              {/* tap zones to navigate left/right */}
              <Pressable
                style={[styles.tapZone, { left: 0 }]}
                onPress={() => {
                  const next = index - 1 < 0 ? dyk.length - 1 : index - 1;
                  listRef.current && listRef.current.scrollToIndex({ index: next });
                }}
              />
              <Pressable
                style={[styles.tapZone, { right: 0 }]}
                onPress={() => {
                  const next = index + 1 > dyk.length - 1 ? 0 : index + 1;
                  listRef.current && listRef.current.scrollToIndex({ index: next });
                }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2b021f' },
  headerRow: { padding: 12, paddingTop: 36, backgroundColor: '#2b021f', flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#fff' },
  small: { color: '#d1b7c6', marginTop: 4, fontSize: 12 },
  bgImage: { resizeMode: 'cover', height: '100%', width: '100%' },
  overlayCard: {
    position: 'absolute',
    borderTopStartRadius: 164,
    borderTopEndRadius: 164,
    borderBottomEndRadius: 64,
    borderBottomStartRadius: 64,
    padding: 20,
    backgroundColor: '#eaa0b1',
    alignItems: 'center',
    overflow: 'visible',
    zIndex: 3,
  },
  overlayBulb: { width: 100, height: 64, position: 'absolute', top: -32, left: '50%', marginLeft: -32, zIndex: 5 },
  chipsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  chipBox: { backgroundColor: 'rgba(255,255,255,0.18)', padding: 12, borderRadius: 12, marginHorizontal: 8, width: 120, alignItems: 'center' },
  chipText: { color: '#fff', textAlign: 'center' },
  arrow: { width: 28, height: 28, tintColor: '#fff' },
  overlayText: { color: '#fff', marginTop: 16, textAlign: 'center', lineHeight: 20 },
  citation: { color: '#ffe6ee', marginTop: 12, textDecorationLine: 'underline' },
  
  tapZone: { position: 'absolute', top: 0, bottom: 0, width: '30%' },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  backText: { color: '#fff', fontSize: 40, lineHeight: 20 },
  vertDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.12)', marginRight: 8 },
  storyBarWrap: { height: 8, backgroundColor: 'transparent' },
  storyBarTrack: { height: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 16, borderRadius: 2 },
  storyBarIndicator: { height: 2, backgroundColor: '#fff', position: 'absolute', left: 16, top: 0, borderRadius: 2 },
});
