/* eslint-disable no-mixed-spaces-and-tabs */
import {css} from "@emotion/react";
import {useEffect, useMemo, useState} from "react";
import useFindChordConfig from "@/assets/stores/useFindChordConfig.ts";
import {isArray, isEmpty, isNull, isNumber, isUndefined, min, range, sum} from "lodash";
import NoteByLocation from "@/components/reNote/NoteByLocation/NoteByLocation.tsx";
import googleColors from "@/assets/colors/googleColors.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import music12 from "music12";
import NoResult from "@/apps/FindNotesWithInterval/components/NoResult.tsx";
import {Collapse} from "antd-mobile";
import OctavePiano from "@/components/rePiano/OctavePiano.tsx";
import {useWindowSize} from "react-use";
import NumberNote from "@/components/reNote/NumberNote/NumberNote.tsx";

const keyFontSize = 18
const doNothing = () => {
}
const FindNotesOfChord = () => {

  const [activeKey, setActiveKey] = useState([])
  const {pianoKeyIntervalList} = useFindChordConfig()
  useEffect(() => {
    setActiveKey([])
  }, [pianoKeyIntervalList])
  const findResult = useMemo(() => {
    const isBlank = sum(pianoKeyIntervalList.map(x => {
      if (isNull(x)) return 0
      if (isUndefined(x)) return 0
      if (isNumber(x) && x === 0) return 0
      return 1
    })) === 0
    if (isBlank) return []
    const findObj = pianoKeyIntervalList.map((x, y) => {
      if (isUndefined(x)) return;
      if (isNull(x)) return;
      if (isNumber(x) && x === 0) return;
      return {location: y, as: x as number}
    }).filter(Boolean)
    return music12.chord.findNotesInChord(findObj)
  }, [pianoKeyIntervalList])
  const {width} = useWindowSize()

  const getKeyNode = (location: number, chordKey: string) => {
    const emptyList = Array.from({length: 12}, () => void 0)
    const rootNote = music12.note.getNoteByLocation(location)[0]
    const chordInstance = music12.factory.getChord(rootNote.step, rootNote.alter, rootNote.octave, chordKey)
    emptyList[chordInstance.notesList[0].locationId] = <div css={node_css}>根</div>
    chordInstance.intervalList.map((x, y) => {
      if ([1, 4, 5, 8, 11, 12].includes(x[1])) {
        if (x[0] === "p") {
          emptyList[chordInstance.notesList[y + 1].locationId] = <div css={node_css}>{x[1]}</div>
        } else if (x[0] === "dim") {
          emptyList[chordInstance.notesList[y + 1].locationId] = <div css={node_css}>
            <NumberNote num={x[1]} alter={-1} fontSize={keyFontSize} color={"white"}/>
          </div>
        } else if (x[0] === "aug") {
          emptyList[chordInstance.notesList[y + 1].locationId] = <div css={node_css}>
            <NumberNote num={x[1]} alter={1} fontSize={keyFontSize} color={"white"}/>
          </div>
        }
      } else {
        if (x[0] === "maj") {
          emptyList[chordInstance.notesList[y + 1].locationId] = <div css={node_css}>{x[1]}</div>
        } else if (x[0] === "min") {
          emptyList[chordInstance.notesList[y + 1].locationId] = <div css={node_css}>
            <NumberNote num={x[1]} alter={-1} fontSize={keyFontSize} color={"white"}/>
          </div>
        } else if (x[0] === "dim") {
          emptyList[chordInstance.notesList[y + 1].locationId] = <div css={node_css}>
            <NumberNote num={x[1]} alter={-2} fontSize={keyFontSize} color={"white"}/>
          </div>
        } else if (x[0] === "aug") {
          emptyList[chordInstance.notesList[y + 1].locationId] = <div css={node_css}>
            <NumberNote num={x[1]} alter={1} fontSize={keyFontSize} color={"white"}/>
          </div>
        }
      }
    })
    return emptyList
  }

  const getKeyColor = (location: number[]) => {
    const emptyList = Array.from({length: 12}, () => void 0)
    if (isEmpty(location)) return emptyList
    if (isArray(location) && location.length === 0) return emptyList
    location.map((x, y) => {
      if (x === 0) return;
      emptyList[y] = googleColors.amber200
    })
    return emptyList
  }
  return <div css={FindOnlyChord_css}>
    {findResult.length === 0 && <NoResult/>}
    {findResult.length > 0 && <Collapse
        activeKey={activeKey}
        style={{width: "100%", maxWidth: 450, marginLeft: "auto", marginRight: "auto"}}>
      {findResult.map((x, y) => {
        return <Collapse.Panel
          key={`${y}`}
          onClick={() => {
            if (activeKey.includes(`${y}`)) {
              setActiveKey(activeKey.filter(x => x !== `${y}`))
            } else {
              setActiveKey([...activeKey, `${y}`])
            }
          }}
          style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0, padding: 0}}
          title={<div css={CollapsePanelItem_css}>
            <div className="order">{y + 1}</div>
            <div className="note_window"><NoteByLocation location={x.rootNoteLocation}/></div>
            <div className="cn_name">
              {x.cnName}
            </div>
          </div>}>
          <div style={{height: 160, ...cssPresets.flexCenter}}
               onDoubleClick={doNothing}
               className="line" key={`${x.chordKey}_${x.rootNoteLocation}`}>
            <OctavePiano
              isPureDisplay={true}
              keyNodeList={getKeyNode(x.rootNoteLocation, x.chordKey)}
              config={{
                keyBgColorList: getKeyColor(pianoKeyIntervalList as any),
                whiteKeyWidth: min([60, width / 7.5]),
                blackKeyWidthRatio: 0.8,
                whiteKeyBorderWidth: 2.5,
                blackKeyBorderWidth: 2.5,
                blackKeyBorderRadius: range(5).map(() => [0, 0, 6, 6]),
                whiteKeyHeight: 150,
              }}/>
            {/*{`${getKeyNode(x.rootNoteLocation, x.chordKey)}`}*/}
          </div>
        </Collapse.Panel>
      })}
    </Collapse>}
  </div>
}

export default FindNotesOfChord

const FindOnlyChord_css = css({
  width: "100%",
  paddingBottom: 50,
  "& .line:not(:first-of-type)": {
    borderTop: `1px solid ${googleColors.gray300}`
  },
  "& .line": {
    marginRight: "auto",
    marginLeft: "auto",
    width: "100%",
    maxWidth: 450,
    display: "flex",
    height: 40,


  }
})


const CollapsePanelItem_css = css({
  ...cssPresets.flexCenter,
  marginTop: 0,
  marginBottom: 0,
  "& .order": {
    color: googleColors.blue800,
    textAlign: "left",
    width: "15%",
    ...cssPresets.flexCenter,
    marginRight: "auto",
  },
  "& .note_window": {
    width: "25%",
    ...cssPresets.flexCenter,
    backgroundColor: googleColors.blue50,
    borderRadius: 999,
    height: 30
  },

  "& .cn_name": {
    color: googleColors.blue800,
    width: "60%",
    ...cssPresets.flexCenter
  },
  "& .line": {
    height: 300
  }
})


const node_css = css({
  background: googleColors.red300,
  borderRadius: 999,
  width: 35,
  height: 35,
  color: "white",
  marginBottom: 0,
  fontSize: keyFontSize,
  ...cssPresets.flexCenter
})
