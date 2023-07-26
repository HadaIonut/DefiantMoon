export const getRandomString = (): string => (Math.random() + 1).toString(36).substring(7)

export const getSignedNumber = (value: number) => new Intl.NumberFormat('en-US', {
  signDisplay: 'exceptZero',
}).format(value)
