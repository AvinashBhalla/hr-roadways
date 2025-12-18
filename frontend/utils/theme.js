import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
    displayLarge: { fontFamily: 'System', fontWeight: '700', fontSize: 57, letterSpacing: -0.25, lineHeight: 64 },
    displayMedium: { fontFamily: 'System', fontWeight: '700', fontSize: 45, letterSpacing: 0, lineHeight: 52 },
    displaySmall: { fontFamily: 'System', fontWeight: '700', fontSize: 36, letterSpacing: 0, lineHeight: 44 },
    headlineLarge: { fontFamily: 'System', fontWeight: '600', fontSize: 32, letterSpacing: 0, lineHeight: 40 },
    headlineMedium: { fontFamily: 'System', fontWeight: '600', fontSize: 28, letterSpacing: 0, lineHeight: 36 },
    headlineSmall: { fontFamily: 'System', fontWeight: '600', fontSize: 24, letterSpacing: 0, lineHeight: 32 },
    titleLarge: { fontFamily: 'System', fontWeight: '500', fontSize: 22, letterSpacing: 0, lineHeight: 28 },
    titleMedium: { fontFamily: 'System', fontWeight: '500', fontSize: 16, letterSpacing: 0.15, lineHeight: 24 },
    titleSmall: { fontFamily: 'System', fontWeight: '500', fontSize: 14, letterSpacing: 0.1, lineHeight: 20 },
    labelLarge: { fontFamily: 'System', fontWeight: '600', fontSize: 14, letterSpacing: 0.1, lineHeight: 20 },
    bodyLarge: { fontFamily: 'System', fontWeight: '400', fontSize: 16, letterSpacing: 0.5, lineHeight: 24 },
    bodyMedium: { fontFamily: 'System', fontWeight: '400', fontSize: 14, letterSpacing: 0.25, lineHeight: 20 },
};

export const theme = {
    ...MD3LightTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
        ...MD3LightTheme.colors,
        primary: '#1A237E', // Deep Blue
        onPrimary: '#FFFFFF',
        primaryContainer: '#C5CAE9',
        secondary: '#00E5FF', // Electric Cyan
        onSecondary: '#000000',
        secondaryContainer: '#80DEEA',
        tertiary: '#FF4081', // Pink Accent
        background: '#F5F5F5',
        surface: '#FFFFFF',
        surfaceVariant: '#E0E0E0',
        onSurface: '#121212',
        error: '#D32F2F',
        elevation: {
            level0: 'transparent',
            level1: '#F8F9FA',
            level2: '#F1F3F4',
            level3: '#E8EAED',
            level4: '#E1E3E6',
            level5: '#DADCE0',
        },
    },
    roundness: 12,
};
