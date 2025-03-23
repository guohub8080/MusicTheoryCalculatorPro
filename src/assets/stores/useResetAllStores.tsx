import useCircleOfFifthsConfig from "./useCircleOfFifthsConfig.ts";
import useGlobalSettings from "./useGlobalSettings.ts";
import useIntervalConfig from "./useIntervalConfig.ts";
import usePianoPicker from "./usePianoPicker.ts";
import useScoreHelperConfig from "./useScoreHelperConfig.ts";
import useScaleConfig from "./useScaleConfig.ts";
import useScoreCheckerConfig from "./useScoreCheckerConfig.ts";
import useChordConfig from "./useChordConfig.ts";
import useHarmonicSeriesConfig from "./useHarmonicSeriesConfig.ts";
import useFindChordConfig from "./useFindChordConfig.ts";
import useMIDIConfig from "./useMIDIConfig.ts";
import useExamConfig from "./useExamConfig.ts";

const useResetAllStores = () => {
  const r1 = useCircleOfFifthsConfig()
  const r2 = useGlobalSettings()
  const r3 = useIntervalConfig()
  const r4 = usePianoPicker()
  const r5 = useScoreHelperConfig()
  const r6 = useScaleConfig()
  const r7 = useScoreCheckerConfig()
  const r8 = useChordConfig()
  const r9 = useHarmonicSeriesConfig()
  const r10 = useFindChordConfig()
  const r11 = useMIDIConfig()
  const r12 = useExamConfig()
  const resetAll = () => {
    r1.resetStore()
    r2.resetStore()
    r3.resetStore()
    r4.resetStore()
    r5.resetStore()
    r6.resetStore()
    r7.resetStore()
    r8.resetStore()
    r9.resetStore()
    r10.resetStore()
    r11.resetStore()
    r12.resetStore()
  }
  return {resetAll}
}

export default useResetAllStores