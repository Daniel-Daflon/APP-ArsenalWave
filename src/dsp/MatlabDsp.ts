import {
  AmbientNoiseLevel,
  CadenceMetrics,
  DetectedShotEvent,
  DspConfig,
  IDspProcessor,
} from './IDspProcessor';

/**
 * Esqueleto (Stub/Mock) do motor de Processamento Digital de Sinais (DSP).
 *
 * IMPORTANTE (REGRA DE ARQUITETURA):
 * Este arquivo NÃO contém filtros digitais, FFT ou algoritmos de detecção reais.
 * Toda a matemática e os coeficientes projetados no MATLAB devem ser inseridos
 * MANUALMENTE pelo desenvolvedor nas seções demarcadas abaixo.
 */
export class MatlabDsp implements IDspProcessor {
  private config: DspConfig = {
    sampleRate: 44100,
    bufferSize: 2048,
    mockMode: true,
    mockTargetRpm: 650,
  };

  private processedSamplesCount: number = 0;
  private events: DetectedShotEvent[] = [];
  private nextMockShotTimeSec: number = 0;
  private waveformHistory: number[] = [];
  private ambientNoiseLevel: AmbientNoiseLevel = 'Baixo';
  private detectionConfidencePct: number = 98;

  // ============================================================================
  // [MATLAB PORT] 1. COEFICIENTES E VETORES CONSTANTES DO MATLAB
  // ============================================================================
  // TODO (Desenvolvedor): Insira aqui os vetores exportados do MATLAB.
  // Exemplo:
  // private readonly B_COEFFS = new Float32Array([ /* b0, b1, b2... do MATLAB */ ]);
  // private readonly A_COEFFS = new Float32Array([ /* a0, a1, a2... do MATLAB */ ]);
  // private readonly WINDOW_VEC = new Float32Array([ /* janela exportada */ ]);
  // private readonly DETECTION_THRESHOLD: number = 0.0; // Limiar calibrado no MATLAB
  // private readonly MIN_REFRACTORY_SEC: number = 0.0;  // Tempo morto entre eventos

  // ============================================================================
  // [MATLAB PORT] 2. MEMÓRIA DE ESTADO ENTRE BUFFERS (Z-STATES / OVERLAP)
  // ============================================================================
  // TODO (Desenvolvedor): Declare aqui os vetores de estado para continuidade
  // entre janelas consecutivas (ex.: condições iniciais `zi`/`zf` do comando `filter`).
  // private filterStateZ: Float32Array = new Float32Array(0);
  // private lastEventSampleIndex: number = -1;

  constructor(initialConfig?: Partial<DspConfig>) {
    if (initialConfig) {
      this.config = { ...this.config, ...initialConfig };
    }
    this.reset();
  }

  public initialize(config: DspConfig): void {
    this.config = {
      ...this.config,
      ...config,
      mockTargetRpm: config.mockTargetRpm ?? this.config.mockTargetRpm ?? 650,
    };
    this.reset();

    // TODO (Desenvolvedor): Caso os vetores de estado do MATLAB dependam de
    // `config.sampleRate` ou `config.bufferSize`, aloque-os aqui.
  }

  public reset(): void {
    this.processedSamplesCount = 0;
    this.events = [];
    this.waveformHistory = [];
    this.ambientNoiseLevel = 'Baixo';
    this.detectionConfidencePct = 98;

    const intervalSec = 60 / (this.config.mockTargetRpm || 650);
    this.nextMockShotTimeSec = intervalSec;

    // TODO (Desenvolvedor): Zere aqui os vetores de estado (`filterStateZ.fill(0)`),
    // buffers de overlap e variáveis acumuladoras do algoritmo do MATLAB.
  }

  public setMockMode(enabled: boolean, targetRpm: number = 650): void {
    this.config.mockMode = enabled;
    this.config.mockTargetRpm = targetRpm;
  }

