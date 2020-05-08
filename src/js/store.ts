import { createStore } from 'redux'
import * as R from 'ramda'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { catDialog } from './dialog'

const persistConfig = {
  key: 'root',
  storage,
}

const ACTION_TYPES = {
  INCREMENT_SCORE: 'INCREMENT_SCORE',
  INCREMENT_KILLS: 'INCREMENT_KILLS',
  INCREMENT_DIFFICULTY: 'INCREMENT_DIFFICULTY',
  HAS_HAPPEND: 'HAS_HAPPEND',
  BUILING_BUILT: 'BUILING_BUILT',
  ADDON_BUILT: 'ADDON_BUILT',
  SET_CONVERSATION_ID: 'SET_CONVERSATION_ID',
  SET_DIALOG_INDEX: 'SET_DIALOG_INDEX',
  INCREMENT_ROUND: 'INCREMENT_ROUND',
  INCREMENT_VILLAGERS_APPROVAL_RATING: 'INCREMENT_VILLAGERS_APPROVAL_RATING',
  INCREMENT_CAT_PARTY_APPROVAL_RATING: 'INCREMENT_CAT_PARTY_APPROVAL_RATING',
  INCREMENT_KITTENS_APPROVAL_RATING: 'INCREMENT_KITTENS_APPROVAL_RATING',
} as const

export const HOUSE_WITH_ADDON_NAMES = {
  orphanage: 'orphanage',
  rehab: 'rehab',
  university: 'university',
} as const

export const HOUSE_NAMES = {
  ...HOUSE_WITH_ADDON_NAMES,
  hoboCatHouse: 'hoboCatHouse',
} as const

export const ADDON_NAMES = {
  [HOUSE_WITH_ADDON_NAMES.orphanage]: {
    youthCenter: 'youthCenter',
    summerCamp: 'summerCamp',
  },
  [HOUSE_WITH_ADDON_NAMES.rehab]: {
    hospital: 'hospital',
    phychiatricWing: 'phychiatricWing',
    monastery: 'monastery',
  },
  [HOUSE_WITH_ADDON_NAMES.university]: {
    rocketUniversity: 'rocketUniversity',
  },
} as const

export const CAT_NAMES = {
  timmy: 'timmy',
  hoboCat: 'hoboCat',
  priest: 'priest',
} as const

export const CAT_NAMES_INCLUDEING_CATZ = {
  ...CAT_NAMES,
  catz: 'catz',
} as const

export const isCatName = (foo: string): foo is keyof typeof CAT_NAMES =>
  [CAT_NAMES.timmy as string].includes(foo)

/* type ActionTypes =
  | 'INCREMENT_SCORE'
  | 'INCREMENT_KILLS'
  | 'INCREMENT_DIFFICULTY'
  | 'HAS_HAPPEND'
  | 'BUILING_BUILT'
  | 'ADDON_BUILT'
  | 'SET_CONVERSATION_ID'
  | 'SET_DIALOG_INDEX'
  | 'INCREMENT_ROUND'
*/
export type HouseState = {
  built: boolean
  builtOnRound: number | null
}

type HasHappend = {
  priest: boolean[]
  timmy: boolean[]
  hoboCat: boolean[]
  firstRound: boolean
  firstFrenzy: boolean
  firstHouseWithSlots: boolean
  firstBouncedCheck: boolean
}

type State = {
  score: number
  kills: number
  bust: number
  currentRound: number
  buildings: {
    [HOUSE_NAMES.hoboCatHouse]: HouseState
    [HOUSE_NAMES.orphanage]: HouseState & {
      [ADDON_NAMES.orphanage.youthCenter]: HouseState
      [ADDON_NAMES.orphanage.summerCamp]: HouseState
    }

    [HOUSE_NAMES.rehab]: HouseState & {
      [ADDON_NAMES.rehab.hospital]: HouseState
      [ADDON_NAMES.rehab.phychiatricWing]: HouseState
      [ADDON_NAMES.rehab.monastery]: HouseState
    }
    [HOUSE_NAMES.university]: HouseState & {
      [ADDON_NAMES.university.rocketUniversity]: HouseState
    }
  }
  conversationIds: {
    [CAT_NAMES.priest]: null | keyof typeof catDialog['priest']
    [CAT_NAMES.timmy]: null | keyof typeof catDialog['timmy']
    [CAT_NAMES.hoboCat]: null | keyof typeof catDialog['hoboCat']
  }
  dialogIndexes: {
    [CAT_NAMES.priest]: number
    [CAT_NAMES.timmy]: number
    [CAT_NAMES.hoboCat]: number
  }
  hasHappend: HasHappend
  villagersApprovalRating: number
  kittensApprovalRating: number
  catPartyApprovalRating: number
  difficulty: number
}

