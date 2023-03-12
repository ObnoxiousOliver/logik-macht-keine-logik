import { Port } from "./Port"
import { Vector2 } from "./Vector2"

export abstract class Node {
  id: string
  name: string
  component: JSX.Element
  position: Vector2
  ports: Port[]

  update (): void {}
}

export class AndNode extends Node {
  update (): void {
    const [aIn, bIn, out] = this.ports

    out.
  }
}
