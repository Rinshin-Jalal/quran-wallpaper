import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../constants/theme';

interface VersStepperProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label?: string;
}

export function VerseStepper({ value, onChange, min, max, label }: VersStepperProps) {
  const handleVerseInput = (inputValue: string) => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)));
    } else if (inputValue === '') {
      onChange(min);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.stepper}>
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => onChange(Math.max(min, value - 1))}
        >
          <Text style={styles.stepperText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.stepperInput}
          value={value.toString()}
          onChangeText={handleVerseInput}
          keyboardType="number-pad"
          selectTextOnFocus
          maxLength={3}
        />
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => onChange(Math.min(max, value + 1))}
        >
          <Text style={styles.stepperText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.maxText}>of {max}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    color: Colors.textTertiary,
    fontSize: FontSizes.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: {
    color: Colors.primary,
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.light,
  },
  stepperInput: {
    color: Colors.text,
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    minWidth: 60,
    textAlign: 'center',
    padding: 0,
  },
  maxText: {
    color: Colors.textDisabled,
    fontSize: FontSizes.base,
    marginTop: Spacing.md,
  },
});