const INITAL_STATE: State = {
  score: 0,
  kills: 0,
  bust: 0,
  currentRound: 0,
  buildings: {
    [HOUSE_NAMES.hoboCatHouse]: {
      built: false,
      builtOnRound: null,
    },
    [HOUSE_NAMES.orphanage]: {
      built: false,
      builtOnRound: null,
      youthCenter: {
        built: false,
        builtOnRound: null,
      },
      summerCamp: {
        built: false,
        builtOnRound: null,
      },
    },
    [HOUSE_NAMES.rehab]: {
      built: false,
      builtOnRound: null,
      hospital: {
        built: false,
        builtOnRound: null,
      },
      phychiatricWing: {
        built: false,
        builtOnRound: null,
      },
      monastery: {
        built: false,
        builtOnRound: null,
      },
    },
    [HOUSE_NAMES.university]: {
      built: false,
      builtOnRound: null,
      rocketUniversity: {
        built: false,
        builtOnRound: null,
      },
    },
  },
  conversationIds: {
    priest: null,
    timmy: null,
    hoboCat: null,
  },
  dialogIndexes: {
    priest: 0,
    timmy: 0,
    hoboCat: 0,
  },
  hasHappend: {
    priest: [],
    timmy: [],
    hoboCat: [],
    firstRound: false,
    firstFrenzy: false,
    firstHouseWithSlots: false,
    firstBouncedCheck: false,
  },
  villagersApprovalRating: 0,
  kittensApprovalRating: 0,
  catPartyApprovalRating: 0,
  difficulty: 0,
}

interface IAction<T extends keyof typeof ACTION_TYPES> {
  type: T
}

interface IPayloadAction<T extends keyof typeof ACTION_TYPES, P> {
  type: T
  payload: P
}

type AddonPayload = { builtOnRound: number } & (
  | {
      addOnKey: typeof ADDON_NAMES['orphanage'][keyof typeof ADDON_NAMES['orphanage']]
      buildingKey: 'orphanage'
    }
  | {
      addOnKey: typeof ADDON_NAMES['rehab'][keyof typeof ADDON_NAMES['rehab']]
      buildingKey: 'rehab'
    }
  | {
      addOnKey: typeof ADDON_NAMES['university'][keyof typeof ADDON_NAMES['university']]
      buildingKey: 'university'
    }
)

type Action =
  | IPayloadAction<'INCREMENT_SCORE', { incrementBy: number }>
  | IAction<'INCREMENT_SCORE'>
  | IPayloadAction<'INCREMENT_KILLS', { incrementBy: number }>
  | IAction<'INCREMENT_KILLS'>
  | IAction<'INCREMENT_DIFFICULTY'>
  | IPayloadAction<'HAS_HAPPEND', Partial<HasHappend>>
  | IPayloadAction<
      'BUILING_BUILT',
      {
        buildingKey: typeof HOUSE_NAMES[keyof typeof HOUSE_NAMES]
        builtOnRound: number
      }
    >
  | IPayloadAction<'ADDON_BUILT', AddonPayload>
  | IPayloadAction<
      'SET_CONVERSATION_ID',
      | {
          cat: 'hoboCat'
          newConversationId: keyof typeof catDialog['hoboCat']
        }
      | {
          cat: 'timmy'
          newConversationId: keyof typeof catDialog['timmy']
        }
      | {
          cat: 'priest'
          newConversationId: keyof typeof catDialog['priest']
        }
    >
  | IPayloadAction<
      'SET_DIALOG_INDEX',
      {
        cat: keyof typeof CAT_NAMES
        newdialogIndexes: number
      }
    >
  | IAction<'INCREMENT_ROUND'>
  | IPayloadAction<
      'INCREMENT_VILLAGERS_APPROVAL_RATING',
      { incrementBy: number }
    >
  | IPayloadAction<
      'INCREMENT_CAT_PARTY_APPROVAL_RATING',
      { incrementBy: number }
    >
  | IPayloadAction<'INCREMENT_KITTENS_APPROVAL_RATING', { incrementBy: number }>

