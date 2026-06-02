/** Split constitutional `SourceFileReference.storageRef` into bucket + object path. */
export function parseStorageRef(storageRef: string): { bucket: string; objectPath: string } {
  const slash = storageRef.indexOf("/");
  if (slash <= 0) {
    throw new Error(`Invalid storageRef: ${storageRef}`);
  }
  return {
    bucket: storageRef.slice(0, slash),
    objectPath: storageRef.slice(slash + 1),
  };
}
