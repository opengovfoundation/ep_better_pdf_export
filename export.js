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
    "format": "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
    "orientation": "portrait", // portrait or landscape
    "border": {
      "top": "2in",            // default is 0, units: mm, cm, in, px
      "right": "1in",
      "bottom": "2in",
      "left": "1.5in"
    },

    // File options
    "type": "pdf",             // allowed file types: png, jpeg, pdf
    "quality": "100"           // only used for types png & jpeg
  }

  // TODO
  // if(settings.ep_pdf.options !== false){
  //  options = settings.ep_pdf.options;
  // }

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
}

