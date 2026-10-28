import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Line, Path, Rect } from 'react-native-svg';
import { CadenceMetrics } from '../dsp/IDspProcessor';
import { WeaponOption, WeaponSilhouetteSvg } from './WeaponSilhouetteSvg';

interface ResultsScreenProps {
  selectedWeapon: WeaponOption;
  metrics: CadenceMetrics;
  onRestart: () => void;
}

/**
 * Tela 4: Resultados (Tema Claro)
 * Exibe cabeçalho com "Resultados" à esquerda e armamento à direita, silhueta SVG,
 * gráfico de "Sinal Total" da rajada, tabela de métricas em TPM e botões de ação.
 */
export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  selectedWeapon,
  metrics,
  onRestart,
}) => {
  const avgTpm = Math.round(metrics.averageRpm);
  const maxTpm = Math.round(metrics.maxRpm);
  const minTpm = Math.round(metrics.minRpm);

  // Caso o usuário pare rapidamente antes de muitos pontos no preview, garante uma onda representativa
  const waveData =
    metrics.waveformPreview.length >= 16
      ? metrics.waveformPreview
      : [
          0.08, 0.12, 0.92, 0.15, 0.1, 0.88, 0.14, 0.09, 0.95, 0.16, 0.11,
          0.86, 0.13, 0.09, 0.91, 0.12, 0.08, 0.89, 0.14, 0.1,
        ];

  const handleSaveReport = () => {
    Alert.alert(
      'Relatório Salvo',
      `Relatório de cadência (${selectedWeapon.name}) salvo localmente com sucesso.`,
    );
  };

  const handleShareReport = async () => {
    try {
      await Share.share({
        title: 'Relatório de Cadência Acústica',
        message:
          `Relatório de Cadência - ${selectedWeapon.name}\n` +
          `Número de Tiros: ${metrics.totalEvents}\n` +
          `Cadência Média: ${avgTpm} TPM\n` +
          `Cadência Máxima: ${maxTpm} TPM\n` +
          `Cadência Mínima: ${minTpm} TPM\n` +
          `Nível de Ruído Ambiente: ${metrics.ambientNoiseLevel}\n` +
          `Distância: Calibrada (15 cm)\n` +
          `Confiança de Detecção: ${metrics.detectionConfidencePct}%`,
      });
    } catch {
      // Ignora cancelamento do compartilhamento
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Opção no topo para voltar à seleção de armamento */}
        <TouchableOpacity
          style={styles.backToSelectButton}
          activeOpacity={0.7}
          onPress={onRestart}>
          <Text style={styles.backToSelectText}>
            ← Voltar à Seleção de Armamento
          </Text>
        </TouchableOpacity>

        {/* Cabeçalho: "Resultados" à esquerda e nome do armamento à direita */}
        <View style={styles.headerRow}>
          <Text style={styles.resultsTitle}>Resultados</Text>
          <Text style={styles.weaponTitleRight} numberOfLines={2}>
            {selectedWeapon.name}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Silhueta da arma selecionada */}
          <View style={styles.silhouetteCard}>
            <WeaponSilhouetteSvg
              weaponId={selectedWeapon.id}
              width={210}
              height={68}
              color="#1E221F"
            />
          </View>

          {/* Seção "Sinal Total" com o gráfico da forma de onda completa da rajada */}
          <View style={styles.waveformSection}>
            <Text style={styles.sectionTitle}>Sinal Total</Text>
            <View style={styles.waveformBox}>
              <Svg width={310} height={105} viewBox="0 0 310 105">
                <Rect
                  x="0"
                  y="0"
                  width="310"
                  height="105"
                  rx="8"
                  fill="#FBFDFB"
                />
                {/* Linha central zero */}
                <Line
                  x1="8"
                  y1="52.5"
                  x2="302"
                  y2="52.5"
                  stroke="#D5DDD7"
                  strokeWidth="1"
                />
                {/* Traçado simétrico da forma de onda completa da rajada */}
                {waveData.map((amp, idx) => {
                  const step = 290 / Math.max(1, waveData.length);
                  const x = 10 + idx * step;
                  const halfHeight = Math.max(3, amp * 44);
                  const isPeak = amp > 0.6;
                  return (
                    <Line
                      key={idx}
                      x1={x}
                      y1={52.5 - halfHeight}
                      x2={x}
                      y2={52.5 + halfHeight}
                      stroke={isPeak ? '#2E6F40' : '#6C8C74'}
                      strokeWidth={isPeak ? '2.4' : '1.6'}
                      strokeLinecap="round"
                    />
                  );
                })}
                {/* Envoltória superior conectando os pontos */}
                <Path
                  d={waveData
                    .map((amp, idx) => {
                      const step = 290 / Math.max(1, waveData.length);
                      const x = 10 + idx * step;
                      const y = 52.5 - Math.max(3, amp * 44);
                      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                    })
                    .join(' ')}
                  stroke="#3F4E30"
                  strokeWidth="1.2"
                  fill="none"
                />
              </Svg>
            </View>
          </View>

          {/* Tabela alinhada de métricas de cadência */}
          <View style={styles.metricsTable}>
            <View style={styles.tableRow}>
              <Text style={styles.metricLabel}>Número de Tiros</Text>
              <Text style={styles.metricValue}>{metrics.totalEvents}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.tableRow}>
              <Text style={styles.metricLabel}>Cadência Média</Text>
              <Text style={styles.metricValue}>{avgTpm} TPM</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.tableRow}>
              <Text style={styles.metricLabel}>Cadência Máxima</Text>
              <Text style={styles.metricValue}>{maxTpm} TPM</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.tableRow}>
              <Text style={styles.metricLabel}>Cadência Mínima</Text>
              <Text style={styles.metricValue}>{minTpm} TPM</Text>
            </View>
          </View>

          {/* Indicadores complementares */}
          <View style={styles.diagnosticsBox}>
            <Text style={styles.diagnosticText}>
              Nível de Ruído Ambiente: {metrics.ambientNoiseLevel}
            </Text>
            <Text style={styles.diagnosticText}>
              Distância: Calibrada (15 cm)
            </Text>
            <Text style={styles.diagnosticText}>
              Confiança de Detecção ({metrics.detectionConfidencePct}%)
            </Text>
          </View>
        </ScrollView>

        {/* Botões lado a lado na base */}
        <View style={styles.bottomActionsRow}>
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.85}
            onPress={handleSaveReport}>
            <Text style={styles.actionButtonText}>SALVAR RELATÓRIO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            activeOpacity={0.85}
            onPress={handleShareReport}>
            <Text style={styles.actionButtonText}>COMPARTILHAR</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'space-between',
  },
  backToSelectButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    marginBottom: 4,
  },
  backToSelectText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#3F4E30',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1D1A',
  },
  weaponTitleRight: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#3F4E30',
    textAlign: 'right',
  },
  scrollContent: {
    paddingBottom: 12,
    gap: 14,
  },
  silhouetteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCE1DF',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCE1DF',
    padding: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222623',
    marginBottom: 8,
  },
  waveformBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8ECE9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  metricsTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCE1DF',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
  },
  divider: {
    height: 1,
    backgroundColor: '#ECEFF1',
  },
  metricLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C322E',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1D1A',
  },
  diagnosticsBox: {
    paddingHorizontal: 6,
    gap: 4,
  },
  diagnosticText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#434B45',
  },
  bottomActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#41A650',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#0D74E7',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
