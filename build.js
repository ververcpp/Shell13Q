var markdown = require('marked');
var fs = require('fs');
var jade = require('jade');
var _ = require('lodash');
var pangunode = require('pangunode');

function main(options) {
  loadLanguages(options.languagesDir)
  .sort(function(a, b) {
    return a.id < b.id ? 1 : -1;
  })
  .forEach(function(lang,_,languages) {
    outputLanguage(lang, languages, options);
  });
}

function loadLanguages(path) {
  var index = readJSON(path + '/languages.json');
  var availableListedLanguages = _.intersection(index.listed, fs.readdirSync(path));
  return availableListedLanguages.reduce(function(all, lang) {
    var langPath = path + '/' + lang;
    if (!fs.statSync(langPath).isDirectory()) return all;
    var data = _.assign(loadLanguage(langPath), {id: lang});
    return all.concat(data);
  }, []);
}

function loadLanguage(path) {
  var index = readJSON(path + '/index.json');
  var language = _.assign(index, {
    sections: index.sections.map(function(section) {
      return _.assign(section, {
        isIntro: section.link === 'Intro',
        article: loadArticle(path + '/Shell13Q-' + section.link + '.md')
      });
    })
  });
  language.navigation = language.sections;
  return language;
}

function loadArticle(path) {
  var text = fs.readFileSync(path, "utf-8");
  text = pangunode(text);
  var title = text.slice(0, text.indexOf('\n'));
  var content = processContent(text.slice(title.length)); 
  title = '<span class="number">' + title.slice(0, title.indexOf('.') + 1) + '</span><span class="title">' + title.slice(title.indexOf('.') + 1) + '</span>';
  title = markdown(title.replace(/\#/g, '').trim());
  title = title.slice(3, title.length - 5);

  return {
    title: title,
    content: content
  };
}

function processContent(text) {
  return markdown(text).replace(/'/, '&#39;');
}

function readJSON(path) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

function outputLanguage(lang, languages, opts) {
  var langBase = (lang.id === opts.baseLanguage 
                    ? '/' 
                    : '/' + lang.id + '/');
  fs.mkdir(opts.outDir + langBase, function(err) {
    if(err && err.code != "EEXIST") {
      console.error("Couldn't make dir " + opts.outDir + ": " + err);
      process.exit(1);
    }
    var out = opts.outDir + langBase + 'index.html';
    var perLangOpts = _.assign({out: out, languages: languages}, opts);
    writeTemplate(perLangOpts, lang);
  });
}

function writeTemplate(options, language) {
  var templateData = _.assign({language: language.id}, language, options);
  var jadeFile = fs.readFileSync(options.template);
  var jadeTemplate = jade.compile(jadeFile, {complieDebug: false, debug: false});
  var html = jadeTemplate(templateData);
  fs.writeFileSync(options.out, html);

}

exports.build = function (options) {
  options = _.defaults(options || {}, { languagesDir: 'doc', baseLanguage: 'zhtw', template: 'Shell13Q.jade', pathPrefix: 'Shell13Q/', outDir: 'site' });
  return main(options);
};

exports.build();