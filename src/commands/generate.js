const fs = require('node:fs')
const path = require('node:path')

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox) => {
    const {
      parameters,
      template: { generate },
      print: { success, error },
    } = toolbox

    let name = parameters.first

    if (!name && !fs.existsSync(path.resolve('./challenges'))) {
      error(
        `Couldn't find any challenges DIR in ${path.resolve('./challenges')}.`
      )
      return
    }

    if (!name) {
      const files = fs.readdirSync(path.resolve('./challenges'))
      const fileNames = files.map((file) => file.split('.')[0])
      const lastChallengeNumberCreated = fileNames
        .map((name) => {
          return Number(
            name
              .split('')
              .map((character) => {
                if (Number.isInteger(Number(character))) {
                  return character
                }
              })
              .filter((item) => item !== undefined)
              .join('')
          )
        })
        .sort()
        .reverse()[0]
      const nextChallengeNumber = lastChallengeNumberCreated + 1
      name = `challenge${nextChallengeNumber}`
    }

    await generate({
      template: 'challenge.js.ejs',
      target: `challenges/${name}.challenge.js`,
      props: { name },
    })

    await generate({
      template: 'challenge-test.js.ejs',
      target: `tests/${name}.test.js`,
      props: { name },
    })

    success('Challenge file and test file generated!')
  },
}
