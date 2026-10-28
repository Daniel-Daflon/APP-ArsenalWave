# Arquitetura do Projeto: App Android de Cadência Acústica

## Objetivo e Stack
Aplicativo nativo Android (React Native com TypeScript) 100% offline.
Foco: Captura de áudio em tempo real e exibição de métricas de cadência (RPM, intervalos delta-t, contagem de eventos).

## REGRA CRÍTICA DE ARQUITETURA (SEPARAÇÃO DE RESPONSABILIDADES)
O processamento digital de sinais (DSP) será escrito MANUALMENTE pelo desenvolvedor (portado do MATLAB) em um momento posterior.
1. Você (IA) é responsável APENAS pela camada externa: UI/UX, navegação, estado do app, permissões nativas do Android e captura do buffer bruto de áudio (PCM Float32Array).
2. A comunicação entre o App e o motor matemático deve ocorrer EXCLUSIVAMENTE através da interface definida em `src/dsp/IDspProcessor.ts`.
3. NUNCA implemente filtros de áudio reais, FFT ou algoritmos de detecção por conta própria. Em `src/dsp/MatlabDsp.ts`, mantenha apenas um esqueleto (stub/mock) bem comentado indicando onde o desenvolvedor inserirá os vetores e coeficientes do MATLAB.
