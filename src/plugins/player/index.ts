import TrackPlayer from 'react-native-track-player'
import { updateOptions, setVolume, setPlaybackRate, setPitch, setEqualizerEnabled, setEqualizerBandLevel, migratePlayerCache } from './utils'

// const listenEvent = () => {
//   TrackPlayer.addEventListener('playback-error', err => {
//     console.log('playback-error', err)
//   })
//   TrackPlayer.addEventListener('playback-state', info => {
//     console.log('playback-state', info)
//   })
//   TrackPlayer.addEventListener('playback-track-changed', info => {
//     console.log('playback-track-changed', info)
//   })
//   TrackPlayer.addEventListener('playback-queue-ended', info => {
//     console.log('playback-queue-ended', info)
//   })
// }

const initial = async({ volume, playRate, isPlaybackRateChangePitch, cacheSize, isHandleAudioFocus, isEnableAudioOffload, isEqualizerEnabled, equalizerBands }: {
  volume: number
  playRate: number
  isPlaybackRateChangePitch: boolean
  cacheSize: number
  isHandleAudioFocus: boolean
  isEnableAudioOffload: boolean
  isEqualizerEnabled: boolean
  equalizerBands: number[]
}) => {
  if (global.lx.playerStatus.isIniting || global.lx.playerStatus.isInitialized) return
  global.lx.playerStatus.isIniting = true
  console.log('Cache Size', cacheSize * 1024)
  await migratePlayerCache()
  await TrackPlayer.setupPlayer({
    maxCacheSize: cacheSize * 1024,
    maxBuffer: 1000,
    waitForBuffer: true,
    handleAudioFocus: isHandleAudioFocus,
    audioOffload: isEnableAudioOffload,
    autoUpdateMetadata: false,
  })
  global.lx.playerStatus.isInitialized = true
  global.lx.playerStatus.isIniting = false
  await updateOptions()
  await setVolume(volume)
  await setPlaybackRate(playRate)
  if (!isPlaybackRateChangePitch) {
    await setPitch(1 / playRate)
  }
  if (isEqualizerEnabled) {
    await setEqualizerEnabled(true)
    for (let i = 0; i < equalizerBands.length; i++) {
      await setEqualizerBandLevel(i, equalizerBands[i] * 100)
    }
  }
  // listenEvent()
}


const isInitialized = () => global.lx.playerStatus.isInitialized


export {
  initial,
  isInitialized,
  setVolume,
  setPlaybackRate,
  setPitch,
  setEqualizerEnabled,
  setEqualizerBandLevel,
}

export {
  setResource,
  setPause,
  setPlay,
  setCurrentTime,
  getDuration,
  setStop,
  resetPlay,
  getPosition,
  updateMetaData,
  onStateChange,
  isEmpty,
  useBufferProgress,
  initTrackInfo,
} from './utils'
