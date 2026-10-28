import React from 'react';
import Svg, { Path, Rect, Circle, Line, G } from 'react-native-svg';

export type WeaponId = 'ia2' | 'fal' | 'parafal' | 'mag' | 'generico';

export interface WeaponOption {
  id: WeaponId;
  name: string;
  nominalRpm: number;
}

export const WEAPON_CATALOG: WeaponOption[] = [
  {
    id: 'ia2',
    name: 'Fuzil de Assalto IA2 5.56mm',
    nominalRpm: 750,
  },
  {
    id: 'fal',
    name: 'Fuzil de Assalto FAL 7.62mm',
    nominalRpm: 650,
  },
  {
    id: 'parafal',
    name: 'Fuzil de Assalto ParaFAL 7.62mm',
    nominalRpm: 680,
  },
  {
    id: 'mag',
    name: 'Metralhadora Média MAG 7.62mm',
    nominalRpm: 850,
  },
];

export const GENERIC_WEAPON: WeaponOption = {
  id: 'generico',
  name: 'Genérico',
  nominalRpm: 650,
};

interface WeaponSilhouetteProps {
  weaponId: WeaponId;
  width?: number;
  height?: number;
  color?: string;
}

/**
 * Silhuetas vetoriais técnicas (SVG) para cada armamento do catálogo.
 */
