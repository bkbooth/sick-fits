const ESS = 's';

/**
 * Apostrophise a name by adding an apostrophe with an optional 's'
 *
 * @param {string} name
 *
 * @returns {string}
 */
export default function apostrophiseName(name) {
  const nameEndsWithEss = name[name.length - 1].toLowerCase() === ESS;
  return `${name}'${nameEndsWithEss ? '' : ESS}`;
}
