import { View } from 'react-native'
import { useTheme } from '@/store/theme/hook'
import Text from '@/components/common/Text'
import { useSettingValue } from '@/store/setting/hook'
import Slider, { type SliderProps } from '@/components/common/Slider'
import { updateSetting } from '@/core/common'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { setEqualizerEnabled, setEqualizerBandLevel } from '@/plugins/player'
import settingState from '@/store/setting/state'
import CheckBox from '@/components/common/CheckBox'

// Android Equalizer 频段标签（典型5段）
const BAND_LABELS = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz']
// 均衡器增益范围：-15dB ~ +15dB，单位：毫贝（millibel），1dB = 100mb
const MIN_DB = -15
const MAX_DB = 15

export default () => {
  const theme = useTheme()
  const isEnabled = useSettingValue('player.isEqualizerEnabled')
  const bands = useSettingValue('player.equalizerBands')
  const t = useI18n()

  const handleToggle = (checked: boolean) => {
    updateSetting({ 'player.isEqualizerEnabled': checked })
    void setEqualizerEnabled(checked)
  }

  const handleBandChange = (bandIndex: number): SliderProps['onValueChange'] => value => {
    value = Math.round(value)
    void setEqualizerBandLevel(bandIndex, value * 100)
  }

  const handleBandComplete = (bandIndex: number): SliderProps['onSlidingComplete'] => value => {
    value = Math.round(value)
    const newBands = [...settingState.setting['player.equalizerBands']]
    newBands[bandIndex] = value
    updateSetting({ 'player.equalizerBands': newBands })
  }

  const handleReset = () => {
    const zeroBands = [0, 0, 0, 0, 0]
    updateSetting({ 'player.equalizerBands': zeroBands })
    zeroBands.forEach((_, i) => {
      void setEqualizerBandLevel(i, 0)
    })
  }

  return (
    <View style={styles.container}>
      <Text>{t('play_detail_setting_equalizer')}</Text>
      <View style={styles.toggleRow}>
        <CheckBox check={isEnabled} label={t('play_detail_setting_equalizer_enable')} onChange={handleToggle} />
      </View>
      {isEnabled && (
        <View style={styles.bandsContainer}>
          {BAND_LABELS.map((label, index) => {
            const value = Array.isArray(bands) && bands.length > index ? bands[index] : 0
            return (
              <View key={index} style={styles.bandRow}>
                <Text style={styles.bandLabel} color={theme['c-font-label']}>{label}</Text>
                <Slider
                  minimumValue={MIN_DB}
                  maximumValue={MAX_DB}
                  onValueChange={handleBandChange(index)}
                  onSlidingComplete={handleBandComplete(index)}
                  step={1}
                  value={value}
                />
                <Text style={styles.bandValue} color={theme['c-font-label']}>{value > 0 ? `+${value}` : `${value}`}</Text>
              </View>
            )
          })}
          <View style={styles.resetRow}>
            <Text style={styles.resetBtn} color={theme['c-primary']} onPress={handleReset}>{t('play_detail_setting_playback_rate_reset')}</Text>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = createStyle({
  container: {
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    alignItems: 'flex-start',
  },
  toggleRow: {
    marginTop: 5,
  },
  bandsContainer: {
    width: '100%',
    marginTop: 8,
  },
  bandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bandLabel: {
    width: 55,
    fontSize: 12,
  },
  bandValue: {
    width: 40,
    textAlign: 'right',
    fontSize: 12,
  },
  resetRow: {
    marginTop: 6,
    alignItems: 'flex-end',
  },
  resetBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 13,
  },
})
