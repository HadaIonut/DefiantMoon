export const getRandomString = (): string => (Math.random() + 1).toString(36).substring(7)

export const getSignedNumber = (value: number, displayForZero: boolean = false) => new Intl.NumberFormat('en-US', {
  signDisplay: displayForZero ? 'always' : 'exceptZero',
}).format(value)

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts?.pop?.()?.split?.(';')?.shift?.()
}
