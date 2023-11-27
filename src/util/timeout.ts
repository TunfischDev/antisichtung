
/**
 * Simply wait for a given time
 * @param time
 * @returns {Promise<void>}
 */
export async function timeout(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
