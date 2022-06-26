module.exports = {
  apps : [{
    name   : "nasa-server",
    script : "./src/server.js",
    instances: "max",
    exec_mode: "cluster"
  }]
}
