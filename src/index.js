import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Node } from '../logic-engine/model/Node';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const node = new Node()

node.setup({
  f (a, b) {
    return a && b
  },
  inputs: [
    { name: 'A', type: 'boolean' },
    { name: 'B', type: 'boolean' }
  ],
  outputs: [
    { name: 'C', type: 'boolean' }
  ]
})

node.inputPorts[0].sendData(null, {
  type: 'boolean',
  value: true,
  visitedNodes: []
})

