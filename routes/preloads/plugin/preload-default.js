/*
  Reasonably Secure Electron
  Copyright (C) 2019  Bishop Fox
  This program is free software; you can redistribute it and/or
  modify it under the terms of the GNU General Public License
  as published by the Free Software Foundation; either version 2
  of the License, or (at your option) any later version.
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
-------------------------------------------------------------------------
This preload script is callable from within the sandbox via postMessage,
but should not be directly accessible since it itself is not sandboxed.
*/

const { ipcRenderer } = require('electron');


window.addEventListener('message', (event) => {
  try {
    const msg = JSON.parse(event.data);
    if (msg.type === 'request') {
      if (['fs_'].some(prefix => msg.method.startsWith(prefix))) {
        ipcRenderer.send('ipc', msg);
      }
    }
  } catch (err) {
    console.error(err);
  }
});

ipcRenderer.on('ipc', (_, msg) => {
  try {
    if (msg.type === 'response' || msg.type === 'push' || msg.type === 'init') {
      console.log(JSON.parse(msg.data))

      window.postMessage(JSON.stringify(msg), '*');
    }
  } catch (err) {
    console.error(err);
  }
});