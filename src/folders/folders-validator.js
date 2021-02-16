const logger = require('../logger')

const NO_ERRORS = null

function getFolderValidationError({ name }) {

  if (name.length === 0) {
    logger.error(`Folder must have a name`)
    return {
      error: {
        message: `Folder must have a name`
      }
    }
  }
  return NO_ERRORS
}

module.exports = {
  getFolderValidationError,
}