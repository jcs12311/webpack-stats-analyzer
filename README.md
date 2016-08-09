## note
This tool only analyze node_modules.
## install
` sudo npm install webpack-stats-analyzer -g`

## usage
```
Usage: webpack-stats-analyzer [stats.json files]
```

## example
`webpack-stats-analyzer [stats.json files]` will generate a json files on current folder.
```
// stats.json.2016_8_9_15_54_241.json
{
  // all fields sort by size
  // this fields show repetition modules, it means current project has two version's historyjs, 
  // the size 48393 means the total file size that you import from historyjs 2.1.2.
  "repetitionModules": [
    {
      "name": "history",
      "size": 73376,
      "versions": [
        {
          "name": "2.1.2",
          "size": 48393
        },
        {
          "name": "1.17.0",
          "size": 24983
        }
      ]
    },...],
  "modules": [
    {
      "name": "react/15.2.1",
      "size": 620499
    },
    {
      "name": "jquery/2.2.4",
      "size": 257551
    },
    {
      "name": "immutable/3.8.1",
      "size": 142477
    },...],
  // this fields show all you files, and its sources
  "files": [
    {
      "name": "/dist/jquery.js",
      "size": 257551,
      "sources": [
        "./~/.npminstall/jquery/2.2.4/jquery/dist/jquery.js"
      ]
    },
    {
      "name": "/dist/immutable.js",
      "size": 142477,
      "sources": [
        "./~/.npminstall/immutable/3.8.1/immutable/dist/immutable.js"
      ]
    },
    {
      "name": "/lib/createHistory.js",
      "size": 16772,
      "sources": [
        "./~/.npminstall/history/2.1.2/history/lib/createHistory.js",
        "./~/.npminstall/history/1.17.0/history/lib/createHistory.js"
      ]
    },...]
}
```