  public processAudioFrame(pcmBuffer: Float32Array): CadenceMetrics {
    const numSamples = pcmBuffer.length;
    if (numSamples === 0 || this.config.sampleRate <= 0) {
      return this.getMetrics();
    }

    const frameStartSample = this.processedSamplesCount;
    const frameEndSample = frameStartSample + numSamples;
    const newEvents: DetectedShotEvent[] = [];

    if (this.config.mockMode) {
      // ------------------------------------------------------------------------
      // MODO DE SIMULAÇÃO (MOCK) PARA TESTE DE INTERFACE (UI/UX)
      // Gera eventos e pontos sintéticos de visualização baseados apenas na linha
      // do tempo do buffer, sem realizar filtragem/detecção real em `pcmBuffer`.
      // ------------------------------------------------------------------------
      const frameEndTimeSec = frameEndSample / this.config.sampleRate;
      const baseIntervalSec = 60 / (this.config.mockTargetRpm || 650);

      while (this.nextMockShotTimeSec <= frameEndTimeSec) {
        const eventTimestampSec = this.nextMockShotTimeSec;
        const syntheticPeak = 0.82 + ((this.events.length % 4) * 0.04);
        const registeredEvent = this.registerEvent(
          eventTimestampSec,
          Number(syntheticPeak.toFixed(2)),
        );
        newEvents.push(registeredEvent);

        // Pequena variação determinística (±3%) para exercitar Cadência Máxima/Mínima na UI
        const patternOffsets = [-0.03, 0.015, -0.01, 0.025, 0.0];
        const offset = patternOffsets[this.events.length % patternOffsets.length];
        this.nextMockShotTimeSec += baseIntervalSec * (1 + offset);
      }

      // Gera amostras sintéticas de preview da forma de onda para o gráfico da UI
      const hadShotInFrame = newEvents.length > 0;
      const stepIndex = Math.floor(frameStartSample / numSamples);
      const baseWave = 0.08 + Math.abs(Math.sin(stepIndex * 0.45)) * 0.12;
      const previewPoint = hadShotInFrame
        ? newEvents[newEvents.length - 1].peakAmplitude
        : Number(baseWave.toFixed(3));

      this.appendWaveformPreviewPoint(previewPoint);
      this.ambientNoiseLevel = 'Baixo';
      this.detectionConfidencePct = 98;
    } else {
      // ========================================================================
      // [MATLAB PORT] 3. PIPELINE DE PROCESSAMENTO DIGITAL DE SINAIS (DSP)
      // ========================================================================
      // TODO (Desenvolvedor): Insira aqui a lógica portada do seu script MATLAB.
      //
      // Entrada disponível:
      //   - `pcmBuffer`: Float32Array com as amostras brutas do bloco atual
      //   - `this.config.sampleRate`: Frequência de amostragem (Fs)
      //   - `frameStartSample`: Índice global da primeira amostra deste bloco
      //
      // Fluxo sugerido para o seu código MATLAB portado:
      //   1. Aplicar pré-processamento / filtragem usando os coeficientes em [1]
      //      e atualizando os estados em [2].
      //   2. Calcular envelope / energia / métrica definida no seu código MATLAB.
      //   3. Atualizar `this.ambientNoiseLevel`, `this.detectionConfidencePct`
      //      e `this.appendWaveformPreviewPoint(...)` conforme saída do MATLAB.
      //   4. Para cada amostra `k` (0 <= k < numSamples) onde um evento for
      //      confirmado pelo seu critério do MATLAB:
      //        const sampleIndexGlobal = frameStartSample + k;
      //        const timestampSec = sampleIndexGlobal / this.config.sampleRate;
      //        const peakVal = ...; // valor calculado pelo seu detector
      //        const evt = this.registerEvent(timestampSec, peakVal);
      //        newEvents.push(evt);
      // ========================================================================
    }

    this.processedSamplesCount = frameEndSample;
    return this.buildMetrics(newEvents);
  }

  public getMetrics(): CadenceMetrics {
    return this.buildMetrics([]);
  }

