'use strict';
const fs = require('fs');
const path = require('path');
const async = require('async');
const readFile = require('../util/read_file');
const convertMjmlToHtml = require('../util/convert_mjml_to_html');
const generateFilenameWithExt = require('../util/generate_filename_with_ext');
const sanitizePlaceholders = require('../util/sanitize_placeholders');

const PLACEHOLDER_REGEX = /\{\{([^}]+)\}\}/g;
const CONVERTERS = {
  'mjml': generateHtmlFromMjml
};

const HTML_TEMPLATES_BASE_PATH = path.join(__dirname, '../../templates/html');
const ORIGINAL_TEMPLATES_BASE_PATH = path.join(__dirname, '../../templates/originals');

function generateHtmlTemplate(data, callback) {

  let generator = CONVERTERS[data.type];

  generator(data, callback);
}

function writeToFile(filepath, fileContent, callback) {

  fs.writeFile(filepath, fileContent, function(err) {
    if (err) {
      return callback(err);
    }

    return callback(null, {output: 'done'});
  });
}

function generateHtmlFromMjml(data, callback) {

  const convertedMjml = convertMjmlToHtml(data.content);
  if (convertedMjml.error) {
    return callback(convertedMjml.error);
  }

  async.parallel({
    writeOriginal: function(done) {
      const originalFilePath = path.join(ORIGINAL_TEMPLATES_BASE_PATH, generateFilenameWithExt(data.filename, data.type));
      writeToFile(originalFilePath, data.content, done);
    },
    writeHtml: function(done) {
      const htmlFilePath = path.join(HTML_TEMPLATES_BASE_PATH, generateFilenameWithExt(data.filename, 'html'));
      writeToFile(htmlFilePath, convertedMjml.html, done);
    }
  }, function(err) {
    if (err) {
      return callback(err);
    }

    return callback(null, {output: 'done'});
  });
}

function getListOfHtmlTemplates(callback) {

  fs.readdir(HTML_TEMPLATES_BASE_PATH, function(err, files) {
    if (err) {
      return callback(err);
    }

    return callback(null, files);
  });
}

function getTemplateDetails(filename, type, callback) {

  const basepath = (type === 'html') ? HTML_TEMPLATES_BASE_PATH : ORIGINAL_TEMPLATES_BASE_PATH;
  const data = readFile(path.join(basepath, generateFilenameWithExt(filename, type)));

  if (data.error) {
    return callback(data.error);
  }

  const placeholders = data.content.match(PLACEHOLDER_REGEX);

  const res = {
    content: data.content,
    placeholders: sanitizePlaceholders(placeholders, ['{{', '}}'])
  };

  return callback(null, res);
}

module.exports = {
  generateHtmlTemplate: generateHtmlTemplate,
  getListOfHtmlTemplates: getListOfHtmlTemplates,
  getTemplateDetails: getTemplateDetails
};