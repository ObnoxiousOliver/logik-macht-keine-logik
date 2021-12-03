import { createStore } from 'vuex'

export default createStore({
  state: {
    nodeLibary: {
      categorys: {
        default: { name: 'Default' },
        primitive: { name: 'Primitive' },
        logicGates: { name: 'Logic Gate' }
      },
      primitive: {
        dot: {
          name: '',
          componentName: 'Dot',
          categorys: ['default', 'primitive'],
          inputs: [''],
          outputs: ['']
        },
        and: {
          name: 'AND',
          categorys: ['default', 'primitive', 'logicGates'],
          function: (a, b) => [a && b],
          inputs: ['', ''],
          outputs: ['']
        },
        not: {
          name: 'NOT',
          categorys: ['default', 'primitive', 'logicGates'],
          function: (a) => [!a],
          inputs: [''],
          outputs: ['']
        }
      },
      complex: {
        highConstant: {
          name: '',
          componentName: 'High Constant',
          categorys: ['default'],
          nodes: [{ type: 'inputs', position: { x: 126.4, y: 270.3333435058594 }, id: '77b7fb95-fe84-4678-8e72-aaae8ffb9639' }, { type: 'outputs', position: { x: 1067.6000000000001, y: 270.3333435058594 }, id: '3fea7bc7-14b0-49c0-8c0f-e7d7618a053f' }, { id: 'ad5b0373-bd9b-4169-abeb-c9d0c7f05ede', node: 'not', position: { x: 923, y: 291.3333435058594 }, outgoingPoints: [{ i: 0, p: { id: '3fea7bc7-14b0-49c0-8c0f-e7d7618a053f', i: 0 }, sections: null }] }],
          outputs: [''],
          inputs: []
        },
        or: {
          name: 'OR',
          categorys: ['default', 'logicGates'],
          nodes: [{ id: '375a7e1d-95ed-437c-9de7-8aa7f31c139a', node: 'not', position: { x: 243.33334350585938, y: 220.33334350585938 }, outgoingPoints: [{ i: 0, p: { id: '93a7f04f-4c68-4f65-9012-3b8991984b2a', i: 0 } }] }, { id: '7f132211-a1b8-40a7-99eb-ffd6ab5dc224', node: 'not', position: { x: 241.33334350585938, y: 274.3333435058594 }, outgoingPoints: [{ i: 0, p: { id: '93a7f04f-4c68-4f65-9012-3b8991984b2a', i: 1 } }] }, { id: '93a7f04f-4c68-4f65-9012-3b8991984b2a', node: 'nand', position: { x: 420.3333435058594, y: 239.33334350585938 }, outgoingPoints: [{ i: 0, p: { id: '097d6c32-6bd8-41c6-b916-e61c97ca9642', i: 0 } }] }, { type: 'outputs', position: { x: 640.8000183105469, y: 224.46875 }, id: '097d6c32-6bd8-41c6-b916-e61c97ca9642' }, { type: 'inputs', position: { x: 78.86666870117188, y: 216.46875 }, id: '793a9d58-211b-44ab-97c6-b2e39ac99b16', outgoingPoints: [{ i: 0, p: { id: '375a7e1d-95ed-437c-9de7-8aa7f31c139a', i: 0 } }, { i: 1, p: { id: '7f132211-a1b8-40a7-99eb-ffd6ab5dc224', i: 0 } }] }],
          outputs: [''],
          inputs: ['', '']
        },
        nand: {
          name: 'NAND',
          categorys: ['default', 'logicGates'],
          nodes: [{ type: 'outputs', position: { x: 593.8000000000002, y: 281.03334350585936 }, id: 'a4231e45-8106-40e1-a30d-5f5f3cb41751' }, { id: 'b3da66ab-51e7-4aa1-91d1-739958a84a95', node: 'not', position: { x: 406, y: 299.73334045410144 }, outgoingPoints: [{ i: 0, p: { id: 'a4231e45-8106-40e1-a30d-5f5f3cb41751', i: 0 } }] }, { id: '0ee94936-1207-467b-acf4-9894c263207c', node: 'and', position: { x: 234.79999999999984, y: 293.0333404541014 }, outgoingPoints: [{ i: 0, p: { id: 'b3da66ab-51e7-4aa1-91d1-739958a84a95', i: 0 } }] }, { type: 'inputs', position: { x: 93.19999999999999, y: 264.3333435058594 }, id: '6bf670f2-23d1-40fb-8c37-a321e548c5d1', outgoingPoints: [{ i: 1, p: { id: '0ee94936-1207-467b-acf4-9894c263207c', i: 1 } }, { i: 0, p: { id: '0ee94936-1207-467b-acf4-9894c263207c', i: 0 } }] }],
          outputs: [''],
          inputs: ['', '']
        }
      },
      custom: []
    }
  },
  mutations: {
    addCustomNode (state, payload) {
      state.nodeLibary.custom.push(payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
