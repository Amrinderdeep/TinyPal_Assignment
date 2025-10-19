import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import DidYouKnowScreen from './src/screens/DidYouKnowScreen';
import FlashCardScreen from './src/screens/FlashCardScreen';
import HomeScreen from './src/screens/HomeScreen';
import TinuBottomSheet from './src/components/TinuBottomSheet';
import TinuMiniBar from './src/components/TinuMiniBar';

export default function App() {
  const [screen, setScreen] = React.useState('home'); // 'home' | 'didyouknow' | 'flashcard'
  const [tinuVisible, setTinuVisible] = React.useState(false);
  const [tinuProps, setTinuProps] = React.useState({});

  function openTinu(props = {}) {
    setTinuProps(props);
    setTinuVisible(true);
  }

  function go(screenName) {
    setScreen(screenName);
  }

  function goBack() {
    setScreen('home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {screen === 'home' && <HomeScreen onSelect={(s) => go(s)} />}
        {screen === 'didyouknow' && <DidYouKnowScreen openTinu={openTinu} onBack={goBack} />}
        {screen === 'flashcard' && <FlashCardScreen openTinu={openTinu} onBack={goBack} />}
      </View>

      <View style={styles.overlay} pointerEvents="box-none">
        <TinuBottomSheet visible={tinuVisible} onClose={() => setTinuVisible(false)} contextProps={tinuProps} />
        <TinuMiniBar onOpen={() => openTinu({ context: 'general' })} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, position: 'absolute', justifyContent: 'flex-end', alignItems: 'center', zIndex: 9999 },
});