  /**
   * Armazena pontos simplificados para renderização da forma de onda na UI
   * mantendo um limite de histórico para evitar crescimento ilimitado.
   */
  private appendWaveformPreviewPoint(amplitude: number): void {
    const clamped = Math.max(0, Math.min(1, amplitude));
    this.waveformHistory.push(clamped);
    const maxPreviewLength = 120;
    if (this.waveformHistory.length > maxPreviewLength) {
      this.waveformHistory.shift();
    }
  }

  /**
   * Registra um novo evento detectado (pelo motor MATLAB ou pelo modo Mock)
   * e calcula os intervalos delta-t e RPM instantâneo.
   */
  private registerEvent(
    timestampSec: number,
    peakAmplitude: number,
  ): DetectedShotEvent {
    const previousEvent =
      this.events.length > 0 ? this.events[this.events.length - 1] : null;

    const deltaTSec =
      previousEvent !== null ? timestampSec - previousEvent.timestampSec : null;

    const instantRpm =
      deltaTSec !== null && deltaTSec > 0 ? 60 / deltaTSec : null;

    const event: DetectedShotEvent = {
      index: this.events.length + 1,
      timestampSec,
      deltaTSec,
      instantRpm,
      peakAmplitude,
    };

    this.events.push(event);
    return event;
  }

  /**
   * Consolida o pacote de métricas para envio à camada de UI, incluindo
   * Cadência Máxima (menor delta-t) e Cadência Mínima (maior delta-t).
   */
  private buildMetrics(newEvents: DetectedShotEvent[]): CadenceMetrics {
    const totalEvents = this.events.length;
    const elapsedAudioTimeSec =
      this.config.sampleRate > 0
        ? this.processedSamplesCount / this.config.sampleRate
        : 0;

    if (totalEvents < 2) {
      return {
        totalEvents,
        averageRpm: 0,
        currentRpm: 0,
        maxRpm: 0,
        minRpm: 0,
        lastDeltaTSec: null,
        averageDeltaTSec: null,
        ambientNoiseLevel: this.ambientNoiseLevel,
        detectionConfidencePct: this.detectionConfidencePct,
        waveformPreview: [...this.waveformHistory],
        newEvents,
        allEvents: [...this.events],
        elapsedAudioTimeSec,
      };
    }

    const firstEvent = this.events[0];
    const lastEvent = this.events[totalEvents - 1];
    const totalSpanSec = lastEvent.timestampSec - firstEvent.timestampSec;
    const intervalsCount = totalEvents - 1;

    const averageDeltaTSec =
      intervalsCount > 0 && totalSpanSec > 0
        ? totalSpanSec / intervalsCount
        : null;

    const averageRpm =
      averageDeltaTSec !== null && averageDeltaTSec > 0
        ? 60 / averageDeltaTSec
        : 0;

    // Extrai todos os intervalos delta-t válidos para encontrar o menor e o maior
    let minDeltaTSec = Number.POSITIVE_INFINITY;
    let maxDeltaTSec = 0;

    for (let i = 1; i < totalEvents; i++) {
      const dt = this.events[i].deltaTSec;
      if (dt !== null && dt > 0) {
        if (dt < minDeltaTSec) {
          minDeltaTSec = dt;
        }
        if (dt > maxDeltaTSec) {
          maxDeltaTSec = dt;
        }
      }
    }

    // Menor delta-t corresponde à Cadência Máxima; maior delta-t à Cadência Mínima
    const maxRpm =
      minDeltaTSec < Number.POSITIVE_INFINITY && minDeltaTSec > 0
        ? 60 / minDeltaTSec
        : 0;
    const minRpm = maxDeltaTSec > 0 ? 60 / maxDeltaTSec : 0;

    const lastDeltaTSec = lastEvent.deltaTSec;
    const currentRpm = lastEvent.instantRpm ?? 0;

    return {
      totalEvents,
      averageRpm,
      currentRpm,
      maxRpm,
      minRpm,
      lastDeltaTSec,
      averageDeltaTSec,
      ambientNoiseLevel: this.ambientNoiseLevel,
      detectionConfidencePct: this.detectionConfidencePct,
      waveformPreview: [...this.waveformHistory],
      newEvents,
      allEvents: [...this.events],
      elapsedAudioTimeSec,
    };
  }
}
