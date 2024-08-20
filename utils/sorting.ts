export const sortByDateDescFutureLast = (
  a: WebFeature,
  b: WebFeature,
): number => {
  const aDate = a.status.baseline_low_date
  const bDate = b.status.baseline_low_date
  if (aDate && bDate) {
    return new Date(bDate).getTime() - new Date(aDate).getTime()
  } else if (!aDate && bDate) {
    return 1
  } else if (aDate && !bDate) {
    return -1
  } else {
    return 0
  }
}

export const sortByDateAscFutureFirst = (
  a: WebFeature,
  b: WebFeature,
): number => {
  const aDate = a.status.baseline_low_date
  const bDate = b.status.baseline_low_date
  if (aDate && bDate) {
    return new Date(aDate).getTime() - new Date(bDate).getTime()
  } else if (!aDate && bDate) {
    return -1
  } else if (aDate && !bDate) {
    return 1
  } else {
    return 0
  }
}

export const sortByDateDescFutureFirst = (
  a: WebFeature,
  b: WebFeature,
): number => {
  const aDate = a.status.baseline_low_date
  const bDate = b.status.baseline_low_date
  if (aDate && bDate) {
    return new Date(bDate).getTime() - new Date(aDate).getTime()
  } else if (!aDate && bDate) {
    return -1
  } else if (aDate && !bDate) {
    return 1
  } else {
    return 0
  }
}

export const sortByDateAscFutureLast = (
  a: WebFeature,
  b: WebFeature,
): number => {
  const aDate = a.status.baseline_low_date
  const bDate = b.status.baseline_low_date
  if (aDate && bDate) {
    return new Date(aDate).getTime() - new Date(bDate).getTime()
  } else if (!aDate && bDate) {
    return 1
  } else if (aDate && !bDate) {
    return -1
  } else {
    return 0
  }
}

export const sortByNameAsc = (a: WebFeature, b: WebFeature): number => {
  return a.name.localeCompare(b.name)
}

export const sortByNameDesc = (a: WebFeature, b: WebFeature): number => {
  return b.name.localeCompare(a.name)
}

export const sortBySource = (): number => 0

export const sortingFunctions = {
  sortByDateDescFutureLast,
  sortByDateDescFutureFirst,
  sortByDateAscFutureLast,
  sortByDateAscFutureFirst,
  sortByNameAsc,
  sortByNameDesc,
  sortBySource,
} as const

export type SortingFunctionsName = keyof typeof sortingFunctions
