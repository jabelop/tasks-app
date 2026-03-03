export default interface ValueObject<E> {
  /**
   * Get the object primitive value
   */
  getValue(): E;
}
