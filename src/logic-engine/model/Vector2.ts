export class Vector2 {
  public x: number
  public y: number

  public get length() : number {
    return Vector2.getLength(this)
  }

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }

  public static getLength (v: Vector2) {
    return Math.sqrt(Math.abs(v.x) + Math.abs(v.y))
  }

  public static distance(a: Vector2, b: Vector2) {
    return Vector2.getLength(new Vector2(b.x - a.x, b.y - a.y))
  }
}