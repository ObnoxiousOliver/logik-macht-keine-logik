export type PortType = 'in' | 'out'
export type PortOrientation = 'n' | 'e' | 's' | 'w'

export class Port {
  id: string
  name: string
  type: PortType
  bits: number
  orientration: PortOrientation

  connectedPorts: Port[]
  addConnection (...ports): this {
    return this
  }
  
  currentValue: Signal = null
  send (signal: Signal) {

  }
  
  private listeners: (() => void)[] = []
  onReceive (cb: () => void) {
    this.listeners.push(cb)
  }
  offReceive (cb: () => void) {
    this.listeners = this.listeners.filter(x => x !== cb)
  }
}