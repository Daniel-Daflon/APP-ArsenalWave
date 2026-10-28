/**
 * Contrato exclusivo de comunicação entre a camada de aplicação (UI / Captura de Áudio)
 * e o motor matemático de Processamento Digital de Sinais (DSP portado do MATLAB).
 */

export type AmbientNoiseLevel = 'Baixo' | 'Médio' | 'Alto';

/**
 * Configuração de inicialização do motor DSP.
 */
export interface DspConfig {
  /** Taxa de amostragem do áudio capturado em Hz (ex: 44100 ou 48000) */
  sampleRate: number;
  /** Tamanho esperado do bloco/janela de amostras (ex: 1024, 2048, 4096) */
  bufferSize: number;
  /** Ativa o modo de simulação (mock) para testes de UI sem processamento real */
  mockMode?: boolean;
  /** Cadência alvo simulada (em RPM) quando mockMode = true */
  mockTargetRpm?: number;
}

/**
 * Representa um evento acústico (disparo) detectado pelo motor DSP.
 */
export interface DetectedShotEvent {
  /** Índice sequencial do evento na sessão atual (1, 2, 3...) */
  index: number;
  /** Instante do evento em segundos desde o início da captura */
  timestampSec: number;
  /** Intervalo delta-t (em segundos) em relação ao evento imediatamente anterior (null no 1º disparo) */
  deltaTSec: number | null;
  /** Cadência instantânea estimada neste intervalo em RPM (60 / deltaTSec) */
  instantRpm: number | null;
  /** Amplitude/pico normalizado reportado pelo detector do MATLAB */
  peakAmplitude: number;
}

/**
 * Resultado consolidado retornado a cada bloco de áudio processado.
 */
export interface CadenceMetrics {
  /** Total acumulado de eventos detectados na sessão atual */
  totalEvents: number;
  /** Cadência média global (em RPM / TPM) baseada nos intervalos delta-t */
  averageRpm: number;
  /** Cadência instantânea do último par de eventos (em RPM / TPM) */
  currentRpm: number;
  /** Cadência máxima da sessão (em RPM / TPM) baseada no menor delta-t */
  maxRpm: number;
  /** Cadência mínima da sessão (em RPM / TPM) baseada no maior delta-t */
  minRpm: number;
  /** Último intervalo delta-t registrado (em segundos), ou null se < 2 eventos */
  lastDeltaTSec: number | null;
  /** Intervalo delta-t médio (em segundos), ou null se < 2 eventos */
  averageDeltaTSec: number | null;
  /** Classificação do nível de ruído ambiente reportado pelo motor DSP */
  ambientNoiseLevel: AmbientNoiseLevel;
  /** Percentual de confiança na detecção (0 a 100) */
  detectionConfidencePct: number;
  /** Array simplificado de amplitudes normalizadas (0.0 a 1.0) para plotar a forma de onda na UI */
  waveformPreview: number[];
  /** Lista de novos eventos detectados especificamente no buffer recém-processado */
  newEvents: DetectedShotEvent[];
  /** Histórico completo de eventos da sessão atual */
  allEvents: DetectedShotEvent[];
  /** Tempo total de áudio processado na sessão (em segundos) */
  elapsedAudioTimeSec: number;
}

/**
 * Interface que deve ser implementada pelo processador DSP (`MatlabDsp`).
 * A camada React Native consome exclusivamente estes métodos.
 */
export interface IDspProcessor {
  /**
   * Inicializa ou reconfigura o motor DSP com os parâmetros de amostragem.
   * @param config Configurações de taxa de amostragem, buffer e modo de simulação.
   */
  initialize(config: DspConfig): void;

  /**
   * Recebe um buffer bruto de áudio mono (PCM Float32Array normalizado entre -1.0 e 1.0)
   * e retorna as métricas atualizadas de cadência.
   *
   * @param pcmBuffer Vetor de amostras PCM em ponto flutuante de precisão simples.
   * @returns Métricas de cadência atualizadas após o processamento da janela.
   */
  processAudioFrame(pcmBuffer: Float32Array): CadenceMetrics;

  /**
   * Reinicia o estado interno do processador (histórico de eventos, contadores e estados de filtros)
   * para o início de uma nova sessão de captura.
   */
  reset(): void;

  /**
   * Retorna um snapshot das métricas atuais sem processar novas amostras.
   */
  getMetrics(): CadenceMetrics;

  /**
   * Permite alternar em tempo de execução o modo de simulação/mock para testes de UI.
   * @param enabled Se verdadeiro, gera eventos sintéticos para validação de interface.
   * @param targetRpm Cadência simulada desejada em disparos por minuto (padrão: 600 RPM).
   */
  setMockMode(enabled: boolean, targetRpm?: number): void;
}
