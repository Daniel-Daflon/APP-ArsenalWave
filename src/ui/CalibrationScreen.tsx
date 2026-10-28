import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  Circle,
  G,
  Line,
  Path,
  Text as SvgText,
} from 'react-native-svg';
import { WeaponOption } from './WeaponSilhouetteSvg';

interface CalibrationScreenProps {
  selectedWeapon: WeaponOption;
  onStartRecording: () => void;
  onBack?: () => void;
}

/**
 * Tela 2: Distância Adequada (Calibração de Posicionamento)
 * Exibe diagrama SVG com dois círculos concêntricos pretos e setas indicando
 * RAIO INTERNO: 5 CM e RAIO EXTERNO: 15 CM, instruções e botão COMEÇAR.
 */
export const CalibrationScreen: React.FC<CalibrationScreenProps> = ({
  selectedWeapon,
  onStartRecording,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <Text style={styles.headerTitle}>DISTÂNCIA ADEQUADA</Text>
          <Text style={styles.weaponBadgeText}>{selectedWeapon.name}</Text>
        </View>

        {/* Diagrama Central SVG: Dois círculos concêntricos pretos e setas de raio */}
        <View style={styles.diagramContainer}>
          <Svg width={310} height={300} viewBox="0 0 310 300">
            {/* Zona anelar ideal suavemente destacada */}
            <Circle
              cx="155"
              cy="155"
              r="105"
              fill="#F1F5F1"
              stroke="#141414"
              strokeWidth="2.5"
            />
            {/* Círculo Interno (5 cm) */}
            <Circle
              cx="155"
              cy="155"
              r="42"
              fill="#FFFFFF"
              stroke="#141414"
              strokeWidth="2.5"
            />

            {/* Ponto central (fonte / referência acústica) */}
            <Circle cx="155" cy="155" r="4" fill="#141414" />

            {/* Seta e rótulo do RAIO INTERNO: 5 CM */}
            <G>
              {/* Linha do centro até a borda do círculo interno (para cima-direita) */}
              <Line
                x1="155"
                y1="155"
                x2="184"
                y2="126"
                stroke="#141414"
                strokeWidth="2"
              />
              {/* Ponta da seta no círculo interno */}
              <Path d="M185 125 L176 128 L181 133 Z" fill="#141414" />
              {/* Linha de chamada para o texto superior */}
              <Line
                x1="172"
                y1="138"
                x2="198"
                y2="84"
                stroke="#141414"
                strokeWidth="1.5"
                strokeDasharray="3,2"
              />
              <SvgText
                x="155"
                y="32"
                fill="#141414"
                fontSize="12.5"
                fontWeight="bold"
                textAnchor="middle">
                RAIO INTERNO: 5 CM
              </SvgText>
              {/* Seta vertical apontando para a borda superior do círculo interno */}
              <Line
                x1="155"
                y1="38"
                x2="155"
                y2="109"
                stroke="#141414"
                strokeWidth="1.8"
              />
              <Path d="M155 112 L150 103 L160 103 Z" fill="#141414" />
            </G>

            {/* Seta e rótulo do RAIO EXTERNO: 15 CM */}
            <G>
              {/* Linha radial do centro até a borda externa (horizontal à direita) */}
              <Line
                x1="155"
                y1="155"
                x2="256"
                y2="155"
                stroke="#141414"
                strokeWidth="2"
              />
              {/* Ponta da seta no círculo externo */}
              <Path d="M260 155 L250 150 L250 160 Z" fill="#141414" />

              {/* Seta inferior indicando a borda do círculo externo */}
              <Line
                x1="155"
                y1="278"
                x2="155"
                y2="263"
                stroke="#141414"
                strokeWidth="1.8"
              />
              <Path d="M155 260 L150 269 L160 269 Z" fill="#141414" />
              <SvgText
                x="155"
                y="294"
                fill="#141414"
                fontSize="12.5"
                fontWeight="bold"
                textAnchor="middle">
                RAIO EXTERNO: 15 CM
              </SvgText>
            </G>
          </Svg>
        </View>

        {/* Textos informativos abaixo do diagrama */}
        <View style={styles.instructionsBlock}>
          <Text style={styles.relationTitle}>Relacione com opção</Text>
          <Text style={styles.subtitleText}>
            Posicione o microfone para que a gravação esteja dentro da área de
            tiro ideal.
          </Text>
        </View>

        {/* Botão largo verde (#7CB882) COMEÇAR */}
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.85}
          onPress={onStartRecording}>
          <Text style={styles.startButtonText}>COMEÇAR</Text>
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
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  headerBlock: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1D1A',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  weaponBadgeText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#5A625C',
  },
  diagramContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E3E7EA',
    width: '100%',
  },
  instructionsBlock: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  relationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2421',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#48504A',
    textAlign: 'center',
    lineHeight: 22,
  },
  startButton: {
    width: '100%',
    backgroundColor: '#7CB882',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
});
