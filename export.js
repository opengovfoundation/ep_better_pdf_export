var pdf = require("./node_modules/html-pdf");
var fs = require("fs");
var settings = require("ep_etherpad-lite/node/utils/Settings");

exports.exportConvert = function(hook_name, args, callback){
  var srcFile = args.srcFile;
  var destFile = args.destFile;

  if(!settings.ep_pdf){
    settings.ep_pdf = {};
  }

  var options = {
    // Export options
    "directory": "/tmp",       // The directory the file gets written into if not using .toFile(filename, callback). default: '/tmp'
    "format": "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
    "orientation": "portrait", // portrait or landscape
    "border": {
      "top": "2in",            // default is 0, units: mm, cm, in, px
      "right": "1in",
      "bottom": "2in",
      "left": "1.5in"
    },
    "header": {
      "height": "45mm",
      "contents": '<div style="text-align: center;">Etherpad HYPE!</div>'
    },
    "footer": {
      "height": "28mm",
      "contents": '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>'
    },

    // File options
    "type": "pdf",             // allowed file types: png, jpeg, pdf
    "quality": "75",           // only used for types png & jpeg

    // Script options
    "phantomPath": "./node_modules/phantomjs/bin/phantomjs", // PhantomJS binary which should get downloaded automatically
    "phantomArgs": [], // array of strings used as phantomjs args e.g. ["--ignore-ssl-errors=yes"]
    "script": '/url',           // Absolute path to a custom phantomjs script, use the file in lib/scripts as example
    "timeout": 30000,           // Timeout that will cancel phantomjs, in milliseconds
  }

  // TODO
  if(settings.ep_pdf.options !== false){
    options = settings.ep_pdf.options;
  }

  // First things first do we handle this doc type?
  var docType = destFile.split('.').pop();

  if(docType !== "pdf") return callback("Not a PDF"); // we don't support this doctype in this plugin
  var results = "";
  // console.log("Using html-pdf to convert PDF file");

  var html = fs.readFileSync(srcFile, 'utf8')

  pdf.create(html, options).toFile(destFile, function(err, res){
    // console.log(res.filename);
    if(err){
      console.error("error during PDF handling");
      return callback(err);
    }else{
      console.log("Success rendering PDF using plugin");
      return callback(null, "success");
    }
  });

  /*
  pdf.convertToHtml(
  {
    path: srcFile
  }, options).then(
  function(result) {
    console.log(result.value);
    fs.writeFile(destFile, "<!doctype html>\n<html lang=\'en\'>\n<body>\n"+result.value+"\n</body>\n</html>\n", 'utf8', function(err){
      if(err) callback(err, null);
      callback(destFile);
    });
  })
  .fail(function(e){
    console.warn("pdf failed to import this file");
    return callback();
  })
  .done(function(){
    // done
  });
  */
}

/*
function transformElement(element) {
  if (element.children) {
    element.children.forEach(transformElement);
  }
  if (element.type === "paragraph") {
    if (element.alignment === "center" && !element.styleId) {
      element.styleName = "center";
    }
  }
  return element;
}
*/
