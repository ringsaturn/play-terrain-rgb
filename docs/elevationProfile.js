class ElevationProfile {
  constructor() {
    this.chart = null;
    this.elevationProvider = new ElevationProvider();

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic3ZjLW9rdGEtbWFwYm94LXN0YWZmLWFjY2VzcyIsImEiOiJjbG5sMnExa3kxNTJtMmtsODJld24yNGJlIn0.RQ4CHchAYPJQZSiUJ0O3VQ";
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [138.72739076614383, 35.36067113569001],
      zoom: 12,
    });

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true,
      },
      defaultMode: "draw_line_string",
    });
    this.map.addControl(this.draw);

    this.map.on("draw.create", async (e) => {
      const feature = e.features[0];
      await this.showChart(feature);
    });
    this.map.on("draw.delete", () => {
      this.draw.deleteAll();
      this.clearChart();
    });
    this.map.on("draw.update", async () => {
      await this.showChart();
    });
  }

  async showChart(feature) {
    this.clearChart();
    if (feature && feature.geometry) {
      const coordinates = feature.geometry.coordinates;
      if (coordinates) {
        await this.drawElevationProfile(coordinates);
      }
    }
  }

  sampleProfileLine(coordinates) {
    const options = { units: "meters" };
    const line = turf.lineString(coordinates);
    const lineLength = turf.length(line, options);
    let numSamples = 200;
    const metersPerPx = this.getZoomLevelResolution(coordinates[0][1], 15);
    console.log(metersPerPx);

    const stepSize = Math.max(metersPerPx, lineLength / numSamples);
    numSamples = lineLength / stepSize;

    const samples = [];
    for (let i = 0; i <= numSamples; i++) {
      const along = turf.along(line, i * stepSize, options);
      const coords = along.geometry.coordinates;
      samples.push(coords);
    }

    return samples;
  }

  getZoomLevelResolution(latitude, zoom) {
    const metersPerPx =
      (Math.cos(latitude * Math.PI / 180.0) * 2 * Math.PI * 6378137) /
      (256 * 2 ** zoom);
    return metersPerPx;
  }

  clearChart() {
    if (this.chart) {
      this.chart.detach();
    }
    document.getElementById("chart").innerHTML = "";
  }

  async drawElevationProfile(coordinates) {
    const samples = this.sampleProfileLine(coordinates);
    const elevationProfile = [];
    for (const c of samples) {
      const elevation = await this.elevationProvider.getElevation(c[1], c[0]);
      elevationProfile.push(elevation);
    }

    const minElevation = Math.min(...elevationProfile);

    this.chart = new Chartist.Line("#chart", {
      series: [elevationProfile],
    }, {
      low: minElevation - 100,
      showArea: true,
      showPoint: false,
      fullWidth: true,
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 4,
        fillHoles: false,
      }),
    });
  }
}

new ElevationProfile();
