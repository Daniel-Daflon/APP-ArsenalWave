import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { CadenceMetrics, IDspProcessor } from '../dsp/IDspProcessor';
import { WeaponOption } from './WeaponSilhouetteSvg';

interface RecordingScreenProps {
  processor: IDspProcessor;
  selectedWeapon: WeaponOption;
  onStopRecording: (finalMetrics: CadenceMetrics) => void;
}

const NUM_VISUALIZER_BARS = 36;
const SAMPLE_RATE = 44100;
const BUFFER_SIZE = 2048;

/**
 * Tela 3: Gravação de Áudio (Tema Claro)
 * Envia blocos PCM Float32Array para `IDspProcessor.processAudioFrame` e
 * atualiza o visualizador de barras verticais em gradiente verde/amarelo.
 */
export const RecordingScreen: React.FC<RecordingScreenProps> = ({
  processor,
  selectedWeapon,
  onStopRecording,
}) => {
  const [metrics, setMetrics] = useState<CadenceMetrics>(() =>
    processor.getMetrics(),
  );
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animação contínua do círculo vermelho pulsante no cabeçalho
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.25,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Loop de alimentação de buffers PCM Float32Array para o motor DSP (em modo Mock)
  useEffect(() => {
    processor.initialize({
      sampleRate: SAMPLE_RATE,
      bufferSize: BUFFER_SIZE,
      mockMode: true,
      mockTargetRpm: selectedWeapon.nominalRpm,
    });

    const pcmFrame = new Float32Array(BUFFER_SIZE);
    const intervalMs = Math.round((BUFFER_SIZE / SAMPLE_RATE) * 1000);

    const timerId = setInterval(() => {
      const updated = processor.processAudioFrame(pcmFrame);
      setMetrics(updated);
    }, intervalMs);

    return () => {
      clearInterval(timerId);
    };
  }, [processor, selectedWeapon]);

  const handleStopPress = () => {
    const finalSnapshot = processor.getMetrics();
    onStopRecording(finalSnapshot);
  };

  // Prepara as barras do visualizador a partir de `waveformPreview`
  const preview = metrics.waveformPreview;
  const bars: number[] = [];
  for (let i = 0; i < NUM_VISUALIZER_BARS; i++) {
    const idx = preview.length - NUM_VISUALIZER_BARS + i;
    const val = idx >= 0 && idx < preview.length ? preview[idx] : 0.08;
    bars.push(Math.max(0.06, Math.min(1, val)));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho: Ícone de Microfone à esquerda, Título ao centro, Círculo Vermelho Pulsante à direita */}
        <View style={styles.headerRow}>
          <View style={styles.micIconContainer}>
            <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
              <Rect
                x="9"
                y="2"
                width="6"
                height="11"
                rx="3"
                stroke="#1F2421"
                strokeWidth="2"
              />
              <Path
                d="M5 10V11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11V10"
                stroke="#1F2421"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <Line
                x1="12"
                y1="18"
                x2="12"
                y2="22"
                stroke="#1F2421"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <Line
                x1="8"
                y1="22"
                x2="16"
                y2="22"
                stroke="#1F2421"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </View>

          <Text style={styles.headerTitle}>GRAVAÇÃO DE ÁUDIO</Text>

          <Animated.View
            style={[styles.pulsingDotWrapper, { opacity: pulseAnim }]}>
            <View style={styles.pulsingRedCircle} />
          </Animated.View>
        </View>

        {/* Visualizador de Onda de Áudio (Barras Verticais em Gradiente Verde/Amarelo) */}
        <View style={styles.visualizerCard}>
          <Svg width={320} height={170} viewBox="0 0 320 170">
            <Defs>
              <LinearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#F2C94C" stopOpacity="1" />
                <Stop offset="50%" stopColor="#8AC926" stopOpacity="1" />
                <Stop offset="100%" stopColor="#2D9CDB" stopOpacity="0.15" />
              </LinearGradient>
              <LinearGradient id="greenYellowGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#F4D35E" stopOpacity="1" />
                <Stop offset="55%" stopColor="#7CB882" stopOpacity="1" />
                <Stop offset="100%" stopColor="#3B8EA5" stopOpacity="0.9" />
              </LinearGradient>
            </Defs>

            {/* Linha central de referência */}
            <Line
              x1="8"
              y1="85"
              x2="312"
              y2="85"
              stroke="#E2E8E4"
              strokeWidth="1"
            />

            {bars.map((amp, index) => {
              const barWidth = 5;
              const spacing = 3.5;
              const x = 10 + index * (barWidth + spacing);
              const barHeight = Math.max(10, amp * 142);
              const y = (170 - barHeight) / 2;

              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={2.5}
                  fill="url(#greenYellowGrad)"
                />
              );
            })}
          </Svg>
        </View>

        {/* Informações de Status e Detecção */}
        <View style={styles.statusSection}>
          <Text style={styles.statusInfoText}>
            Nível de Ruído Ambiente: {metrics.ambientNoiseLevel}
          </Text>
          <Text style={styles.statusInfoText}>
            Distância: Calibrada (15 cm)
          </Text>

          <Text style={styles.detectionText}>
            {metrics.totalEvents === 0
              ? 'Aguardando Detecção de Disparo...'
              : `Aguardando Detecção de Disparo... (${metrics.totalEvents} detectados | ${Math.round(
                  metrics.currentRpm || metrics.averageRpm,
                )} TPM)`}
          </Text>

          {/* Ícone de Mira / Retículo */}
          <View style={styles.reticleWrapper}>
            <Svg width={68} height={68} viewBox="0 0 68 68" fill="none">
              <G stroke="#2B312C" strokeWidth="2">
                <Circle cx="34" cy="34" r="22" />
                <Circle cx="34" cy="34" r="9" />
                <Circle cx="34" cy="34" r="2.2" fill="#D94336" stroke="none" />
                <Line x1="34" y1="4" x2="34" y2="18" />
                <Line x1="34" y1="50" x2="34" y2="64" />
                <Line x1="4" y1="34" x2="18" y2="34" />
                <Line x1="50" y1="34" x2="64" y2="34" />
              </G>
            </Svg>
          </View>
        </View>

        {/* Botão vermelho (#D94336) PARAR */}
        <TouchableOpacity
          style={styles.stopButton}
          activeOpacity={0.85}
          onPress={handleStopPress}>
          <Text style={styles.stopButtonText}>PARAR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  micIconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1D1A',
    letterSpacing: 0.7,
    textAlign: 'center',
  },
  pulsingDotWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulsingRedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D94336',
  },
  visualizerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E6E3',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statusSection: {
    alignItems: 'center',
    gap: 8,
  },
  statusInfoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2F3631',
    textAlign: 'center',
  },
  detectionText: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
    color: '#3F4E30',
    textAlign: 'center',
  },
  reticleWrapper: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    width: '100%',
    backgroundColor: '#D94336',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 3,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
