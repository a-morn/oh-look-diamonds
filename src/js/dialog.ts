import {
  CAT_NAMES,
  CAT_NAMES_INCLUDEING_CATZ,
  HOUSE_NAMES,
  ADDON_NAMES,
} from './store'

export const stat = {
  score: 'score',
  built: 'built',
  kittensApprovalRating: 'kittensApprovalRating',
  catPartyApprovalRating: 'catPartyApprovalRating',
  villagersApprovalRating: 'villagersApprovalRating',
  addOn: 'addOn',
} as const

export const catDialog = {
  [CAT_NAMES.hoboCat]: {
    intro: 'intro' as const,
    firstDiamond: 'firstDiamond' as const,
    hoboCatHouseBuiltFirstRound: 'hoboCatHouseBuiltFirstRound' as const,
    hoboCatHouseBuilt: 'hoboCatHouseBuilt' as const,
    orphanage: 'orphanage' as const,
    rehab: 'rehab' as const,
    school: 'school' as const,
    hospital: 'hospital' as const,
    psyciatricWing: 'psyciatricWing' as const,
    insufficientFunds: 'insufficientFunds' as const,
  },

  [CAT_NAMES.timmy]: {
    youthCenter: 'youthCenter' as const,
    summerCamp: 'summerCamp' as const,
    rocketUniversity: 'rocketUniversity' as const,
  },
  [CAT_NAMES.priest]: {
    monastary: 'monastary' as const,
  },
}

type Line = {
  who: keyof typeof CAT_NAMES_INCLUDEING_CATZ
  what: string
  end: boolean
  triggers?: (
    | {
        stat: 'score'
        value: number
      }
    | {
        stat: 'built'
        value: keyof typeof HOUSE_NAMES
      }
    | {
        stat: 'catPartyApprovalRating'
        value: number
      }
    | {
        stat: 'kittensApprovalRating'
        value: number
      }
    | {
        stat: 'villagersApprovalRating'
        value: number
      }
    | ({
        stat: 'addOn'
      } & (
        | {
            value: keyof typeof ADDON_NAMES['orphanage']
            building: 'orphanage'
          }
        | {
            value: keyof typeof ADDON_NAMES['rehab']
            building: 'rehab'
          }
        | {
            value: keyof typeof ADDON_NAMES['university']
            building: 'university'
          }
      ))
  )[]
} & (
  | {
      choice: false
      nextId: number
    }
  | {
      choice: true
      choices: {
        text: string
        choiceId: number
      }[]
    }
)

