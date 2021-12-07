import { createStore } from 'vuex'

export default createStore({
  state: {
    nodeLibary: {
      categories: {
        default: { name: 'Standart' },
        primitive: { name: 'Primitiv' },
        logicGates: { name: 'Logische Gatter' }
      },
      primitive: {
        and: {
          name: 'AND',
          componentName: 'AND-Gate',
          categories: ['default', 'primitive', 'logicGates'],
          function: (a, b) => [a && b],
          inputs: ['', ''],
          outputs: ['']
        },
        not: {
          name: 'NOT',
          componentName: 'NOT-Gate',
          categories: ['default', 'primitive', 'logicGates'],
          function: (a) => [!a],
          inputs: [''],
          outputs: ['']
        }
      },
      complex: {
        or: {
          name: 'OR',
          componentName: 'OR-Gate',
          categories: ['default', 'logicGates'],
          nodes: [{ id: '375a7e1d-95ed-437c-9de7-8aa7f31c139a', node: 'not', position: { x: 243.33334350585938, y: 220.33334350585938 }, outgoingPoints: [{ i: 0, p: { id: '93a7f04f-4c68-4f65-9012-3b8991984b2a', i: 0 } }] }, { id: '7f132211-a1b8-40a7-99eb-ffd6ab5dc224', node: 'not', position: { x: 241.33334350585938, y: 274.3333435058594 }, outgoingPoints: [{ i: 0, p: { id: '93a7f04f-4c68-4f65-9012-3b8991984b2a', i: 1 } }] }, { id: '93a7f04f-4c68-4f65-9012-3b8991984b2a', node: 'nand', position: { x: 420.3333435058594, y: 239.33334350585938 }, outgoingPoints: [{ i: 0, p: { id: '097d6c32-6bd8-41c6-b916-e61c97ca9642', i: 0 } }] }, { type: 'outputs', position: { x: 640.8000183105469, y: 224.46875 }, id: '097d6c32-6bd8-41c6-b916-e61c97ca9642' }, { type: 'inputs', position: { x: 78.86666870117188, y: 216.46875 }, id: '793a9d58-211b-44ab-97c6-b2e39ac99b16', outgoingPoints: [{ i: 0, p: { id: '375a7e1d-95ed-437c-9de7-8aa7f31c139a', i: 0 } }, { i: 1, p: { id: '7f132211-a1b8-40a7-99eb-ffd6ab5dc224', i: 0 } }] }],
          outputs: [''],
          inputs: ['', '']
        },
        nand: {
          name: 'NAND',
          componentName: 'NAND-Gate',
          categories: ['default', 'logicGates'],
          nodes: [{ type: 'outputs', position: { x: 593.8000000000002, y: 281.03334350585936 }, id: 'a4231e45-8106-40e1-a30d-5f5f3cb41751' }, { id: 'b3da66ab-51e7-4aa1-91d1-739958a84a95', node: 'not', position: { x: 406, y: 299.73334045410144 }, outgoingPoints: [{ i: 0, p: { id: 'a4231e45-8106-40e1-a30d-5f5f3cb41751', i: 0 } }] }, { id: '0ee94936-1207-467b-acf4-9894c263207c', node: 'and', position: { x: 234.79999999999984, y: 293.0333404541014 }, outgoingPoints: [{ i: 0, p: { id: 'b3da66ab-51e7-4aa1-91d1-739958a84a95', i: 0 } }] }, { type: 'inputs', position: { x: 93.19999999999999, y: 264.3333435058594 }, id: '6bf670f2-23d1-40fb-8c37-a321e548c5d1', outgoingPoints: [{ i: 1, p: { id: '0ee94936-1207-467b-acf4-9894c263207c', i: 1 } }, { i: 0, p: { id: '0ee94936-1207-467b-acf4-9894c263207c', i: 0 } }] }],
          outputs: [''],
          inputs: ['', '']
        },
        nor: {
          name: 'NOR',
          componentName: 'NOR-Gate',
          categories: ['default', 'logicGates'],
          nodes: [{ id: '3ab4a32e-bd39-4d6b-88c7-c9f340f8835e', node: 'not', position: { x: 502, y: 372 }, outgoingPoints: [{ i: 0, p: { id: '925d385d-3097-4374-91e0-6ff500eeda44', i: 1 }, sections: null }] }, { id: '4774e5f9-c2e6-4db5-aa7e-c127361a9787', node: 'not', position: { x: 504, y: 315.3999938964844 }, outgoingPoints: [{ i: 0, p: { id: '925d385d-3097-4374-91e0-6ff500eeda44', i: 0 }, sections: null }] }, { id: '925d385d-3097-4374-91e0-6ff500eeda44', node: 'and', position: { x: 708, y: 345 }, outgoingPoints: [{ i: 0, p: { id: 'c01eef86-d667-444f-842e-1628dfc97001', i: 0 }, sections: null }] }, { type: 'outputs', position: { x: 940, y: 330 }, id: 'c01eef86-d667-444f-842e-1628dfc97001' }, { type: 'inputs', position: { x: 282, y: 309 }, id: '3825a9c3-44b1-4cc1-9b88-bd7637a16b07', outgoingPoints: [{ i: 0, p: { id: '4774e5f9-c2e6-4db5-aa7e-c127361a9787', i: 0 }, sections: null }, { i: 1, p: { id: '3ab4a32e-bd39-4d6b-88c7-c9f340f8835e', i: 0 }, sections: null }] }],
          outputs: [''],
          inputs: ['', '']
        },
        xor: {
          name: 'XOR',
          componentName: 'XOR-Gate',
          categories: ['default', 'logicGates'],
          nodes: [{ id: '4e921da6-62b4-4428-950b-9a5560fd72d3', node: 'and', position: { x: 441, y: 358 }, outgoingPoints: [{ i: 0, p: { id: 'bf760821-0e13-42ec-b9a3-ced99454dd69', i: 0 }, sections: null }] }, { id: 'd0b6cfb7-d3c7-466b-acb5-2e04642bc920', node: 'or', position: { x: 278, y: 321 }, outgoingPoints: [{ i: 0, p: { id: '4e921da6-62b4-4428-950b-9a5560fd72d3', i: 0 }, sections: null }] }, { id: 'cbc7594a-5f7c-4015-a5a4-784767b57182', node: 'nand', position: { x: 273, y: 401 }, outgoingPoints: [{ i: 0, p: { id: '4e921da6-62b4-4428-950b-9a5560fd72d3', i: 1 }, sections: null }] }, { type: 'outputs', position: { x: 593, y: 344 }, id: 'bf760821-0e13-42ec-b9a3-ced99454dd69' }, { type: 'inputs', position: { x: 57.04000244140625, y: 334.3999938964844 }, id: '7ef86cc1-5352-498f-9731-f0ee877c8cf6', outgoingPoints: [{ i: 0, p: { id: 'd0b6cfb7-d3c7-466b-acb5-2e04642bc920', i: 0 }, sections: null }, { i: 1, p: { id: 'd0b6cfb7-d3c7-466b-acb5-2e04642bc920', i: 1 }, sections: null }, { i: 0, p: { id: 'cbc7594a-5f7c-4015-a5a4-784767b57182', i: 0 }, sections: null }, { i: 1, p: { id: 'cbc7594a-5f7c-4015-a5a4-784767b57182', i: 1 }, sections: null }] }],
          outputs: [''],
          inputs: ['', '']
        },
        highConstant: {
          name: '',
          componentName: 'High Constant',
          categories: ['default'],
          nodes: [{ type: 'inputs', position: { x: 126.4, y: 270.3333435058594 }, id: '77b7fb95-fe84-4678-8e72-aaae8ffb9639' }, { type: 'outputs', position: { x: 1067.6000000000001, y: 270.3333435058594 }, id: '3fea7bc7-14b0-49c0-8c0f-e7d7618a053f' }, { id: 'ad5b0373-bd9b-4169-abeb-c9d0c7f05ede', node: 'not', position: { x: 923, y: 291.3333435058594 }, outgoingPoints: [{ i: 0, p: { id: '3fea7bc7-14b0-49c0-8c0f-e7d7618a053f', i: 0 }, sections: null }] }],
          outputs: [''],
          inputs: []
        },
        '1-bit-Adder': {
          name: '1-Bit Adder',
          categories: ['default'],
          nodes: [{ id: 'a234e408-7adc-4fcc-8b97-29de6b7ac9eb', node: 'and', position: { x: 629, y: 374 }, outgoingPoints: [{ i: 0, p: { id: 'eaae7c42-84cd-4d2b-bcf5-d5255623a3c7', i: 0 }, sections: null }] }, { id: 'eaae7c42-84cd-4d2b-bcf5-d5255623a3c7', node: 'or', position: { x: 863, y: 426 }, outgoingPoints: [{ i: 0, p: { id: 'bf760821-0e13-42ec-b9a3-ced99454dd69', i: 1 }, sections: null }] }, { id: '759f3ddf-7ebd-428b-b9a8-367c0600a35d', node: 'xor', position: { x: 416, y: 253 }, outgoingPoints: [{ i: 0, p: { id: '7a922df0-9fa8-4404-bb02-0db3199fa575', i: 0 }, sections: null }, { i: 0, p: { id: 'a234e408-7adc-4fcc-8b97-29de6b7ac9eb', i: 0 }, sections: null }] }, { id: '7a922df0-9fa8-4404-bb02-0db3199fa575', node: 'xor', position: { x: 631, y: 257 }, outgoingPoints: [{ i: 0, p: { id: 'bf760821-0e13-42ec-b9a3-ced99454dd69', i: 0 }, sections: null }] }, { id: '04f7bdfe-9b01-429e-b6b0-afd3c2026a94', node: 'and', position: { x: 635, y: 491 }, outgoingPoints: [{ i: 0, p: { id: 'eaae7c42-84cd-4d2b-bcf5-d5255623a3c7', i: 1 }, sections: null }] }, { type: 'inputs', position: { x: 138, y: 343 }, id: '7ef86cc1-5352-498f-9731-f0ee877c8cf6', outgoingPoints: [{ i: 0, p: { id: '759f3ddf-7ebd-428b-b9a8-367c0600a35d', i: 0 }, sections: null }, { i: 1, p: { id: '759f3ddf-7ebd-428b-b9a8-367c0600a35d', i: 1 }, sections: null }, { i: 0, p: { id: '04f7bdfe-9b01-429e-b6b0-afd3c2026a94', i: 0 }, sections: null }, { i: 1, p: { id: '04f7bdfe-9b01-429e-b6b0-afd3c2026a94', i: 1 }, sections: null }, { i: 2, p: { id: '7a922df0-9fa8-4404-bb02-0db3199fa575', i: 1 }, sections: null }, { i: 2, p: { id: 'a234e408-7adc-4fcc-8b97-29de6b7ac9eb', i: 1 }, sections: null }] }, { type: 'outputs', position: { x: 1049, y: 352 }, id: 'bf760821-0e13-42ec-b9a3-ced99454dd69' }],
          outputs: ['SUM', 'CARRY'],
          inputs: ['A', 'B', 'CARRY']
        },
        '4-bit-adder': {
          name: '4-Bit Adder',
          categories: ['default'],
          nodes: [{ type: 'outputs', position: { x: 1213, y: 262 }, id: 'b615ac2e-d9c6-44b0-af7a-14174b5f13e2' }, { id: '68c77ea7-c44e-4480-baa5-b2791adb8ec9', node: '1-bit-Adder', position: { x: 809, y: 97 }, outgoingPoints: [{ i: 0, p: { id: 'b615ac2e-d9c6-44b0-af7a-14174b5f13e2', i: 0 }, sections: null }, { i: 1, p: { id: 'b615ac2e-d9c6-44b0-af7a-14174b5f13e2', i: 4 }, sections: null }] }, { id: 'a2abd8cd-fe05-4dc8-aef4-35e7d9928ecf', node: '1-bit-Adder', position: { x: 217, y: 472 }, outgoingPoints: [{ i: 1, p: { id: '3e4c0aa6-6928-44ca-b9dd-ef64965ee64e', i: 2 }, sections: null }, { i: 0, p: { id: 'b615ac2e-d9c6-44b0-af7a-14174b5f13e2', i: 3 }, sections: null }] }, { id: '3e4c0aa6-6928-44ca-b9dd-ef64965ee64e', node: '1-bit-Adder', position: { x: 428, y: 351 }, outgoingPoints: [{ i: 1, p: { id: '79349076-997b-4d32-b79b-e630061f8480', i: 2 }, sections: null }, { i: 0, p: { id: 'b615ac2e-d9c6-44b0-af7a-14174b5f13e2', i: 2 }, sections: null }] }, { id: '79349076-997b-4d32-b79b-e630061f8480', node: '1-bit-Adder', position: { x: 634, y: 218 }, outgoingPoints: [{ i: 1, p: { id: '68c77ea7-c44e-4480-baa5-b2791adb8ec9', i: 2 }, sections: null }, { i: 0, p: { id: 'b615ac2e-d9c6-44b0-af7a-14174b5f13e2', i: 1 }, sections: null }] }, { type: 'inputs', position: { x: -134, y: 78 }, id: '683f9458-179a-4093-84db-a2d464d07d9a', outgoingPoints: [{ i: 0, p: { id: '68c77ea7-c44e-4480-baa5-b2791adb8ec9', i: 0 }, sections: null }, { i: 4, p: { id: '68c77ea7-c44e-4480-baa5-b2791adb8ec9', i: 1 }, sections: null }, { i: 1, p: { id: '79349076-997b-4d32-b79b-e630061f8480', i: 0 }, sections: null }, { i: 5, p: { id: '79349076-997b-4d32-b79b-e630061f8480', i: 1 }, sections: null }, { i: 6, p: { id: '3e4c0aa6-6928-44ca-b9dd-ef64965ee64e', i: 1 }, sections: null }, { i: 7, p: { id: 'a2abd8cd-fe05-4dc8-aef4-35e7d9928ecf', i: 1 }, sections: null }, { i: 3, p: { id: 'a2abd8cd-fe05-4dc8-aef4-35e7d9928ecf', i: 0 }, sections: null }, { i: 2, p: { id: '3e4c0aa6-6928-44ca-b9dd-ef64965ee64e', i: 0 }, sections: null }, { i: 8, p: { id: 'a2abd8cd-fe05-4dc8-aef4-35e7d9928ecf', i: 2 }, sections: null }] }],
          outputs: ['SUM;>BIN4.4', 'SUM;>BIN4.3', 'SUM;>BIN4.2', 'SUM;>BIN4.1', 'CARRY'],
          inputs: ['A;>BIN4.4', 'A;>BIN4.3', 'A;>BIN4.2', 'A;>BIN4.1', 'B;>BIN4.4', 'B;>BIN4.3', 'B;>BIN4.2', 'B;>BIN4.1', 'CARRY']
        }
      },
      custom: []
    }
  },
  mutations: {
    addCustomNode (state, payload) {
      state.nodeLibary.custom.push(payload)
      localStorage.setItem('customNodes', JSON.stringify(state.nodeLibary.custom))
    },
    loadCustomNodes (state) {
      var customNodes = localStorage.getItem('customNodes')
      if (customNodes) {
        try {
          JSON.parse(customNodes).forEach(x => {
            state.nodeLibary.custom.push(x)
          })
        } catch {}
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
