import React, { useMemo, useState } from 'react';
import { StatusBar } from 'react-native';
import { CadenceMetrics, IDspProcessor } from './src/dsp/IDspProcessor';
import { MatlabDsp } from './src/dsp/MatlabDsp';
import { CalibrationScreen } from './src/ui/CalibrationScreen';
import { RecordingScreen } from './src/ui/RecordingScreen';
import { ResultsScreen } from './src/ui/ResultsScreen';
import { WeaponSelectScreen } from './src/ui/WeaponSelectScreen';
import {
  GENERIC_WEAPON,
  WeaponOption,
} from './src/ui/WeaponSilhouetteSvg';

type AppStep = 'weapon_select' | 'calibration' | 'recording' | 'results';

/**
 * Componente raiz do aplicativo Android de Cadência Acústica.
 * Gerencia o fluxo de 4 telas e a instância do contrato `IDspProcessor` (`MatlabDsp`).
 */
export const App: React.FC = () => {
  const dspProcessor: IDspProcessor = useMemo(
    () =>
      new MatlabDsp({
        sampleRate: 44100,
        bufferSize: 2048,
        mockMode: true,
        mockTargetRpm: 650,
      }),
    [],
  );

  const [step, setStep] = useState<AppStep>('weapon_select');
  const [selectedWeapon, setSelectedWeapon] =
    useState<WeaponOption>(GENERIC_WEAPON);
  const [finalMetrics, setFinalMetrics] = useState<CadenceMetrics>(() =>
    dspProcessor.getMetrics(),
  );

  const handleSelectWeapon = (weapon: WeaponOption) => {
    setSelectedWeapon(weapon);
    dspProcessor.setMockMode(true, weapon.nominalRpm);
    dspProcessor.reset();
    setStep('calibration');
  };

  const handleStartRecording = () => {
    dspProcessor.reset();
    setStep('recording');
  };

  const handleStopRecording = (metricsSnapshot: CadenceMetrics) => {
    setFinalMetrics(metricsSnapshot);
    setStep('results');
  };

  const handleRestartFlow = () => {
    dspProcessor.reset();
    setFinalMetrics(dspProcessor.getMetrics());
    setStep('weapon_select');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {step === 'weapon_select' && (
        <WeaponSelectScreen onSelectWeapon={handleSelectWeapon} />
      )}

      {step === 'calibration' && (
        <CalibrationScreen
          selectedWeapon={selectedWeapon}
          onStartRecording={handleStartRecording}
          onBack={() => setStep('weapon_select')}
        />
      )}

      {step === 'recording' && (
        <RecordingScreen
          processor={dspProcessor}
          selectedWeapon={selectedWeapon}
          onStopRecording={handleStopRecording}
        />
      )}

      {step === 'results' && (
        <ResultsScreen
          selectedWeapon={selectedWeapon}
          metrics={finalMetrics}
          onRestart={handleRestartFlow}
        />
      )}
    </>
  );
};

export default App;
