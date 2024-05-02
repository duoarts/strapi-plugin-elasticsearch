const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");
const path = require("path");

let client = null;

module.exports = ({ strapi }) => ({
  async initializeSearchEngine({ host, uname, password, cert }) {
    try {
      client = new Client({
        node: host,
        auth: {
          username: uname,
          password: password,
        },
        tls: {
          ca: cert,
          rejectUnauthorized: false,
        },
      });
    } catch (err) {
      if (err.message.includes("ECONNREFUSED")) {
        console.error(
          "strapi-plugin-elasticsearch : Connection to ElasticSearch at ",
          host,
          " refused."
        );
        console.error(err);
      } else {
        console.error(
          "strapi-plugin-elasticsearch : Error while initializing connection to ElasticSearch."
        );
        console.error(err);
      }
      throw err;
    }
  },
  async createIndex(indexName) {
    try {
      const exists = await client.indices.exists({ index: indexName });
      if (!exists) {
        console.log(
          "strapi-plugin-elasticsearch : Search index ",
          indexName,
          " does not exist. Creating index."
        );

        // text type: Optimized for full-text search, the text type fields are analyzed,
        //  which means the text is broken down into terms or tokens using a tokenizer and optionally further processed by filters
        //  (like lowercasing, removing punctuation, etc.).
        //   This is ideal for searches where the user might input a fragment of the field's content (like a part of a name or a sentence).
        // keyword type: Not analyzed but indexed as a whole single term.
        //  This is perfect for filtering, aggregations, and sorting, where exact matches are crucial.
        //  For example, when filtering by a category, tag, or any identifier that requires precise matching.

        // CHANGED: we add mappings here explictly, so we need to keep this in sync
        await client.indices.create({
          index: indexName,
          body: {
            settings: {
              analysis: {
                tokenizer: {
                  ngram_tokenizer: {
                    type: "ngram",
                    min_gram: 3,
                    max_gram: 5,
                  },
                },
                analyzer: {
                  ngram_analyzer: {
                    type: "custom",
                    tokenizer: "ngram_tokenizer",
                    filter: ["lowercase"]
                  },
                },
              },
              // Adjusting max ngram diff setting to allow min_gram and max_gram difference of 2
              index: {
                max_ngram_diff: 2,
              },
            },
            mappings: {
              properties: {
                categories: {
                  properties: {
                    createdAt: {
                      type: date,
                      index: false,
                    },
                    id: {
                      type: long,
                      index: false,
                    },
                    name: {
                      type: "text",
                      analyzer: "ngram_analyzer",
                      fields: {
                        keyword: {
                          type: "keyword"
                        }
                      },

                    },
                    publishedAt: {
                      type: date,
                      index: false,
                    },
                    updatedAt: {
                      type: date,
                      index: false,
                    },
                  },
                },
                description: {
                  type: "text",
                  analyzer: "ngram_analyzer",
                  fields: {
                    keyword: {
                      type: "keyword"
                    }
                  },
                },
                file: {
                  properties: {
                    createdAt: {
                      type: date,
                      index: false,
                    },
                    ext: {
                      type: "text",
                      index: false,
                    },
                    folderPath: {
                      type: "text",
                      index: false,
                    },
                    formats: {
                      properties: {
                        large: {
                          properties: {
                            ext: {
                              type: "text",
                              index: false,
                            },
                            hash: {
                              type: "text",
                              index: false,
                            },
                            height: {
                              type: long,
                              index: false,
                            },
                            mime: {
                              type: "text",
                              index: false,
                            },
                            name: {
                              type: "text",
                              index: false,
                            },
                            size: {
                              type: float,
                              index: false,
                            },
                            sizeInBytes: {
                              type: long,
                              index: false,
                            },
                            url: {
                              type: "text",
                              index: false,
                            },
                            width: {
                              type: long,
                              index: false,
                            },
                          },
                        },
                        medium: {
                          properties: {
                            ext: {
                              type: "text",
                              index: false,
                            },
                            hash: {
                              type: "text",
                              index: false,
                            },
                            height: {
                              type: long,
                              index: false,
                            },
                            mime: {
                              type: "text",
                              index: false,
                            },
                            name: {
                              type: "text",
                              index: false,
                            },
                            size: {
                              type: float,
                              index: false,
                            },
                            sizeInBytes: {
                              type: long,
                              index: false,
                            },
                            url: {
                              type: "text",
                              index: false,
                            },
                            width: {
                              type: long,
                              index: false,
                            },
                          },
                        },
                        small: {
                          properties: {
                            ext: {
                              type: "text",
                              index: false,
                            },
                            hash: {
                              type: "text",
                              index: false,
                            },
                            height: {
                              type: long,
                              index: false,
                            },
                            mime: {
                              type: "text",
                              index: false,
                            },
                            name: {
                              type: "text",
                              index: false,
                            },
                            size: {
                              type: float,
                              index: false,
                            },
                            sizeInBytes: {
                              type: long,
                              index: false,
                            },
                            url: {
                              type: "text",
                              index: false,
                            },
                            width: {
                              type: long,
                              index: false,
                            },
                          },
                        },
                        thumbnail: {
                          properties: {
                            ext: {
                              type: "text",
                              index: false,
                            },
                            hash: {
                              type: "text",
                              index: false,
                            },
                            height: {
                              type: long,
                              index: false,
                            },
                            mime: {
                              type: "text",
                              index: false,
                            },
                            name: {
                              type: "text",
                              index: false,
                            },
                            size: {
                              type: float,
                              index: false,
                            },
                            sizeInBytes: {
                              type: long,
                              index: false,
                            },
                            url: {
                              type: "text",
                              index: false,
                            },
                            width: {
                              type: long,
                              index: false,
                            },
                          },
                        },
                      },
                    },
                    hash: {
                      type: "text",
                      index: false,
                    },
                    height: {
                      type: long,
                      index: false,
                    },
                    id: {
                      type: long,
                      index: false,
                    },
                    mime: {
                      type: "text",
                      index: false,
                    },
                    name: {
                      type: "text",
                      index: false,
                    },
                    provider: {
                      type: "text",
                      index: false,
                    },
                    size: {
                      type: float,
                      index: false,
                    },
                    updatedAt: {
                      type: date,
                      index: false,
                    },
                    url: {
                      type: "text",
                      index: false,
                    },
                    width: {
                      type: long,
                      index: false,
                    },
                  },
                },
                labels: {
                  properties: {
                    createdAt: {
                      type: date,
                      index: false,
                    },
                    id: {
                      type: long,
                      index: false,
                    },
                    publishedAt: {
                      type: date,
                      index: false,
                    },
                    type: {
                      type: "text",
                      index: false,
                    },
                    updatedAt: {
                      type: date,
                      index: false,
                    },
                    value: {
                      type: "text",
                      analyzer: "ngram_analyzer",
                      fields: {
                        keyword: {
                          type: "keyword"
                        }
                      },
                    },
                  },
                },
                orderCount: {
                  type: "text",
                  index: false,
                },
                title: {
                  type: "text",
                  analyzer: "ngram_analyzer",
                  fields: {
                    keyword: {
                      type: "keyword"
                    }
                  },
                },
                wishlistCount: {
                  type: "text",
                  index: false,
                },
              },
            },
          },
        });
      }
    } catch (err) {
      if (err.message.includes("ECONNREFUSED")) {
        console.log(
          "strapi-plugin-elasticsearch : Error while creating index - connection to ElasticSearch refused."
        );
        console.log(err);
      } else {
        console.log(
          "strapi-plugin-elasticsearch : Error while creating index."
        );
        console.log(err);
        throw err;
      }
    }
  },
  async deleteIndex(indexName) {
    try {
      await client.indices.delete({
        index: indexName,
      });
    } catch (err) {
      if (err.message.includes("ECONNREFUSED")) {
        console.log(
          "strapi-plugin-elasticsearch : Connection to ElasticSearch refused."
        );
        console.log(err);
      } else {
        console.log(
          "strapi-plugin-elasticsearch : Error while deleting index to ElasticSearch."
        );
        console.log(err);
      }
    }
  },
  async attachAliasToIndex(indexName) {
    try {
      const pluginConfig = await strapi.config.get("plugin.elasticsearch");
      const aliasName = pluginConfig.indexAliasName;
      const aliasExists = await client.indices.existsAlias({ name: aliasName });
      if (aliasExists) {
        console.log(
          "strapi-plugin-elasticsearch : Alias with this name already exists, removing it."
        );
        await client.indices.deleteAlias({ index: "*", name: aliasName });
      }
      const indexExists = await client.indices.exists({ index: indexName });
      if (!indexExists) await this.createIndex(indexName);
      console.log(
        "strapi-plugin-elasticsearch : Attaching the alias ",
        aliasName,
        " to index : ",
        indexName
      );
      await client.indices.putAlias({ index: indexName, name: aliasName });
    } catch (err) {
      if (err.message.includes("ECONNREFUSED")) {
        console.log(
          "strapi-plugin-elasticsearch : Attaching alias to the index - Connection to ElasticSearch refused."
        );
        console.log(err);
      } else {
        console.log(
          "strapi-plugin-elasticsearch : Attaching alias to the index - Error while setting up alias within ElasticSearch."
        );
        console.log(err);
      }
    }
  },
  async checkESConnection() {
    if (!client) return false;
    try {
      await client.ping();
      return true;
    } catch (error) {
      console.error(
        "strapi-plugin-elasticsearch : Could not connect to Elastic search."
      );
      console.error(error);
      return false;
    }
  },
  async indexDataToSpecificIndex({ itemId, itemData }, iName) {
    try {
      await client.index({
        index: iName,
        id: itemId,
        document: itemData,
      });
      await client.indices.refresh({ index: iName });
    } catch (err) {
      console.log(
        "strapi-plugin-elasticsearch : Error encountered while indexing data to ElasticSearch."
      );
      console.log(err);
      throw err;
    }
  },
  async indexData({ itemId, itemData }) {
    const pluginConfig = await strapi.config.get("plugin.elasticsearch");
    return await this.indexDataToSpecificIndex(
      { itemId, itemData },
      pluginConfig.indexAliasName
    );
  },
  async removeItemFromIndex({ itemId }) {
    const pluginConfig = await strapi.config.get("plugin.elasticsearch");
    try {
      await client.delete({
        index: pluginConfig.indexAliasName,
        id: itemId,
      });
      await client.indices.refresh({ index: pluginConfig.indexAliasName });
    } catch (err) {
      if (err.meta.statusCode === 404)
        console.error(
          "strapi-plugin-elasticsearch : The entry to be removed from the index already does not exist."
        );
      else {
        console.error(
          "strapi-plugin-elasticsearch : Error encountered while removing indexed data from ElasticSearch."
        );
        throw err;
      }
    }
  },
  async searchData(searchQuery) {
    try {
      const pluginConfig = await strapi.config.get("plugin.elasticsearch");
      const result = await client.search({
        index: pluginConfig.indexAliasName,
        ...searchQuery,
      });
      return result;
    } catch (err) {
      console.log(
        "Search : elasticClient.searchData : Error encountered while making a search request to ElasticSearch."
      );
      throw err;
    }
  },
});
