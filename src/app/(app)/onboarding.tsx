import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useUserStore } from 'src/store';
import Text from 'src/ui/Text';
import { useRef, useState, useEffect } from 'react';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  FadeInDown,
} from 'react-native-reanimated';
import { LIFE_ASPECTS } from 'src/constants';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

interface DotProps {
  active: boolean;
  color: string;
}

const Dot = ({ active, color }: DotProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(active ? 24 : 8, {
        mass: 0.5,
        stiffness: 200,
        damping: 15,
      }),
      backgroundColor: withTiming(active ? color : '#e0e0e0', {
        duration: 300,
      }),
      opacity: withTiming(active ? 1 : 0.5, { duration: 200 }),
    };
  }, [active, color]);

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};
export default function OnboardingScreen() {
  const pagerRef = useRef<PagerView>(null);
  const nameInputRef = useRef<TextInput>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [name, setName] = useState('');
  const { setOnboarded, setName: setUserName } = useUserStore();

  // Auto-focus the input when the name slide is shown
  useEffect(() => {
    if (currentPage === LIFE_ASPECTS.length) {
      // Small delay to ensure the input is mounted
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const handleComplete = () => {
    if (name.trim()) {
      setUserName(name.trim());
    }
    setOnboarded(true);
    router.replace('/(app)/(tabs)');
  };

  const handleNameSubmit = () => {
    if (name.trim()) {
      handleComplete();
    }
  };

  const renderNameSlide = () => (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View key="name" style={[styles.page, styles.namePage]}>
        <Animated.View
          entering={FadeIn.duration(600).delay(200)}
          style={styles.emojiContainer}
        >
          <Text style={[styles.emoji, { color: '#000' }]}>👋</Text>
        </Animated.View>

        <Animated.Text
          entering={FadeIn.duration(600).delay(300)}
          style={styles.title}
        >
          What's your name?
        </Animated.Text>

        <Animated.View
          entering={FadeIn.duration(600).delay(400)}
          style={styles.inputContainer}
        >
          <TextInput
            ref={nameInputRef}
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleNameSubmit}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600)}
          style={styles.buttonContainer}
        >
          <Pressable
            onPress={handleNameSubmit}
            style={[
              styles.button,
              { backgroundColor: name.trim() ? '#000' : '#e0e0e0' },
            ]}
            disabled={!name.trim()}
          >
            <Text
              style={[
                styles.buttonText,
                { color: name.trim() ? '#fff' : '#999' },
              ]}
            >
              Get Started
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );

  const onPageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setCurrentPage(e.nativeEvent.position);
  };

  return (
    <View style={styles.container}>
      <AnimatedPagerView
        initialPage={0}
        onPageSelected={onPageSelected}
        ref={pagerRef}
        style={styles.pager}
      >
        {LIFE_ASPECTS.map((item, index) => (
          <View key={item.id} style={styles.page}>
            <Animated.View
              entering={FadeIn.duration(600).delay(200)}
              style={[
                styles.emojiContainer,
                { backgroundColor: `${item.color}1A` },
              ]}
            >
              <Text style={[styles.emoji, { color: item.color }]}>
                {item.emoji}
              </Text>
            </Animated.View>

            <Animated.Text
              entering={FadeIn.duration(600).delay(300)}
              style={styles.title}
            >
              {item.name}
            </Animated.Text>

            <Animated.Text
              entering={FadeIn.duration(600).delay(400)}
              style={styles.description}
            >
              {item.description}
            </Animated.Text>
          </View>
        ))}
        {renderNameSlide()}
      </AnimatedPagerView>

      <View style={styles.progressContainer}>
        {[...LIFE_ASPECTS, null].map((item, i) => {
          const isActive = i === currentPage;
          const color =
            i === LIFE_ASPECTS.length
              ? '#000'
              : LIFE_ASPECTS[i]?.color || '#000';
          return <Dot key={i} active={isActive} color={color} />;
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    width: '80%',
    marginBottom: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    fontSize: 18,
    paddingVertical: 12,
    textAlign: 'center',
    color: '#000',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    borderRadius: 30,
    elevation: 3,
    minWidth: 200,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  description: {
    color: '#666',
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 40,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  dot: {
    borderRadius: 4,
    height: 8,
    marginHorizontal: 4,
  },
  emoji: {
    fontSize: 48,
  },
  emojiContainer: {
    alignItems: 'center',
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    marginBottom: 32,
    width: 120,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  namePage: {
    paddingBottom: 100,
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 30,
    borderWidth: 2,
    minWidth: 200,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  page: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  progressContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 40,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  title: {
    color: '#333',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
