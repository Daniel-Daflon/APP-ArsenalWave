import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {
  GENERIC_WEAPON,
  WEAPON_CATALOG,
  WeaponOption,
  WeaponSilhouetteSvg,
} from './WeaponSilhouetteSvg';

interface WeaponSelectScreenProps {
  onSelectWeapon: (weapon: WeaponOption) => void;
}

/**
 * Tela 1: Seleção de Armamento (Tema Claro)
 * Exibe os 4 armamentos regulamentares em cards horizontais com silhueta SVG
 * à esquerda e nome à direita, além do botão "GENÉRICO" na base.
 */
export const WeaponSelectScreen: React.FC<WeaponSelectScreenProps> = ({
  onSelectWeapon,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>SELEÇÃO DE ARMAMENTO</Text>

        <ScrollView
          contentContainerStyle={styles.cardsList}
          showsVerticalScrollIndicator={false}>
          {WEAPON_CATALOG.map(weapon => (
            <TouchableOpacity
              key={weapon.id}
              style={styles.weaponCard}
              activeOpacity={0.75}
              onPress={() => onSelectWeapon(weapon)}>
              <View style={styles.silhouetteWrapper}>
                <WeaponSilhouetteSvg
                  weaponId={weapon.id}
                  width={130}
                  height={46}
                  color="#1E221F"
                />
              </View>
              <View style={styles.weaponTextWrapper}>
                <Text style={styles.weaponName}>{weapon.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.genericButton}
          activeOpacity={0.85}
          onPress={() => onSelectWeapon(GENERIC_WEAPON)}>
          <Text style={styles.genericButtonText}>GENÉRICO</Text>
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
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1D1A',
    textAlign: 'center',
    letterSpacing: 0.8,
    marginBottom: 20,
  },
  cardsList: {
    paddingVertical: 4,
    gap: 14,
  },
  weaponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C8CED3',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  silhouetteWrapper: {
    width: 136,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#ECEFF1',
  },
  weaponTextWrapper: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: 'center',
  },
  weaponName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222623',
    lineHeight: 20,
  },
  genericButton: {
    backgroundColor: '#3F4E30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  genericButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
});