export const dialog: {
  [keyName in keyof typeof CAT_NAMES]: {
    [key in keyof typeof catDialog[keyName]]: {
      dialog: Line[]
      idle: {
        what: string
      }
    }
  }
} = {
  [CAT_NAMES.hoboCat]: {
    [catDialog[CAT_NAMES.hoboCat].intro]: {
      dialog: [
        {
          who: CAT_NAMES.hoboCat,
          what: 'Good evening',
          choice: false as const,
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow',
          choice: false as const,
          nextId: 2,
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what: "whatcha lookin' at\nthere, kitten?",
          choice: false as const,
          nextId: 3,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'diamonds!',
          choice: false as const,
          nextId: 4,
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what: "Heh, up there is nuthin' but \nbig blobs of gas and fire",
          choice: false as const,
          nextId: 5,
          end: true,
        },
      ],
      idle: {
        what: '*cough*',
      },
    },
    [catDialog[CAT_NAMES.hoboCat].firstDiamond]: {
      dialog: [
        {
          who: CAT_NAMES.hoboCat,
          what: 'Well I be damned - a diamond!',
          choice: false as const,
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow!',
          choice: false as const,
          nextId: 2,
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what:
            'For me? \nMuch obliged, kitten!\nHey, with  20 of these I could\nbuild myself a house',
          choice: false as const,
          nextId: 3,
          end: true,
          triggers: [
            {
              stat: stat.score,
              value: -1,
            },
          ],
        },
      ],
      idle: {
        what: '*cough* better times ahead',
      },
    },
    [catDialog[CAT_NAMES.hoboCat].hoboCatHouseBuiltFirstRound]: {
      dialog: [
        {
          who: CAT_NAMES.hoboCat,
          what: 'Well I be damned - look at all those diamonds!',
          choice: false as const,
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow!',
          choice: false as const,
          nextId: 2,
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what:
            'For me? \nMuch obliged, kitten!\nWith these I can\nbuild myself a house',
          choice: false as const,
          nextId: 3,
          end: true,
          triggers: [
            {
              stat: stat.built,
              value: HOUSE_NAMES.hoboCatHouse,
            },
            {
              stat: stat.score,
              value: -21,
            },
          ],
        },
      ],
      idle: {
        what: 'homeowners association \nhere I come!',
      },
    },
    [catDialog[CAT_NAMES.hoboCat].hoboCatHouseBuilt]: {
      dialog: [
        {
          who: CAT_NAMES.hoboCat,
          what: "Hey that's enough to build me a house!",
          choice: false as const,
          nextId: 1,
          triggers: [
            {
              stat: stat.built,
              value: HOUSE_NAMES.hoboCatHouse,
            },
            {
              stat: stat.score,
              value: -20,
            },
          ],
          end: true,
        },
      ],
      idle: {
        what: 'homeowners association \nhere I come!',
      },
    },
    [catDialog[CAT_NAMES.hoboCat].orphanage]: {
      dialog: [
        {
          who: CAT_NAMES.hoboCat,
          what:
            "Say there's plenty of\nstray kitties in Katholm.\nWhy don't we build 'em a home?",
          choice: true,
          choices: [
            {
              text: 'no',
              choiceId: 1,
            },
            {
              text: 'yes',
              choiceId: 3,
            },
          ],
        } as Line,
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow...',
          choice: false as const,
          nextId: 2,
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what: 'Guess those kittes \ngotta fend for themselves',
          choice: false as const,
          nextId: 5,
          end: true,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow!',
          choice: false as const,
          nextId: 4,
          triggers: [
            {
              stat: stat.built,
              value: HOUSE_NAMES.orphanage,
            },
            {
              stat: stat.score,
              value: -20,
            },
            {
              stat: stat.kittensApprovalRating,
              value: 0.001,
            },
            {
              stat: stat.catPartyApprovalRating,
              value: -0.0001,
            },
          ],
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what: 'We can start\nhousing kittens straight away',
          choice: false as const,
          nextId: 5,
          end: true,
        },
        {
          who: CAT_NAMES.hoboCat,
          what:
            'Add as many\nbunks as you see fit.\nBe aware though,\nwe gotta afford to pay\nthe bills',
          choice: false as const,
          nextId: 6,
          end: true,
        },
      ],
      idle: {
        what: "♫ ain't no love \nin the heart of the city ♫",
      },
    },
    [catDialog[CAT_NAMES.hoboCat].rehab]: {
      dialog: [
        {
          who: CAT_NAMES.hoboCat,
          what: "There's some old friends\nof mine back in Katholm.",
          choice: false as const,
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what:
            "They're still\nstuck in the hole I've dug myself out of.\nWhy don't we build a place\nfor them out here?",
          choice: true,
          choices: [
            {
              text: 'no',
              choiceId: 2,
            },
            {
              text: 'yes',
              choiceId: 4,
            },
          ],
          end: false,
        } as Line,
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow...',
          choice: false as const,
          nextId: 3,
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what: "They're on their \nown then",
          choice: false as const,
          nextId: 6,
          end: true,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow!',
          choice: false as const,
          nextId: 5,
          triggers: [
            {
              stat: stat.built,
              value: HOUSE_NAMES.rehab,
            },
            {
              stat: stat.score,
              value: -20,
            },
            {
              stat: stat.villagersApprovalRating,
              value: -0.001,
            },
            {
              stat: stat.catPartyApprovalRating,
              value: -0.0002,
            },
          ],
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what:
            "Add some beds\nand I'll lead them through\nall twelve steps to\na better life",
          choice: false as const,
          nextId: 6,
          end: true,
        },
      ],
      idle: {
        what: "♫ I've seen the catnip\nand the damage done ♫",
      },
    },
    [catDialog[CAT_NAMES.hoboCat].school]: {
      dialog: [
        {
          who: CAT_NAMES.hoboCat,
          what:
            "Kittens need schoolin'\nbut tuition fees at \nCat King Collage\nare too damn high.",
          choice: false as const,
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what:
            "Why don't we \nfound a university. \nfunny hats and \ntitles for all!",
          choice: true,
          choices: [
            {
              text: 'no',
              choiceId: 2,
            },
            {
              text: 'yes',
              choiceId: 4,
            },
          ],
          end: false,
        } as Line,
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow...',
          choice: false as const,
          nextId: 3,
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what: 'How they gonna get\nschooled now?',
          choice: false as const,
          nextId: 6,
          end: true,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow!',
          choice: false as const,
          nextId: 5,
          triggers: [
            {
              stat: stat.built,
              value: HOUSE_NAMES.university,
            },
            {
              stat: stat.score,
              value: -20,
            },
            {
              stat: stat.catPartyApprovalRating,
              value: -0.0005,
            },
          ],
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what:
            'You got some time to\nteach in between those\nrocket rides, right kitten?',
          choice: false as const,
          nextId: 6,
          end: true,
        },
      ],
      idle: {
        what: 'vetenskap och konst',
      },
    },
    [catDialog[CAT_NAMES.hoboCat].hospital]: {
      dialog: [
        {
          who: CAT_NAMES.hoboCat,
          what: "Let's make the catnip rehab center\na full blown hospital!",
          choice: true,
          choices: [
            {
              text: 'no',
              choiceId: 1,
            },
            {
              text: 'yes',
              choiceId: 3,
            },
          ],
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow...',
          choice: false as const,
          nextId: 2,
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what: 'better stay healthy\nthen...',
          choice: false as const,
          nextId: 10,
          end: true,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow!',
          choice: false as const,
          nextId: 4,
          triggers: [
            {
              stat: stat.addOn,
              building: HOUSE_NAMES.rehab,
              value: ADDON_NAMES[HOUSE_NAMES.rehab].hospital,
            },
            {
              stat: stat.score,
              value: -20,
            },
            {
              stat: stat.villagersApprovalRating,
              value: 0.001,
            },
            {
              stat: stat.catPartyApprovalRating,
              value: -0.0008,
            },
          ],
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what: 'medical care for all cats!',
          choice: false as const,
          nextId: 10,
          end: true,
        },
      ],
      idle: {
        what: 'I feel healthier already',
      },
    },
    [catDialog[CAT_NAMES.hoboCat].psyciatricWing]: {
      dialog: [
        {
          who: CAT_NAMES.hoboCat,
          what:
            'We should add better\nsupport for care for\nthe mentally ill \nat the hospital.',
          choice: true,
          choices: [
            {
              text: 'no',
              choiceId: 1,
            },
            {
              text: 'yes',
              choiceId: 3,
            },
          ],
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow...',
          choice: false as const,
          nextId: 2,
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what: 'better stay sane\nthen...',
          choice: false as const,
          nextId: 10,
          end: true,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow!',
          choice: false as const,
          nextId: 4,
          triggers: [
            {
              stat: stat.addOn,
              building: HOUSE_NAMES.rehab,
              value: ADDON_NAMES[HOUSE_NAMES.rehab].phychiatricWing,
            },
            {
              stat: stat.score,
              value: -20,
            },
          ],
          end: false,
        },
        {
          who: CAT_NAMES.hoboCat,
          what: 'A new wing has been added\nto the hospital',
          choice: false as const,
          nextId: 10,
          end: true,
        },
      ],
      idle: {
        what: 'Gonna take a stroll in \nthat fancy new garden',
      },
    },
    [catDialog[CAT_NAMES.hoboCat].insufficientFunds]: {
      dialog: [
        {
          who: CAT_NAMES.hoboCat,
          what: "Can't make rent",
          choice: false as const,
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow...',
          choice: false as const,
          nextId: 2,
          end: false,
        },
      ],
      idle: {
        what: 'harsh times',
      },
    },
  },
  [CAT_NAMES.timmy]: {
    [catDialog[CAT_NAMES.timmy].youthCenter]: {
      dialog: [
        {
          who: CAT_NAMES.timmy,
          what: 'can haz youth center for stray kitties?',
          choice: true,
          choices: [
            {
              text: 'no',
              choiceId: 1,
            },
            {
              text: 'yes',
              choiceId: 3,
            },
          ],
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow...',
          choice: false as const,
          nextId: 2,
          end: false,
        },
        {
          who: CAT_NAMES.timmy,
          what: 'oh no',
          choice: false as const,
          nextId: 10,
          end: true,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow!',
          choice: false as const,
          nextId: 4,
          triggers: [
            {
              stat: stat.addOn,
              building: HOUSE_NAMES.orphanage,
              value: ADDON_NAMES[HOUSE_NAMES.orphanage].youthCenter,
            },
            {
              stat: stat.score,
              value: -20,
            },
            {
              stat: stat.kittensApprovalRating,
              value: 0.0015,
            },
          ],
          end: false,
        },
        {
          who: CAT_NAMES.timmy,
          what: 'yay!',
          choice: false as const,
          nextId: 10,
          end: true,
        },
      ],
      idle: {
        what: 'can i have some more?',
      },
    },
    [catDialog[CAT_NAMES.timmy].summerCamp]: {
      dialog: [
        {
          who: CAT_NAMES.timmy,
          what: 'can haz summer camp for stray kitties?',
          choice: true,
          choices: [
            {
              text: 'no',
              choiceId: 1,
            },
            {
              text: 'yes',
              choiceId: 3,
            },
          ],
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow...',
          choice: false as const,
          nextId: 2,
          end: false,
        },
        {
          who: CAT_NAMES.timmy,
          what: 'oh no',
          choice: false as const,
          nextId: 10,
          end: true,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow!',
          choice: false as const,
          nextId: 4,
          triggers: [
            {
              stat: stat.addOn,
              building: HOUSE_NAMES.orphanage,
              value: ADDON_NAMES[HOUSE_NAMES.orphanage].summerCamp,
            },
            {
              stat: stat.score,
              value: -20,
            },
            {
              stat: stat.kittensApprovalRating,
              value: 0.002,
            },
          ],
          end: false,
        },
        {
          who: CAT_NAMES.timmy,
          what: 'hurray!',
          choice: false as const,
          nextId: 10,
          end: true,
        },
      ],
      idle: {
        what: 'can i please have some more?',
      },
    },
    [catDialog[CAT_NAMES.timmy].rocketUniversity]: {
      dialog: [
        {
          who: CAT_NAMES.timmy,
          what: 'i can be rocketeer too?',
          choice: true,
          choices: [
            {
              text: 'there can be only one',
              choiceId: 1,
            },
            {
              text: "i'll teach you all I know",
              choiceId: 3,
            },
          ],
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow...',
          choice: false as const,
          nextId: 2,
          end: false,
        },
        {
          who: CAT_NAMES.timmy,
          what: 'oh no',
          choice: false as const,
          nextId: 10,
          end: true,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow!',
          choice: false as const,
          nextId: 4,
          triggers: [
            {
              stat: stat.addOn,
              building: HOUSE_NAMES.university,
              value: ADDON_NAMES[HOUSE_NAMES.university].rocketUniversity,
            },
            {
              stat: stat.score,
              value: -20,
            },
            {
              stat: stat.catPartyApprovalRating,
              value: -0.002,
            },
            {
              stat: stat.kittensApprovalRating,
              value: 0.003,
            },
          ],
          end: false,
        },
        {
          who: CAT_NAMES.timmy,
          what:
            "i'll enroll to the Catz Rocket Institute Rocketeer Program asap",
          choice: false as const,
          nextId: 10,
          end: true,
        },
      ],
      idle: {
        what: 'the final frontier',
      },
    },
  },
  [CAT_NAMES.priest]: {
    [catDialog[CAT_NAMES.priest].monastary]: {
      dialog: [
        {
          who: CAT_NAMES.priest,
          what: 'I see you have a home for\ncats a stray from the flock.',
          choice: false as const,
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES.priest,
          what:
            'When they turned to katnip\nthey turned away from the cat God.',
          choice: false as const,
          nextId: 2,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow?',
          choice: false as const,
          nextId: 3,
          end: false,
        },
        {
          who: CAT_NAMES.priest,
          what:
            'With the help of my congregation\nwe can lead them back to the\nrightous path.',
          choice: true,
          choices: [
            {
              text: 'no',
              choiceId: 4,
            },
            {
              text: 'yes',
              choiceId: 6,
            },
          ],
          nextId: 1,
          end: false,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow...',
          choice: false as const,
          nextId: 5,
          end: false,
        },
        {
          who: CAT_NAMES.priest,
          what: 'may the Cat God forgive you',
          choice: false as const,
          nextId: 10,
          end: true,
        },
        {
          who: CAT_NAMES_INCLUDEING_CATZ.catz,
          what: 'meow!',
          choice: false as const,
          nextId: 7,
          triggers: [
            {
              stat: stat.addOn,
              building: HOUSE_NAMES.rehab,
              value: ADDON_NAMES[HOUSE_NAMES.rehab].monastery,
            },
            {
              stat: stat.score,
              value: 20,
            },
            {
              stat: stat.villagersApprovalRating,
              value: 0.001,
            },
          ],
          end: false,
        },
        {
          who: CAT_NAMES.priest,
          what:
            'Excellent! Please take this\nsmall gift as a token\nof the Lords apprication.',
          choice: false as const,
          nextId: 10,
          end: true,
        },
      ],
      idle: {
        what: 'blessings upon ye, child of the cat God',
      },
    },
  },
}