const store = createStore<
  State & {
    _persist: {
      version: number
      rehydrated: boolean
    }
  },
  Action,
  unknown,
  unknown
>(
  persistReducer<State, Action>(persistConfig, function reducer(
    state: State = INITAL_STATE,
    action: Action
  ) {
    switch (action.type) {
      case ACTION_TYPES.INCREMENT_SCORE: {
        const { score, ...oldState } = state
        const payload =
          (action as { payload: { incrementBy: number } }).payload || null
        return {
          ...oldState,
          score: score + (payload?.incrementBy || 1),
        }
      }
      case ACTION_TYPES.INCREMENT_KILLS: {
        const payload =
          (action as { payload: { incrementBy: number } }).payload || null
        const { kills, ...oldState } = state
        return {
          ...oldState,
          kills: kills + (payload?.incrementBy || 1),
        }
      }
      case ACTION_TYPES.INCREMENT_DIFFICULTY: {
        const { difficulty, ...oldState } = state
        return {
          ...oldState,
          difficulty: difficulty + 1,
        }
      }
      case ACTION_TYPES.HAS_HAPPEND: {
        const { payload } = action
        const { hasHappend, ...oldState } = state
        return {
          ...oldState,
          hasHappend: R.mergeDeepRight(hasHappend, payload),
        }
      }
      case ACTION_TYPES.BUILING_BUILT: {
        const { payload } = action
        const { buildings, ...oldState } = state
        const { buildingKey, builtOnRound } = payload
        return {
          ...oldState,
          buildings: {
            ...buildings,
            [buildingKey]: {
              ...buildings[buildingKey],
              built: true,
              builtOnRound,
            },
          },
        }
      }
      case ACTION_TYPES.ADDON_BUILT: {
        const { payload } = action
        const { buildings, ...oldState } = state
        const { addOnKey, buildingKey, builtOnRound } = payload

        return {
          ...oldState,
          buildings: {
            ...buildings,
            [buildingKey]: {
              ...buildings[buildingKey],
              [addOnKey]: {
                builtOnRound,
                built: true,
              },
            },
          },
        }
      }
      case ACTION_TYPES.SET_CONVERSATION_ID: {
        const { payload } = action
        const { conversationIds, ...oldState } = state
        const { cat, newConversationId } = payload
        return {
          ...oldState,
          conversationIds: {
            ...conversationIds,
            [cat]: newConversationId,
          },
        }
      }
      case ACTION_TYPES.SET_DIALOG_INDEX: {
        const { payload } = action
        const { dialogIndexes, ...oldState } = state
        const { cat, newdialogIndexes } = payload
        return {
          ...oldState,
          dialogIndexes: {
            ...dialogIndexes,
            [cat]: newdialogIndexes,
          },
        }
      }
      case ACTION_TYPES.INCREMENT_ROUND: {
        const { currentRound, ...oldState } = state
        return {
          ...oldState,
          currentRound: currentRound + 1,
        }
      }
      case ACTION_TYPES.INCREMENT_CAT_PARTY_APPROVAL_RATING: {
        const { catPartyApprovalRating, ...oldState } = state
        const payload =
          (action as { payload: { incrementBy: number } }).payload || null
        return {
          ...oldState,
          catPartyApprovalRating: catPartyApprovalRating + payload.incrementBy,
        }
      }
      case ACTION_TYPES.INCREMENT_VILLAGERS_APPROVAL_RATING: {
        const { villagersApprovalRating, ...oldState } = state
        const payload =
          (action as { payload: { incrementBy: number } }).payload || null
        return {
          ...oldState,
          villagersApprovalRating:
            villagersApprovalRating + payload.incrementBy,
        }
      }
      case ACTION_TYPES.INCREMENT_KITTENS_APPROVAL_RATING: {
        const { kittensApprovalRating, ...oldState } = state
        const payload =
          (action as { payload: { incrementBy: number } }).payload || null
        return {
          ...oldState,
          kittensApprovalRating: kittensApprovalRating + payload.incrementBy,
        }
      }
      default: {
        return state
      }
    }
  })
)

persistStore(store)
export { store, ACTION_TYPES }
