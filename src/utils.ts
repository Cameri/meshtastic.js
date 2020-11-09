/**
 * Converts a `ArrayBuffer` to a hex string
 * @todo verify `x` data type
 * @param arrayBuffer Input `ArrayBuffer` to be converted
 */
const bufferToHex = (arrayBuffer: ArrayBuffer) => {
  return Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (x: number) =>
      `00${x.toString(16)}`.slice(-2)
    )
    .join("") as string;
};

/**
 * Converts a `Uint8Array` to an `ArrayBuffer`
 * @param array Input `Uint8Array` to be converted
 */
const typedArrayToBuffer = (array: Uint8Array) => {
  return array.buffer.slice(
    array.byteOffset,
    array.byteLength + array.byteOffset
  );
};

/**
 * Short description
 */
const getEnvironment = () => {
  if (!typeof window) {
    return "browser";
  }
  return "nobrowser";
};

/**
 * This function keeps calling `toTry` until promise resolves or fails
 *  https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect-async-await.html
 *
 * @param max Maximum number of times `toTry` can be called
 * @param delay Delay (seconds) of the first retry
 * @param toTry Called rerty function
 * @param success Function called upon success if `toTry`
 * @param fail Function called upon timeout
 */
const exponentialBackoff = async (
  max: number,
  delay: number,
  toTry: Function,
  success: Function,
  fail: Function
) => {
  try {
    const result = await toTry();
    success(result);
  } catch (error) {
    if (max === 0) {
      return fail();
    }
    setTimeout(() => {
      exponentialBackoff(--max, delay * 2, toTry, success, fail);
    }, delay * 1000);
  }
};

export { bufferToHex, typedArrayToBuffer, getEnvironment, exponentialBackoff };
