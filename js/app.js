new Vue({
  el: "#app",
  data: {
    searchEngineConfig: {
      weapon: {
        data_url: 'https://gist.githubusercontent.com/eeemptyy/55e240842de6a7158e12d230a61b57ff/raw/ff6b647e8c0f0f34b88009a72d870b137c24bd40/weapon.json',
        engine: undefined,
        data: [],
        config: {
          fields: ["Name", "Type", "Talent"], // fields to index for full-text search
          storeFields: ["Name", "Type", "Variant", "Talent", "Mods", "id", "Drop Location", "_exotic"], // fields to return with search results
          searchOptions: {
            boost: {
              "Name": 2
            },
            fuzzy: 0.2,
            prefix: true
          }
        }
      },
      gear: {
        data_url: 'https://gist.githubusercontent.com/eeemptyy/0d0b23441dc735b8c7bb6e8013c25a58/raw/08e3a438a2ce4429b9e816049eda419931b653b0/band.json',
        engine: undefined,
        data: [],
        config: {
          fields: ["Set Name", "Core"], // fields to index for full-text search
          storeFields: ["Set Name", "id", "Core", "Set Bonus (1)", "Set Bonus (2)", "Set Bonus (3)", "Set Bonus (4)", "Backpack Talent", "Chest Talent"], // fields to return with search results
          searchOptions: {
            boost: {
              "Set Name": 2
            },
            fuzzy: 0.2,
            prefix: true
          }
        }
      },
      talent: {
        data_url: 'https://gist.githubusercontent.com/eeemptyy/6a70c5016e6390496b1a6b2efc0d7b5b/raw/e8f2c4aacc17fea6880b99b93ba9be270e713215/talent.json',
        engine: undefined,
        data: [],
        config: {
          fields: ["Name", "Slot", "Description"], // fields to index for full-text search
          storeFields: ["Name", "Slot", "Description", "Type"], // fields to return with search results
          searchOptions: {
            boost: {
              "Name": 2
            },
            fuzzy: 0.2,
            prefix: true
          }
        }
      },
      mod: {
        data_url: '',
        engine: undefined,
        data: []
      }
    },
    group: 'gear',
    search: '',
    items: [],
    results: [],
  },
  watch: {
    group: function(value) {
      if (this.searchEngineConfig[this.group].engine == undefined) {
        this.initialMiniSearch(value);
      }
      this.resetResult();
    },
    search: function (value) {
      engine = this.getEngine();
      if (value === "") {
        this.resetResult();
      } else {
        this.results = engine.search(value);
      }
    }
  },
  methods: {
    initialMiniSearch: function (group) {
      if (group == undefined) {
        group = this.group;
      }

      this.searchEngineConfig[group].engine = new MiniSearch(this.searchEngineConfig[group].config);

      this.searchEngineConfig[group].engine.addAll(this.searchEngineConfig[group].data);

      return this.searchEngineConfig[group].engine;
    },
    getGroupUrl: function (group) {
      if (group == undefined) {
        group = this.group;
      }
      return this.searchEngineConfig[group].data_url;
    },
    getEngine: function () {
      return this.searchEngineConfig[this.group].engine;
    },
    resetResult: function () {
      this.results = this.searchEngineConfig[this.group].data;
    }
  },
  mounted() {
    data_url = this.getGroupUrl('gear');
    console.log(data_url)
    axios(data_url).then((data) => {
      this.searchEngineConfig['gear'].data = data.data
      this.resetResult();
      console.log('init')
      this.initialMiniSearch();
    });

    data_url = this.getGroupUrl('weapon');
    axios(data_url).then((data) => {
      this.searchEngineConfig['weapon'].data = data.data
    });

    data_url = this.getGroupUrl('talent');
    axios(data_url).then((data) => {
      this.searchEngineConfig['talent'].data = data.data
    });
  }
});
