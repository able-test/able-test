const validResponses = ["yes", "no", "y", "n", "\r"]

const validYorN = (value) => {
  return validResponses.includes(value.toLowerCase()) ? true : "Please enter yes or no."
}

module.exports = validYorN;