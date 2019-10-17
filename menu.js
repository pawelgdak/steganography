const { Menu } = require("electron")

const template = [
    {
        label: 'File',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'quit' }
        ]
    },
]

const menu = Menu.buildFromTemplate(template)

module.exports.menu = menu;