export const WeaponSilhouetteSvg: React.FC<WeaponSilhouetteProps> = ({
  weaponId,
  width = 135,
  height = 48,
  color = '#1F2421',
}) => {
  switch (weaponId) {
    case 'ia2':
      // IMBEL IA2 5.56mm: Coronha rebatível polímero, guarda-mão c/ trilho Picatinny, carregador curvo 5.56
      return (
        <Svg width={width} height={height} viewBox="0 0 220 72" fill="none">
          <G fill={color} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
            {/* Coronha tática IA2 */}
            <Path d="M10 24 L48 22 L48 34 L26 42 L10 46 Z" />
            {/* Caixa da culatra e trilho superior */}
            <Rect x="48" y="19" width="66" height="14" rx="1.5" />
            <Line x1="50" y1="17" x2="152" y2="17" stroke={color} strokeWidth="2.2" />
            {/* Alça e massa de mira */}
            <Path d="M54 13 L59 13 L59 17 L54 17 Z" />
            <Path d="M150 11 L155 11 L156 17 L149 17 Z" />
            {/* Punho (pistol grip) */}
            <Path d="M62 33 L73 33 L66 56 L55 56 Z" />
            {/* Guarda-mato */}
            <Path d="M73 33 L88 33 L86 40 L73 40 Z" fill="none" strokeWidth="1.6" />
            {/* Carregador curvo STANAG 5.56mm */}
            <Path d="M89 33 L104 33 C106 46 111 56 116 64 L101 66 C95 57 91 46 89 33 Z" />
            {/* Guarda-mão nervurado */}
            <Path d="M114 20 L158 21 L156 32 L114 33 Z" />
            {/* Cano e quebra-chamas */}
            <Rect x="158" y="23" width="38" height="4" />
            <Rect x="196" y="21.5" width="12" height="7" rx="1" />
          </G>
        </Svg>
      );

    case 'fal':
      // FN / IMBEL FAL 7.62mm: Cano longo, coronha fixa clássica, carregador reto 7.62mm
      return (
        <Svg width={width} height={height} viewBox="0 0 220 72" fill="none">
          <G fill={color} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
            {/* Coronha fixa clássica FAL */}
            <Path d="M6 26 L52 22 L52 33 L16 49 L6 48 Z" />
            {/* Caixa da culatra alongada */}
            <Rect x="52" y="20" width="64" height="12" rx="1" />
            {/* Alça de transporte / mira */}
            <Path d="M56 15 L60 15 L60 20 L56 20 Z" />
            {/* Punho inclinado FAL */}
            <Path d="M65 32 L75 32 L67 54 L57 54 Z" />
            {/* Guarda-mato */}
            <Path d="M75 32 L89 32 L87 39 L75 39 Z" fill="none" strokeWidth="1.5" />
            {/* Carregador reto 20 tiros 7.62mm */}
            <Path d="M90 32 L107 32 L104 59 L87 58 Z" />
            {/* Guarda-mão longo horizontal FAL */}
            <Path d="M116 21 L168 22 L166 30 L116 31 Z" />
            {/* Bloco de gases e massa de mira triangular */}
            <Path d="M166 13 L172 13 L174 22 L165 22 Z" />
            {/* Cano longo + quebra-chamas longo */}
            <Rect x="168" y="23.5" width="32" height="3.5" />
            <Rect x="200" y="22.5" width="14" height="5.5" rx="1" />
          </G>
        </Svg>
      );

    case 'parafal':
      // ParaFAL 7.62mm: Coronha metálica tubular rebatível (esqueleto), cano encurtado, carregador reto 7.62mm
      return (
        <Svg width={width} height={height} viewBox="0 0 220 72" fill="none">
          <G fill={color} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
            {/* Coronha tubular vazada (esqueleto) do ParaFAL */}
            <Path d="M12 23 L52 22 L52 26 L16 27 Z" />
            <Path d="M14 43 L52 30 L52 34 L16 46 Z" />
            <Rect x="10" y="23" width="5" height="24" rx="1" />
            {/* Caixa da culatra */}
            <Rect x="52" y="20" width="62" height="12" rx="1" />
            {/* Punho */}
            <Path d="M64 32 L74 32 L66 54 L56 54 Z" />
            {/* Guarda-mato */}
            <Path d="M74 32 L88 32 L86 39 L74 39 Z" fill="none" strokeWidth="1.5" />
            {/* Carregador reto 7.62mm */}
            <Path d="M89 32 L106 32 L103 59 L86 58 Z" />
            {/* Guarda-mão ParaFAL */}
            <Path d="M114 21 L160 22 L158 30 L114 31 Z" />
            {/* Bloco de gases */}
            <Path d="M158 13 L164 13 L165 22 L157 22 Z" />
            {/* Cano mais curto que o FAL padrão */}
            <Rect x="160" y="23.5" width="28" height="3.8" />
            <Rect x="188" y="22.2" width="12" height="6.2" rx="1" />
          </G>
        </Svg>
      );

    case 'mag':
      // Metralhadora FN MAG 7.62mm: Corpo robusto, coronha maciça, tubo de gases inferior e bipé frontal
      return (
        <Svg width={width} height={height} viewBox="0 0 220 72" fill="none">
          <G fill={color} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
            {/* Coronha da MAG */}
            <Path d="M6 25 L44 23 L44 34 L14 45 L6 44 Z" />
            {/* Receptor pesado da metralhadora */}
            <Rect x="44" y="18" width="78" height="17" rx="1.5" />
            {/* Tampa de alimentação superior */}
            <Rect x="64" y="14" width="42" height="4" rx="1" />
            {/* Punho centralizado da MAG */}
            <Path d="M74 35 L85 35 L78 56 L67 56 Z" />
            {/* Guarda-mato */}
            <Path d="M85 35 L98 35 L96 42 L85 42 Z" fill="none" strokeWidth="1.5" />
            {/* Cano pesado superior e cilindro de gases inferior */}
            <Rect x="122" y="20" width="72" height="4.5" />
            <Rect x="122" y="27" width="54" height="4" />
            {/* Alça de transporte do cano e massa de mira */}
            <Path d="M126 11 L134 11 L134 20 L128 20 Z" />
            <Path d="M184 12 L190 12 L191 20 L183 20 Z" />
            {/* Quebra-chamas cônico MAG */}
            <Path d="M194 19 L209 18 L209 26 L194 25 Z" />
            {/* Bipé frontal dobrado/estendido */}
            <Line x1="174" y1="31" x2="162" y2="63" stroke={color} strokeWidth="3" />
            <Line x1="176" y1="31" x2="188" y2="63" stroke={color} strokeWidth="3" />
            <Rect x="157" y="62" width="10" height="3" />
            <Rect x="183" y="62" width="10" height="3" />
          </G>
        </Svg>
      );

    case 'generico':
    default:
      // Silhueta técnica padrão para modo Genérico
      return (
        <Svg width={width} height={height} viewBox="0 0 220 72" fill="none">
          <G fill={color} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
            <Path d="M10 25 L50 22 L50 34 L20 46 L10 45 Z" />
            <Rect x="50" y="19" width="66" height="14" rx="1.5" />
            <Path d="M64 33 L75 33 L67 55 L56 55 Z" />
            <Path d="M90 33 L105 33 L108 60 L93 60 Z" />
            <Rect x="116" y="21" width="46" height="10" rx="1" />
            <Rect x="162" y="23.5" width="38" height="4" />
            <Rect x="200" y="22" width="10" height="7" rx="1" />
          </G>
        </Svg>
      );
  }
};
