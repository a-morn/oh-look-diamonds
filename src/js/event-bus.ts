import debugOptions from './debug-options'

export enum events {
  CRASH,
  ROCKET_FIRED,
}

let listeners: {
  event: events
  call: Function
}[] = []

export const on = (event: events, call: Function): void => {
  listeners.push({
    event,
    call,
  })
}

export const off = (event: events, cb: Function, all: boolean): void => {
  listeners = listeners.filter(
    (l) => l.event !== event || (!all && cb !== l.call)
  )
}

export const trigger = (event: events): void => {
  if (debugOptions.logEvents) {
    console.log(`${event} triggered`) // eslint-disable-line no-console
  }
  listeners
    .filter((l) => l.event === event)
    .forEach((l) => {
      if (debugOptions.logEvents) {
        console.log(`calling ${l.call.name}`) // eslint-disable-line no-console
      }
      l.call()
    })
}
