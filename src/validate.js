export const required = (value) => (value ? null : 'Required.')

export const maxLength = (max) => (value) =>
  value && value.length > max ? `Must be ${max} characters or fewer.` : null

export const minLength = (min) => (value) =>
  value && value.length < min ? `Must be ${min} characters or more.` : null

export const number = (value) =>
  value && Number.isNaN(Number(value)) ? 'Must be a number.' : null

export const minValue = (min) => (value) =>
  value && value < min ? `Must be at least ${min}.` : null

export const maxValue = (max) => (value) =>
  value && value > max ? `Must be ${max} or less.` : null

export const gt = (x) => (value) =>
  value && value <= x ? `Must be greater than ${x}.` : null

export const alphanumeric = (value) =>
  value && !/^[a-z0-9]+$/i.test(value) ? 'Invalid characters.' : null

export const email = (value) =>
  value && !/^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z0-9-]+$/i.test(value)
    ? 'Invalid email address.'
    : null

export const url = (value) =>
  value &&
  !/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[-a-zA-Z0-9@:%._+~#=]{2,256}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i.test(
    value,
  )
    ? 'Invalid URL (example: http(s)://www.example.com).'
    : null

export const integer = (value) => {
  if (!value) {
    return null
  }

  const v = Number(value)
  return Number.isNaN(v) || v % 1 !== 0 ? 'Must be a whole number.' : null
}

export const ethereumAddress = (value) =>
  /^0x[a-fA-F0-9]{40}$/.test(value) ? null : 'Must be a valid Ethereum address.'

export const date = (value) =>
  value instanceof Date ? null : 'Pick date from the calendar.'

export const laterThan = (x, value, label) =>
  value && x && value.getTime() > x.getTime()
    ? null
    : `Must be later than ${label}.`
