const emojiRegex = require("emoji-regex");
const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const packageVersion = require("./package.json").version;
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const searchFilter = require("./src/filters/searchFilter");

module.exports = function (eleventyConfig) {
  eleventyConfig.setWatchJavaScriptDependencies(false);

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addWatchTarget("./src/sass/");

  // eleventyConfig.addPassthroughCopy("./src/css");
  // eleventyConfig.addPassthroughCopy("./src/fonts");
  // eleventyConfig.addPassthroughCopy("./src/img");
  // eleventyConfig.addPassthroughCopy("./src/mi-guatemala");
  // eleventyConfig.addPassthroughCopy("./src/favicon.png");
  // eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy({ "./assets": "" });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode("packageVersion", () => `v${packageVersion}`);

  eleventyConfig.addFilter("searchByMunicipio", (municipio, data) => {
    return data.find((item) => {
      return item.id === municipio;
    });
  });

  eleventyConfig.addFilter("paginationSlice", (pagination) => {
    let pages = pagination.pages;
    let pageNumber = pagination.pageNumber;
    let start = pageNumber - 5;
    
    if (start < 0) {
      start = 0;
    }

    return pages.slice(start, pageNumber + 5);
  })

  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    const regex = emojiRegex();
    // Remove Emoji first
    let string = str.replace(regex, "");

    return slugify(string, {
      lower: true,
      replacement: "-",
      remove: /[*+~·,()'"`´%!?¿:@\/]/g,
    });
  });

  eleventyConfig.addFilter("jsonTitle", (str) => {
    if (!str) {
      return;
    }
    let title = str.replace(/((.*)\s(.*)\s(.*))$/g, "$2&nbsp;$3&nbsp;$4");
    title = title.replace(/"(.*)"/g, '\\"$1\\"');
    return title;
  });

  eleventyConfig.addFilter("search", searchFilter);

  eleventyConfig.addFilter("realSlice", function(array, lenght) {
    return array.slice(0, lenght);
  });

  eleventyConfig.addFilter('toLocaleString', function(value) {
    return parseFloat(value).toLocaleString('lan');
  });

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "tdbc-anchor",
    permalinkSymbol: "#",
    permalinkSpace: false,
    level: [1, 2, 3],
    slugify: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[\s+~\/]/g, "-")
        .replace(/[().`,%·'"!?¿:@*]/g, ""),
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // eleventyConfig.addCollection("chartTematicasByMunicipios", function (collectionApi) {
  //   let newCollection = [];
  //   var tematicas = collectionApi.getFilteredByTag("tematicas");

  //   collectionApi.getFilteredByTag("municipios").forEach((municipio) => {
  //     tematicas.forEach((tematica) => {

  //       newCollection.push({
  //         tematica: tematica.data.title,
  //         municipio: municipio.data.municipio
  //       });
  //     })
  //   });

  //   return newCollection;
  // });

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
    },
  };
};
