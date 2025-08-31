import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@react-navigation/native';

type TextProps = RNTextProps & {
  variant?: 'default' | 'title' | 'subtitle' | 'caption';
};

export function Text({ style, variant = 'default', ...props }: TextProps) {
  const { colors } = useTheme();

  const variantStyles = {
    caption: {
      color: colors.text,
      fontSize: 12,
      opacity: 0.6,
    },
    default: {
      color: colors.text,
      fontSize: 16,
    },
    subtitle: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 16,
      opacity: 0.7,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
  };

  return <RNText style={[variantStyles[variant], style]} {...props} />;
}
