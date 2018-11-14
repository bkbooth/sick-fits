const ESS = 's'

export default function apostrophiseName(name) {
  const nameEndsWithEss = name[name.length - 1].toLowerCase() === ESS
  return `${name}'${nameEndsWithEss ? '' : ESS}`
}
