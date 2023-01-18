import {
  DateProfileGenerator,
  addWeeks, diffWeeks,
  DateRange,
  DateEnv,
} from '@fullcalendar/core/internal'

export class TableDateProfileGenerator extends DateProfileGenerator {
  // Computes the date range that will be rendered
  buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay): DateRange {
    let renderRange = super.buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay)
    let { props } = this

    return buildDayTableRenderRange({
      currentRange: renderRange, // ???
      snapToWeek: /^(year|month)$/.test(currentRangeUnit),
      monthMode: props.monthMode,
      fixedWeekCount: props.fixedWeekCount,
      dateEnv: props.dateEnv,
    })
  }
}

export function buildDayTableRenderRange(props: {
  currentRange: DateRange,
  snapToWeek: boolean,
  monthMode: boolean,
  fixedWeekCount: boolean,
  dateEnv: DateEnv,
}): DateRange {
  let { dateEnv, currentRange } = props
  let { start, end } = currentRange
  let endOfWeek

  // year and month views should be aligned with weeks. this is already done for week
  if (props.snapToWeek) {
    start = dateEnv.startOfWeek(start)

    // make end-of-week if not already
    endOfWeek = dateEnv.startOfWeek(end)
    if (endOfWeek.valueOf() !== end.valueOf()) {
      end = addWeeks(endOfWeek, 1)
    }
  }

  // ensure 6 weeks
  if (
    props.monthMode &&
    props.fixedWeekCount
  ) {
    let rowCnt = Math.ceil( // could be partial weeks due to hiddenDays
      diffWeeks(start, end),
    )
    end = addWeeks(end, 6 - rowCnt)
  }

  return { start, end }
}
