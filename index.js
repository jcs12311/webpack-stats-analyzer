#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

/**
 * analyzer modules return a new object
 * @return {object} - { 
 *   files: [{
 *     name: "module file's name, eg: ReactClass.js",
 *     size: "module file size",
 *     files: [fullname1, fullname2],
 *   }, ...],
 *   modules: [{
 *     name: "module name + module version eg: react/15.2.0",
 *     size: "these module's files total size",
 *   }, ...],
 *   repetitionModules: [{
 *     name: "module name eg: react",
 *     size,
 *     versions: [{
 *       name: version1,
 *       size
 *     }, ...],
 *   }, ...]
 */
function analyzerModules(modules){
  var result = {};
  var nameReg = /.npminstall\/(.*?)\/(.*?)(?:\/.*)?(\/.*\/.*\.js)$/;
  var files = {}, mods = {}, repMods = {};

  for(var i = 0; i < modules.length; i++){
    var curModule = modules[i];
    var names = nameReg.exec(curModule.name);
    if(!names) {
      // console.error('cant match the module name!', curModule.name);
    } else {
      var fileName = names[3],
          moduleName = names[1],
          moduleVersion = names[2];
      var fName = moduleName + '_' + fileName,
          fvName = moduleName + '/' + moduleVersion;

      if(!files[fName]){
        files[fName] = {
          name: fileName,
          size: curModule.size,
          sources: [curModule.name]
        };
      } else {
        files[fName].size += curModule.size;
        files[fName].sources.push(curModule.name);
      }

      if(!mods[fvName]){
        mods[fvName] = {
          name: fvName,
          size: curModule.size
        };
      } else {
        mods[fvName].size += curModule.size;
      }

      if(!repMods[moduleName]){
        repMods[moduleName] = {
          name: moduleName,
          size: curModule.size,
          versions: {}
        };
      } else {
        repMods[moduleName].size = repMods[moduleName].size+curModule.size;
      }
      if(!repMods[moduleName].versions[moduleVersion]){
        repMods[moduleName].versions[moduleVersion] = {
          name: moduleVersion,
          size: curModule.size
        };
      } else {
        repMods[moduleName].versions[moduleVersion].size += curModule.size;
      }
    }
  }
  
  result.files = objToArray(files);
  result.modules = objToArray(mods);

  for(var def in repMods){
    repMods[def].versions = objToArray(repMods[def].versions);
    if(repMods[def].versions.length < 2){
      delete repMods[def];
    }
  }
  result.repetitionModules = objToArray(repMods);

  return result;
}


function objToArray(obj){
  var arr = [];
  for(var def in obj){
    arr.push(obj[def]);
  }
  return arr;
}

function sort(arr, key){
  return arr.sort(function(n, m){
    return n[key] >= m[key] ? -1:1;
  })
}

var filename = argv._[0];

function getDateName(){
  var d = new Date();
  return d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()
    +'_'+d.getHours()+'_'+d.getMinutes()+'_'+d.getMilliseconds();
}

function parseStats(obj) {
  var result = analyzerModules(obj.modules);
  
  var data = {};
  data.repetitionModules = sort(result.repetitionModules, 'size');
  data.modules = sort(result.modules, 'size');
  data.files =  sort(result.files, 'size');
  var str = JSON.stringify(data, null, 2);
  return str;
}

fs.readFile(filename, 'utf8', function(err, data) {
  if(!err){
    var obj;
    try {
      obj = JSON.parse(data);
    } catch(e){
      console.error('invail json file!');
      return;
    }

    var result = parseStats(obj);
    var fileName = filename+'.'+getDateName()+'.json';
    fs.writeFile(fileName, result, 'utf8', function(err){
      if(err){
        console.error(err);
      }
    });
  } else {
    console.error(err);
  }
});

