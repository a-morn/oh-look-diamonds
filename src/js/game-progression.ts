import { catDialog, stat } from './dialog'
import {
  CAT_NAMES,
  HOUSE_NAMES,
  ADDON_NAMES,
  HOUSE_WITH_ADDON_NAMES,
} from './store'

export enum operatatorTypeEnum {
  largerThan,
}

export enum conditionType {
  score,
  buildingState,
  addonState,
}

export enum state {
  built,
  builtOnRound,
}

export const gameProgression: {
  [key in keyof typeof CAT_NAMES]: {
    conversationId:
      | keyof typeof catDialog.hoboCat
      | keyof typeof catDialog.timmy
      | keyof typeof catDialog.priest
    conditions: (
      | {
          conditionType: conditionType.score
          score: number
          operatorType: operatatorTypeEnum.largerThan
        }
      | {
          conditionType: conditionType.buildingState
          state: state.built
          building: keyof typeof HOUSE_NAMES
          on: boolean
        }
      | {
          conditionType: conditionType.buildingState
          state: state.builtOnRound
          building: keyof typeof HOUSE_NAMES
          on: number
        }
      | ({
          conditionType: conditionType.addonState
          state: state.built
          on: boolean
        } & (
          | {
              building: 'rehab'
              addon: keyof typeof ADDON_NAMES['rehab']
            }
          | {
              building: 'orphanage'
              addon: keyof typeof ADDON_NAMES['orphanage']
            }
          | {
              building: 'university'
              addon: keyof typeof ADDON_NAMES['university']
            }
        ))
    )[]
    shouldReoccur: boolean
    chance: number
  }[]
} = {
  [CAT_NAMES.hoboCat]: [
    // 0
    {
      conversationId: catDialog.hoboCat.intro,
      conditions: [
        {
          conditionType: conditionType.score,
          score: -1,
          operatorType: operatatorTypeEnum.largerThan,
        },
      ],
      shouldReoccur: false,
      chance: 1,
    },

    // 1
    {
      conditions: [
        {
          conditionType: conditionType.score,
          score: 500,
          operatorType: operatatorTypeEnum.largerThan,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.hoboCatHouse,
          on: false,
        },
      ],
      shouldReoccur: false,
      chance: 1,
      conversationId: catDialog.hoboCat.hoboCatHouseBuiltFirstRound,
    },
    // 2
    {
      conditions: [
        {
          conditionType: conditionType.score,
          score: 0,
          operatorType: operatatorTypeEnum.largerThan,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.hoboCatHouse,
          on: false,
        },
      ],
      shouldReoccur: false,
      chance: 1,
      conversationId: catDialog.hoboCat.firstDiamond,
    },
    // 3
    {
      conditions: [
        {
          conditionType: conditionType.score,
          score: 499,
          operatorType: operatatorTypeEnum.largerThan,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.hoboCatHouse,
          on: false,
        },
      ],
      shouldReoccur: false,
      chance: 1,
      conversationId: catDialog.hoboCat.hoboCatHouseBuilt,
    },
    // 4
    {
      conditions: [
        {
          conditionType: conditionType.score,
          score: 999,
          operatorType: operatatorTypeEnum.largerThan,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.orphanage,
          on: false,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.hoboCatHouse,
          on: true,
        },
      ],
      shouldReoccur: true,
      chance: 0.2,
      conversationId: catDialog.hoboCat.orphanage,
    },
    // 4
    {
      conditions: [
        {
          conditionType: conditionType.score,
          score: 999,
          operatorType: operatatorTypeEnum.largerThan,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.rehab,
          on: false,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.hoboCatHouse,
          on: true,
        },
      ],
      shouldReoccur: true,
      chance: 0.2,
      conversationId: catDialog.hoboCat.rehab,
    },
    // 5
    {
      conditions: [
        {
          conditionType: conditionType.score,
          score: 999,
          operatorType: operatatorTypeEnum.largerThan,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.university,
          on: false,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.rehab,
          on: true,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.orphanage,
          on: true,
        },
      ],
      shouldReoccur: true,
      chance: 0.2,
      conversationId: catDialog.hoboCat.school,
    },
    // 6
    {
      conditions: [
        {
          conditionType: conditionType.score,
          score: 999,
          operatorType: operatatorTypeEnum.largerThan,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.rehab,
          on: true,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.builtOnRound,
          building: HOUSE_NAMES.rehab,
          on: 2,
        },
        {
          conditionType: conditionType.addonState,
          state: state.built,
          addon: ADDON_NAMES[HOUSE_NAMES.rehab].hospital,
          building: HOUSE_NAMES.rehab,
          on: false,
        },
        {
          conditionType: conditionType.addonState,
          state: state.built,
          addon: ADDON_NAMES[HOUSE_NAMES.rehab].monastery,
          building: HOUSE_NAMES.rehab,
          on: false,
        },
      ],
      shouldReoccur: false,
      chance: 0.3,
      conversationId: catDialog.hoboCat.hospital,
    },
    // 7
    {
      conditions: [
        {
          conditionType: conditionType.score,
          score: 999,
          operatorType: operatatorTypeEnum.largerThan,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.rehab,
          on: true,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.builtOnRound,
          building: HOUSE_NAMES.rehab,
          on: 4,
        },
        {
          conditionType: conditionType.addonState,
          state: state.built,
          addon: ADDON_NAMES[HOUSE_NAMES.rehab].phychiatricWing,
          building: HOUSE_NAMES.rehab,
          on: false,
        },
        {
          conditionType: conditionType.addonState,
          state: state.built,
          addon: ADDON_NAMES[HOUSE_NAMES.rehab].hospital,
          building: HOUSE_NAMES.rehab,
          on: true,
        },
      ],
      shouldReoccur: false,
      chance: 0.3,
      conversationId: catDialog.hoboCat.psyciatricWing,
    },
  ],
  timmy: [
    {
      conditions: [
        {
          conditionType: conditionType.score,
          score: 999,
          operatorType: operatatorTypeEnum.largerThan,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.orphanage,
          on: true,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.builtOnRound,
          building: HOUSE_NAMES.orphanage,
          on: 2,
        },
        {
          conditionType: conditionType.addonState,
          state: state.built,
          addon: ADDON_NAMES[HOUSE_NAMES.orphanage].youthCenter,
          building: HOUSE_NAMES.orphanage,
          on: false,
        },
      ],
      shouldReoccur: true,
      chance: 0.3,
      conversationId: catDialog.timmy.youthCenter,
    },
    {
      conditions: [
        {
          conditionType: conditionType.score,
          score: 999,
          operatorType: operatatorTypeEnum.largerThan,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.orphanage,
          on: true,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.builtOnRound,
          building: HOUSE_NAMES.orphanage,
          on: 4,
        },
        {
          conditionType: conditionType.addonState,
          state: state.built,
          addon: ADDON_NAMES[HOUSE_NAMES.orphanage].youthCenter,
          building: HOUSE_NAMES.orphanage,
          on: true,
        },
        {
          conditionType: conditionType.addonState,
          state: state.built,
          addon: ADDON_NAMES[HOUSE_NAMES.orphanage].summerCamp,
          building: HOUSE_NAMES.orphanage,
          on: false,
        },
      ],
      shouldReoccur: true,
      chance: 0.3,
      conversationId: catDialog.timmy.summerCamp,
    },
    {
      conditions: [
        {
          conditionType: conditionType.score,
          score: 999,
          operatorType: operatatorTypeEnum.largerThan,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.university,
          on: true,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.builtOnRound,
          building: HOUSE_NAMES.university,
          on: 5,
        },
        {
          conditionType: conditionType.addonState,
          state: state.built,
          building: HOUSE_WITH_ADDON_NAMES.university,
          addon: ADDON_NAMES.university.rocketUniversity,
          on: false,
        },
      ],
      shouldReoccur: true,
      chance: 0.3,
      conversationId: catDialog.timmy.rocketUniversity,
    },
  ],
  priest: [
    {
      conditions: [
        {
          conditionType: conditionType.buildingState,
          state: state.built,
          building: HOUSE_NAMES.rehab,
          on: true,
        },
        {
          conditionType: conditionType.addonState,
          state: state.built,
          addon: ADDON_NAMES[HOUSE_NAMES.rehab].hospital,
          building: HOUSE_NAMES.rehab,
          on: false,
        },
        {
          conditionType: conditionType.addonState,
          state: state.built,
          addon: ADDON_NAMES[HOUSE_NAMES.rehab].monastery,
          building: HOUSE_NAMES.rehab,
          on: false,
        },
        {
          conditionType: conditionType.buildingState,
          state: state.builtOnRound,
          building: HOUSE_NAMES.university,
          on: 5,
        },
      ],
      shouldReoccur: true,
      chance: 0.3,
      conversationId: catDialog.priest.monastary,
    },
  ],
}
