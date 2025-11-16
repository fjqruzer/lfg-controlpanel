export const chartsConfig = {
  chart: {
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
      },
      autoSelected: "zoom",
    },
    zoom: {
      enabled: true,
      type: "x",
      autoScaleYaxis: true,
    },
    selection: {
      enabled: true,
      type: "x",
    },
  },
  title: {
    show: "",
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      style: {
        colors: "#37474f",
        fontSize: "13px",
        fontFamily: "inherit",
        fontWeight: 300,
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#37474f",
        fontSize: "13px",
        fontFamily: "inherit",
        fontWeight: 300,
      },
    },
  },
  grid: {
    show: true,
    borderColor: "#dddddd",
    strokeDashArray: 5,
    xaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 5,
      right: 20,
    },
  },
  fill: {
    opacity: 0.8,
  },
  tooltip: {
    theme: "dark",
    shared: true,
    intersect: false,
    y: {
      formatter: function (val) {
        return val !== undefined ? val.toLocaleString() : val;
      },
    },
  },
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "right",
    fontSize: "12px",
    fontFamily: "inherit",
    labels: {
      colors: "#37474f",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 2,
    },
    itemMargin: {
      horizontal: 10,
      vertical: 5,
    },
    onItemClick: {
      toggleDataSeries: true,
    },
    onItemHover: {
      highlightDataSeries: true,
    },
  },
};

export default chartsConfig;
