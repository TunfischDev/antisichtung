
/**
 * Simply wait for a given time
 * @param time
 * @returns {Promise<void>}
 */
export async function timeout(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
