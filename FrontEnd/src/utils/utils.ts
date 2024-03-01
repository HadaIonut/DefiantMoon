export const getRandomString = (): string => (Math.random() + 1).toString(36).substring(7)

export const getSignedNumber = (value: number, displayForZero: boolean = false) => new Intl.NumberFormat('en-US', {
  signDisplay: displayForZero ? 'always' : 'exceptZero',
}).format(value)

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts?.pop?.()?.split?.(';')?.shift?.()
}

export const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result as string)
  reader.onerror = reject
})

export const isFile = (input: any) => 'File' in window && input instanceof File
export const isArray = (input: any) => Array.isArray(input)
export const isBlob = (input: any) => 'Blob' in window && input instanceof Blob

const buildFormData = (formData: FormData, data: any, parentKey?: string) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data instanceof Blob)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
    })
  } else {
    const value = data == null ? '' : data

    formData.append(parentKey as string, value)
  }
}

export const jsonToFormData = (data: any) => {
  const formData = new FormData()

  buildFormData(formData, data)

  return formData
}
